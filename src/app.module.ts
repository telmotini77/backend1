import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
      inject: [require('@nestjs/config').ConfigService],
      useFactory: (configService: any) => {
        const host = configService.get('DB_HOST');
        const user = configService.get('DB_USERNAME');
        const pass = configService.get('DB_PASSWORD');
        const db = configService.get('DB_DATABASE');

        const hasPostgresCreds = host && user && pass && db && user !== 'your_username';

        if (hasPostgresCreds) {
          return {
            type: 'postgres',
            host,
            port: parseInt(configService.get('DB_PORT') || '5432', 10),
            username: user,
            password: pass,
            database: db,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV === 'development',
          };
        }

        // Fallback to an in-memory sqlite DB in development to avoid startup failures
        // when Postgres credentials are not configured.
        // This is safer for local development and CI where Postgres may not be available.
        // eslint-disable-next-line no-console
        console.warn('Postgres credentials missing or placeholder detected. Falling back to SQLite in-memory DB.');
        return {
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
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
