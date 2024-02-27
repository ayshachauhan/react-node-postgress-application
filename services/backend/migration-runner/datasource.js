const {DataSource} = require('typeorm')
const path = require('path');

const dbdatasource = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    migrations: [path.join('migrations', '*.js')], 
    synchronize: false,
};

const dataSource = new DataSource(dbdatasource);

module.exports = dataSource;