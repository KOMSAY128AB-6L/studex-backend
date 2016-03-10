'use strict';

const config  = require(__dirname + '/../config/config');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');
const sh      = require('shelljs');

const DB_LOCAL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'user',
    database: 'studex'
};

exports.insert_classlist = (req, res, next) => {
    function start () {
        sh.config.silent = true;
        sh.exec('sudo chmod 700 ../helpers/classlist.js');
        sh.config.silent = false;
        
        sh.exec('node ../helpers/classlist.js classlist.csv > ../dabase/classlist.sql');
        sh.exec('mysql -uroot -puser < classlist.sql');
        
        return console.log('Classlist inserted');
    }
    
    start();
}
