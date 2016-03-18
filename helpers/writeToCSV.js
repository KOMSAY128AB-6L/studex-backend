'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');
const csvWriter = require('fast-csv');

/**
 * @api {get} /user/:id Output to CSV
 * @apiName WriteCSV
 * @apiGroup Student
 */

exports.write_to_csv = (res, req, next) => {

	function start(){
		mysql.use('master')
			.query(
				'SELECT * FROM student',
				[],
				send_response
			)
			.end();
	}
	
	function write_to_csv(err, result, args, last_query){
		if(err){
			winston.error('Selection query of students failed', lst_query);
			return.next(err);
		}
		
		csv
			.writeToPath("students.csv", [
				result
			], {headers: true})
			.on("finish", send_response)
	}
	
	function send_response(err, result, args, last_query){
	 	if(err){
	 		winston.error('Could not write to CSV', last_query);
	 		return.next(err);
	 	} 
	 	
	 	res.item(result[0])
	 		.send()
	 }
	
	start();
};
