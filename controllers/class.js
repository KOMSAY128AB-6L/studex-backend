'use strict';

const mysql         = require('anytv-node-mysql');
const winston       = require('winston');
const csv_writer    = require('fast-csv');
const util          = require(__dirname + '/../helpers/util');
const date          = require(__dirname + '/../helpers/date');
const sh            = require('shelljs');

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
			'SELECT s.last_name, s.first_name, s.middle_initial FROM student s, student_class sc WHERE sc.class_id = ? and s.student_id = sc.student_id',
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
		res.item(result[0])
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

        res.item({message:'Class successfully deleted'})
            .send();
    }

    start();
};

exports.write_to_csv = (req, res, next) => {

	function start(){
		mysql.use('master')
			.query(
				'SELECT * FROM student',
				[],
				write_to_csv
			)
			.end();
	}

	function write_to_csv(err, result, args, last_query){

		let values = [];

		if(err){
			winston.error('Selection query of students failed', last_query);
			return next(err);
		}


		result.forEach(function (element) {
			values.push([
				element.email,
				element.first_name,
				element.middle_initial,
				element.last_name,
				element.picture,
			]);
		});

		csv_writer.writeToPath("uploads/csv/students-"+date.get_today()+".csv", values, {headers: true})
			.on("finish", send_response);
	}

	function send_response(err, result, args){
	 	if(err){
	 		winston.error('Could not write to CSV');
	 		return next(err);
	 	}

	 	res.send();
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

        res.send();
    }

    start();
}
