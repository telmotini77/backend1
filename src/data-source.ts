import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const hasPostgresCreds = !!(
  process.env.DB_HOST &&
  process.env.DB_USERNAME &&
  process.env.DB_PASSWORD &&
  process.env.DB_DATABASE &&
  process.env.DB_USERNAME !== 'your_username'
);

if (process.env.NODE_ENV === 'production' && !hasPostgresCreds) {
  throw new Error(
    'Missing Postgres configuration (DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE) required in production',
  );
}

const AppDataSource = new DataSource(
  hasPostgresCreds
    ? {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
      }
    : {
        type: 'sqlite',
        database: ':memory:',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: true,
      },
);

export default AppDataSource;
