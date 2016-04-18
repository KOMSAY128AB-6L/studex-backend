'use strict';

//const logger = require('../helpers/logger');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');

exports.get_teachers = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM teacher;',
                send_response
            )
            .end();
    }
	
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting teachers', last_query);
            return next(err);
        }

        res.item(result)
            .send();
    }

    start();
};

exports.get_teacher = (req, res, next) => {

    function start () {
        res.send(req.session.user);
    }

    start();
};

exports.post_teacher = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'INSERT INTO teacher(email, password, first_name, middle_initial, last_name, picture)'
                +' VALUES(?,?,?,?,?,?);',

                [req.body.email, req.body.password, req.body.first_name, 
                req.body.middle_initial, req.body.last_name, req.body.picture],
                
                send_response
            )
            .end();
    }
	
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating teacher', last_query);
            return next(err);
        }
        
        res.item(result[0])
            .send();
    }

    start();
};

exports.update_teacher = (req, res, next) => {
	
	function start () {
		mysql.use('master')
			.query(
				'UPDATE teacher SET ? WHERE teacher_id=?',
				[req.body, req.params.id],
				send_response
			)
			.end();
	}
	
	function send_response (err, result, args, last_query) {
		
		if (err) {
			winston.error('Error in updating teacher', last_query);
			return next(err);
		}
		
		if (!result.affectedRows) {
			return res.status(404)
				.error({code: 'teacher404', message: 'teacher not found'})
				.send();
		}        
		
		res.item(result[0])
			.send();
	}
		
	start();
};
	
exports.delete_teacher = (req, res, next) => {

	function start () {
		mysql.use('master')
			.query(
				'DELETE from teacher WHERE teacher_id=?;',
				[req.params.id],
				send_response
			)
			.end();
	}

	function send_response (err, result, args, last_query) {
		
		if (err) {
			winston.error('Error in deleting teacher', last_query);
			return next(err);
		}
	
		if (!result.affectedRows) {
			return res.status(404)
				.error({code: 'teacher404', message: 'teacher not found'})
				.send();
		}
	
		res.item(result[0])
			.send();
	}
	
	start();
};

exports.get_transaction_history = (req, res, next) => {
	
	function start () {
		mysql.use('master')
			.query(
				'SELECT teacher_id FROM teacher WHERE teacher_id = ?;',
				[req.params.id],
				send_response
			)
			.end();
	}
	
	function send_response (err, result, args, last_query){
		if(err){
			winston.error('Error in getting teacher', last_query);
			return next(err);
		}

		if(!result.length){
			return res.status(404)
			.error({code: 'TEACHER404', message: 'teacher not found'})
			.send();
		}

		//logger.log(req.session.user.teacher_id, last_query);

		mysql.use('master')
		.query(
			'SELECT * FROM history WHERE teacher_id = ?;',
			[req.params.id],
			send_response_2
		)
		.end();

		
	}

	function send_response_2 (err, result, args, last_query){
		if(err){
			winston.error('Error in getting student', last_query);
			return next(err);
		}
		res.send(result[0]);
	}

	start();
};
