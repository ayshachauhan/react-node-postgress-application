const {DataSource} = require('typeorm')
const path = require('path');


// const __dirname = path.dirname(new URL(import.meta.url).pathname);

const dbdatasource = {
    // TypeORM PostgreSQL DB Drivers
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    // Database name
    database: 'postgres',
    // entities: [path.join('__dirname', '..', 'src', 'entities', 'users.entity.js')],
    migrations: [path.join('migrations', '*.ts')],
    // Synchronize database schema with entities 
    synchronize: false,
};
console.log(dbdatasource.migrations);
const dataSource = new DataSource(dbdatasource);

module.exports = dataSource;

