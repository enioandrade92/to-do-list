import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const options: DataSourceOptions = {
    type: 'postgres',
    port: Number(process.env['DB_PORT']),
    host: process.env['DB_HOST'],
    username: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    logging: false,
    entities: ['src/**/*.entity{.js,.ts}'],
    migrations: ['src/lib/typeorm/migrations/*.ts'],
};

const dataSource = new DataSource(options);

export default dataSource;
