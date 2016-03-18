'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');

/**
 * @api {get} /user/:id Input Student to Classlist Manually
 * @apiName InsertStudent
 * @apiGroup Student
 *
 * @apiParam {String} id Student's unique ID
 *
 * @apiSuccess {String} student_id Student's unique ID
 * @apiSuccess {String} email Student's email address
 * @apiSuccess {String} first_name Student's first name
 * @apiSuccess {String} middle_initial Student's middle initial
 * @apiSuccess {String} last_name Student's last name
 * @apiSuccess {String} picture Student's picture
 */

exports.insert_student = (req,res,next) => { 

	function start(){
		mysql.use('master')
			.query(
				'INSERT INTO student(student_id, email, first_name, middle_initial, last_name, picture) VALUES (?,?,?,?,?,?)',
				 
				[req.body.student_id, req.body.email, req.body.first_name, req.body.middle_initial, req.body.last_name, req.body.picture],
				
				send_response
			)
			.end();
	}

 	function send_response(err, result, args, last_query){
	 	if(err){
	 		winston.error('Student not created', last_query);
	 		return next(err);
	 	} 
	 	
	 	res.item(result[0])
	 		.send()
	 }
	 
	 start();
};
