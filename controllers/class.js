'use strict';

const mysql   = require('anytv-node-mysql');
const logger = require('../helpers/logger');
const winston = require('winston');
const csv_writer = require('fast-csv');
const util  	= require(__dirname + '/../helpers/util');
const sh      	= require('shelljs');

/**
 * @api {get} /user/:id Get user information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} id User's unique ID
 *
 * @apiSuccess {String} user_id User's unique ID
 * @apiSuccess {String} date_created Time when the user was created
 * @apiSuccess {String} date_updated Time when last update occurred
 */
exports.view_class = (req, res, next) => {
	function start () {
	mysql.use('master')
			.query(
			'SELECT last_name, first_name, middle_initial, picture FROM student  WHERE class_id = ?',
			[req.params.id],
			send_response
		)
		.end();
	}
	function send_response (err, result, args, last_query) {
		if (err) {
			winston.error('Error in viewing class', last_query);
			return next(err);
		}
		if (!result.length) {
			return res.status(404)
			.error({code: 'CLASS404', message: 'Class not found'})
			.send();
		}
		
		logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed students from class #' + req.params.id + '.');
		
		res.item(result[0])
		.send();
	}
	start();
}; 

exports.view_classes = (req, res, next) => {
	function start () {
	mysql.use('master')
			.query(
			'SELECT * FROM class WHERE teacher_id=?',
			[req.session.user.teacher_id],
			send_response
		)
		.end();
	}
	function send_response (err, result, args, last_query) {
		if (err) {
			winston.error('Error in viewing classes', last_query);
			return next(err);
		}
		if (!result.length) {
			return res.status(404)
			.error({code: 'CLASS404', message: 'Classes not found'})
			.send();
		}
		
		logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed his classes.');
		
		res.item(result)
		.send();
	}
	start();
};

exports.update_class = (req, res, next) => {
	const data = util.get_data({
	  	 	id:'',
			className:'',
			section:''
		},
	req.body
	);
	function start () {
		if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

		mysql.use('master')
			.query(
				'UPDATE class SET class_name = ?, section = ? WHERE class_id = ?;',
				[data.className, data.section, data.id],
				send_response
			)
			.end();

	}
		function send_response (err, result, args, last_query) {
			if (err) {
				winston.error('Error in updating class', last_query);
				return next(err);
			}

			if (result.affectedRows === 0) {
				return res.status(404)
		 		   .error({code: 'CLASS404', message: 'Class not found'})
				.send();
			}
			
			logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' updated ' + data.className + '\'s class details.');

			res.item({message:'Class successfully updated'})
			.send();
		}

start();
};

exports.delete_class = (req, res, next) => {

    function start () {
    	
        mysql.use('master')
            .query(
                'DELETE FROM class WHERE class_id = ?',
                [req.params.id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in deleting class', last_query);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404)
                .error({code: 'CLASS404', message: 'Class not found'})
                .send();
        }        
        
        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' deleted class #' + req.params.id + '.');

        res.item({message:'Class successfully deleted'})
            .send();
    }

    start();
};

exports.write_to_csv = (req, res, next) => {

	let values = [];

	function start () {
		sh.exec('mkdir -p uploads/csv/', create_csv_directory);
	}

	function create_csv_directory (err) {

		if (err) {
			winston.error('Error in creating csv directory');
		return next(err);
		}

	sh.exec('mkdir -p uploads/csv/', query);

	}

	function query(){
		mysql.use('master')
			.query(
				'SELECT * FROM class ORDER BY class_id',
				[],
				query2
			)
			.end();
	}

	function query2(err, result, args, last_query){		

		var i=0;
		
		if(err){
			winston.error('Selection query of classes failed', last_query);
			return next(err);
		}		

		result.forEach(function (element) {
			mysql.use('master')
			.args(result[i])
			.query(
				'SELECT * FROM student WHERE class_id = ?',
				[element.class_id],
				write_to_csv_student
			)
			.end();
			i++;
		});
	
	}

	function write_to_csv_student(err, result, args, last_query){
		
		if(err){
			winston.error('Selection query of students failed', last_query);
			return next(err);
		}		

		values.push([
			args[0].class_name,
			args[0].section,
		]);

		result.forEach(function (element) {
			values.push([
				element.email,
				element.first_name,
				element.middle_initial,
				element.last_name,
				element.picture,
			]);
		});

		csv_writer
		.writeToPath("uploads/csv/students.csv", values, {headers: true})
		.on("finish", send_response);				
	}
	
	function send_response(err, result, args, last_query){

	 	if(err){
	 		winston.error('Could not write to CSV');
	 		return next(err);
	 	}
	 	
	 	logger.logg(req.session.user.teacher_id, last_query);	 
	 	res.send();
	 }
	
	start();
};


exports.create_class = (req, res, next) => {
	const data = util.get_data(
        {
            class_name: '',
            section: ''
        },
        req.body
    ); 

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'SELECT class_id FROM class WHERE class_name = ? and section = ?;',
                [data.class_name, data.section],
                check_duplicate
            )
            .end();
       
    }

    function check_duplicate (err, result) {

        if(result.length){
            return res.status(409)
                .error({code: 'CLASS409', message: 'CONFLICT:Class already exists'})
                .send();
        }

        mysql.use('master')
        	.query(
        		'INSERT INTO class (class_name, section, teacher_id) VALUES (?,?,?);',
        		[data.class_name,data.section,req.session.user.teacher_id],
        		send_response
        	)
        	.end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating class', last_query);
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' created ' + data.class_name + ' class.');

        return res.status(200)
                .item({message: 'Class successfully created'})
                .send();
    }

    start();
};

exports.insert_csv_classlist = (req, res, next) => {

    function start () {
		
		let class_query;
		
		sh.cd('controllers');
		sh.config.silent = true;
		sh.exec('sudo chmod 755 ../helpers/classlist.js');
		sh.config.silent = false;
		sh.exec('node ../helpers/classlist.js ../uploads/csv/classlist.csv > ../database/classlist.sql', function (err) {

			if (err) {
				winston.error('Error in inserting classlist from CSV');
				return next(err);
			}

		});
		class_query = sh.exec('cat ../database/classlist.sql').output;
		
		// TODO - convert to formal query
		res.send();

    }
	
	function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in inserting classlist from CSV');
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' inserted students list from CSV.');
        res.send();
    }

    start();
}
