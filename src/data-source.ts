import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const envFile = (() => {
  switch (process.env.NODE_ENV) {
    case 'local':
      return '.env.local';
    case 'development':
      return '.env.develop';
    case 'production':
      return '.env.production';
    default:
      throw new Error(
        `Unknown NODE_ENV value: ${process.env.NODE_ENV}. Expected one of: local, develop, production`,
      );
  }
})();
dotenv.config({ path: envFile });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
