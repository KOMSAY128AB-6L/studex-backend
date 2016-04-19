'use strict';

const config  = require(__dirname + '/../config/config');
const util   = require(__dirname + '/../helpers/util');
const logger = require('../helpers/logger');
const logger = require('../helpers/logger');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');


exports.create_student = (req, res, next) => {
	const data = util.get_data(
        {
            email: '',
            student_number: '',
            first_name: '',
            middle_initial: '',
            last_name: '',
            picture: ''
        },
        req.body
    ); 

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'SELECT student_id FROM student WHERE email = ? and student_number = ?;',
                [data.email, data.student_number],
                check_duplicate
            )
            .end();
       
    }

    function check_duplicate (err, result) {

        if(result.length){
            return res.item({message:'Student already exists.'}).send();
        }

        mysql.use('master')
            .query(
                'INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture)VALUES(?,?,?,?,?,?);',
                [data.email, data.student_number, data.first_name, data.middle_initial, data.last_name, data.picture],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating student', last_query);
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, last_query);

        return res.status(200)
                .item({message: 'Student successfully created'})
                .send();
    }

    start();
};

exports.update_student = (req, res, next) => {
    const data = util.get_data(
        {
            email: '',
            student_number: '',
            first_name: '',
            middle_initial: '',
            last_name: '',
            picture: ''
        },
        req.body
    ); 


    function start () {
        let id;

        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        id = req.params.id;
        delete req.params.id;

        mysql.use('master')
            .query(
                'UPDATE student SET ? WHERE student_id = ? LIMIT 1;',
                [data, id],
                send_response
            )
            .end();
    }

    function send_response (err, result) {
        if (err) {
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, last_query);

        res.send({message: 'Student successfully updated'});
    }

    start();
};

exports.delete_student = (req, res, next) => {
	function start () {

        mysql.use('master')
            .query(
                'DELETE FROM student_class WHERE student_id = ?;',
                [req.params.id],
                delete_student_data
            )
            .end();
       
    }

    function delete_student_data (err, result){
        if (err) {
            winston.error('Error in deleting student in class', last_query);
            return next(err);
        }

         mysql.use('master')
            .query(
                'DELETE FROM student WHERE student_id = ?;',
                [req.params.id],
                send_response
            )
            .end();

    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in deleting student', last_query);
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, last_query);

        res.item(result[0])
            .send();
    }

    start();
};

exports.retrieve_student = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM student WHERE student_id = ? LIMIT 1;',
                [req.params.id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting students', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error({code: 'STUDENT404', message: 'Student not found'})
                .send();
        }
        
        logger.logg(req.session.user.teacher_id, last_query);

        res.item(result[0])
            .send();
    }

    start();
};

exports.retrieve_all_student = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM student;',
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting students', last_query);
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, last_query);

        res.item(result)
            .send();
  
      
    }

    start();
};

exports.get_times_student_volunteered = (req, res, next) => {
	function start () {
		mysql.use('master')
		.query(
			 'SELECT * FROM student WHERE student_id = ? LIMIT 1;',
			[req.params.id],
			function(err,results){
				if (err) {
					winston.error('Error in getting student', last_query);
					return next(err);
				}
				if (!results.length) {
					return res.status(404)
					.error({code: 'STUDENT404', message: 'student not found'})
					.send();
				}
				getVolunteerTimes(); 
			}
		)
		.end();
	}
	function getVolunteerTimes(){
		mysql.use('master')
		.query(
			'SELECT COUNT(*) AS volunteer_times FROM volunteer_student WHERE student_id = ?;',
			[req.params.id],
			send_response
		)
		.end();
	}
	function send_response (err, result, args, last_query) {
		
		logger.logg(req.session.user.teacher_id, last_query);
	
		res.item(result[0])
		.send();
	}
	start();
};

exports.retrieve_log_of_volunteers = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM volunteer;',
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in retrieving log of volunteers', last_query);
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, last_query);

        res.item(result)
            .send();
  
      
    }

    start();
};
