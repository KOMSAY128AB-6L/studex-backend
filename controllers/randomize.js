'use strict';

const config  = require(__dirname + '/../config/config');
const util   = require(__dirname + '/../helpers/util');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');

exports.getNumVolunteers = (req, res, next) => {

    function start () {
    	var n = req.body.numVolunteers; // for testing
    	console.log(n);					// for testing
        return req.body.numVolunteers;  
    }

    start();
};
