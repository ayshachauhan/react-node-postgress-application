const { DataSource } = require('typeorm');
const path = require('path');

const dbdatasource = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: [path.join('migrations', '*.{ts,js}')],
  synchronize: false,
};

const dataSource = new DataSource(dbdatasource);

module.exports = dataSource;
