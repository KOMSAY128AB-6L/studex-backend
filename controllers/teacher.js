'use strict';

const mysql		= require('anytv-node-mysql');
const winston	= require('winston');
const sh		= require('shelljs');
const multer    = require('multer');
const fs		= require('fs');
const storage	= multer.diskStorage( {
    destination: (req, file, cb) => {
		let destFolder =__dirname + '/../uploads/teachers/pictures';

		if (!fs.existsSync(destFolder)) {
			fs.mkdirSync(destFolder);
		}

		cb(null, destFolder);
    },
    filename: (req, file, cb) => {
		cb(null,file.originalname);
    }
});
const upload	= multer({storage : storage}).single('pic');

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

exports.upload_picture = (req, res, next) => {

	function start () {
		sh.exec('mkdir -p uploads/teachers/', create_pictures_directory);
	}

	function create_pictures_directory (err) {

		if (err) {
			winston.error('Error in creating teachers directory');
			return next(err);
		}

		sh.exec('mkdir -p uploads/teachers/pictures/', upload_picture);
	}

	function upload_picture (err) {

		if (err) {
			winston.error('Error in creating pictures directory');
			return next(err);
		}

		upload(req, res, send_response);
	}

	function send_response (err) {

		if (err) {
			winston.error('Error in uploading picture');
			return next(err);
		}

		res.item(req.file).send();
	}

	start();
}
