'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');
const csv_writer = require('fast-csv');

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

exports.update_class = (req, res, next) => {
	const data = util.get_data({
	    id,
			className,
			section
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

exports.delete_class = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'DELETE * FROM class WHERE class_id = ? LIMIT 1;',
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

        if (!result.length) {
            return res.status(404)
                .error({code: 'USER404', message: 'Class not found'})
                .send();
        }

        res.item(result[0])
            .send();
    }

    start();
};

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
			return next(err);
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
	 		return next(err);
	 	} 
	 	
	 	res.item(result[0])
	 		.send()
	 }
	
	start();
};
