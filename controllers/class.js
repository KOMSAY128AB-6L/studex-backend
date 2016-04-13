'use strict';

const util  	= require(__dirname + '/../helpers/util');
const mysql   	= require('anytv-node-mysql');
const winston 	= require('winston');
const sh      	= require('shelljs');
const multer	= require('multer');
const upload	= multer({ dest: 'uploads/' });

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
		res.item(class_query).send();

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
