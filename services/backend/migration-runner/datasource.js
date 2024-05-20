const path = require('path');
const { DataSource } = require('typeorm');

const dbdatasource = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'azentia',
  password: 'azentia',
  database: 'azentia',
  migrations: [path.join('migrations', '*.{ts,js}')],
  synchronize: false,
};

console.log('dbdatasource', dbdatasource);

const dataSource = new DataSource(dbdatasource);

module.exports = dataSource;
