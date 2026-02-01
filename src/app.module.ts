import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './users/auth.module';
import { GuardsModule } from './guards/guards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el ConfigModule esté disponible globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const user = configService.get<string>('DB_USERNAME');
        const pass = configService.get<string>('DB_PASSWORD');
        const db = configService.get<string>('DB_DATABASE');

        const hasPostgresCreds =
          host && user && pass && db && user !== 'your_username';

        if (process.env.NODE_ENV === 'production' && !hasPostgresCreds) {
          throw new Error(
            'Missing Postgres configuration (DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE) required in production',
          );
        }

        if (hasPostgresCreds) {
          return {
            type: 'postgres',
            host,
            port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
            username: user,
            password: pass,
            database: db,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV === 'development',
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
          };
        }

        // Fallback to an in-memory sqlite DB in development / CI to avoid startup failures
        // when Postgres credentials are not configured.

        console.warn(
          'Postgres credentials missing or placeholder detected. Falling back to SQLite in-memory DB.',
        );
        return {
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
        };
      },
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    GuardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
