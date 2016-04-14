'use strict';

const util  	= require(__dirname + '/../helpers/util');
const mysql   	= require('anytv-node-mysql');
const winston 	= require('winston');
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

	console.dir(req.headers['content-type']);

	console.log(req.files);
	console.log(req.file);
	console.log(req.body);

	// upload(req,res,function(err) {
	// 	if(err) {
	// 		return res.end("Error uploading file.");
	// 	}
	//
	// 	console.log(req.files);
	// 	console.log(req.file);
	// 	console.log(req.body);
	//
	// 	res.end("File is uploaded");
    // });

    function start () {
		sh.config.silent = true;
		sh.cd('controllers');
		sh.exec('sudo chmod 755 ../helpers/classlist.js');
		sh.exec('node ../helpers/classlist.js ../uploads/csv/classlist.csv > ../database/classlist.sql', execute_query);
	}

	function execute_query (err) {
		if (err) {
			winston.error('Error in parsing CSV file and converting it to into SQL format');
			return next(err);
		}

		sh.exec('sudo mysql -uroot < ../database/classlist.sql', send_response);
	}

	function send_response (err) {
        if (err) {
            if (err === 1) winston.error('Some of the data may be duplicates');
			else winston.error('Error in inserting classlist from CSV');

            // return next(err);
			return res.item({body: req.body, file: req.file, files: req.files}).send();
        }

        res.item(req).send();
    }

    start();
}
