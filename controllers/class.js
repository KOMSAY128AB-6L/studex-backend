'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');
const util   = require(__dirname + '/../helpers/util');
 
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
