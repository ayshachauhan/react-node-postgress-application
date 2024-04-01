const { DataSource } = require('typeorm');
const path = require('path');

const dbdatasource = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: 'azentia',
  password: 'azentia',
  database: 'azentia',
  migrations: [path.join('migrations', '*.{ts,js}')],
  synchronize: false,
};

const dataSource = new DataSource(dbdatasource);

module.exports = dataSource;
