'use strict';

const cwd    = process.cwd();
const config = require(`${cwd}/config/config`);
const util   = require(`${cwd}/helpers/util`);
const mysql  = require('anytv-node-mysql');
const fs     = require('fs');
const reset_query = fs.readFileSync(`${cwd}/database/truncate.sql`, 'utf-8').toString()
    + fs.readFileSync(`${cwd}/database/seed.sql`).toString();

config.DB.multipleStatements = true;

mysql.add('db', config.DB);


before((done) => {
    const db_config = util.clone(config.DB);
    const real_db   = db_config.database.replace('_test', '');
    const sql = fs.readFileSync(`${cwd}/database/schema.sql`, 'utf-8')
        .toString()
        .replace(new RegExp(real_db, 'gi'), db_config.database);

    db_config.database = real_db;

    mysql.use('db')
        .query(sql, (err) => {
            if (err) {
                console.log(err);
            }
            done();
        })
        .end();
});


beforeEach((done) => {
    mysql.use('db')
        .query(reset_query, (err) => {
            if (err) {
                console.log(err);
            }
            done();
        })
        .end();
});


after((done) => {
    const app = require(process.cwd() + '/server');
    app.handler.close();
    done();
});
