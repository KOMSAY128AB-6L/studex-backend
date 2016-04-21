'use strict';

const util  	= require(__dirname + '/../helpers/util');
const mysql   	= require('anytv-node-mysql');
const winston 	= require('winston');
const sh      	= require('shelljs');
const multer    = require('multer');
const fs		= require('fs');
const storage =   multer.diskStorage( {
    destination: (req, file, cb) => {
		let destFolder =__dirname + '/../uploads/csv';
		if (!fs.existsSync(destFolder)) {
			fs.mkdirSync(destFolder);
		}

		cb(null, destFolder);
    },
    filename: (req, file, cb) => {
		cb(null,file.originalname);
    }
});
const upload = multer({storage : storage}).single('csv');

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

		// TODO - make filenames more descriptive
		csv_writer
			.writeToPath("uploads/csv/students.csv", values, {headers: true})
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


exports.create_class = (req, res, next) => {
	const data = util.get_data(
        {
            class_name: '',
            section: '',
            teacher_id: ''
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
        		[data.class_name,data.section,data.teacher_id],
        		send_response
        	)
        	.end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating class', last_query);
            return next(err);
        }

        return res.status(200)
                .item({message: 'Class successfully created'})
                .send();
    }

    start();
};

exports.insert_csv_classlist = (req, res, next) => {

	let path;

	function start () {
		upload(req, res, generate_container);
	}

	function generate_container (err) {
		if (err) {
			winston.error('Error in initializing shell');
			return next(err);
		}

		path = req.file.path;
		sh.exec('touch uploads/csv', overwrite_permission);
	}

	function overwrite_permission (err) {
		if (err) {
			winston.error('Error in generating csv folder');
			return next(err);
		}

		sh.exec('sudo chmod 755 helpers/classlist.js', generate_query);
	}

	function generate_query (err) {
		if (err) {
			winston.error('Error in setting permissions of helper function');
			return next(err);
		}

		sh.exec('node helpers/classlist.js ' + path + ' > database/classlist.sql', filter_query);
	}

    function filter_query (err) {

        let query;

        if (err) {
			winston.error('Error in parsing CSV file and converting it to into SQL format');
			return next(err);
		}

		sh.exec('sudo mysql -uroot < database/classlist.sql', execute_query);
	}

	function execute_query (err) {
		if (err) {
			winston.error('Error in filtering query');
			return next(err);
		}

		sh.exec('sudo mysql -uroot < database/classlist.sql', clean_sql);
	}

	function clean_sql (err) {
		if (err) {
			winston.error('Error in inserting classlist from CSV');
			// sh.rm('database/classlist.sql', path);
			return next(err);
        }

		sh.exec('rm database/classlist.sql', clean_csv);
	}

	function clean_csv (err) {
		if (err) {
			winston.error('Error in removing sql file');
            return next(err);
        }

		sh.exec('rm ' + path, send_response);
	}

	function send_response (err) {
        if (err) {
            winston.error('Error in removing csv file');
            return next(err);
        }

        res.send({message: "Classlist inserted"});
    }

    start();
}
