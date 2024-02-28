const { DataSource } = require('typeorm');
const path = require('path');

const dbdatasource = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  migrations: [path.join('migrations', '*.js')],
  synchronize: false,
};

const dataSource = new DataSource(dbdatasource);

module.exports = dataSource;
