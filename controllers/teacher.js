'use strict';

const config    = require(__dirname + '/../config/config');
const util  	   = require(__dirname + '/../helpers/util');
const mysql     = require('anytv-node-mysql');
const winston   = require('winston');
const logger = require('../helpers/logger');
const sh        = require('shelljs');
const multer    = require('multer');
const fs        = require('fs');
const path      = require('path');
const storage   = multer.diskStorage({
    destination: (req, file, cb) => {
		let destFolder =__dirname + '/../uploads/teachers/pictures';

		if (!fs.existsSync(destFolder)) {
			fs.mkdirSync(destFolder);
		}

		cb(null, destFolder);
    },
    filename: (req, file, cb) => {
        let arr = /.*(\.[^\.]+)$/.exec(file.originalname);

        cb(null, req.session.user.teacher_id + (arr? arr[1]: '.jpg'));
    }
});
const upload    = multer({storage : storage}).single('pic');

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

		logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed all teachers.');

        res.item(result)
            .send();
    }

    start();
};

exports.get_teacher = (req, res, next) => {

    function start () {
        res.send(req.session.user);
        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed account details.');
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

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' added ' + req.body.first_name + ' ' + req.body.last_name + ' to Teacher List.');

        res.item(result[0])
            .send();
    }

    start();
};

exports.update_teacher = (req, res, next) => {

  const data = util.get_data(
      {
          email: '',
          first_name: '',
          middle_initial: '',
          last_name: ''
      },
      req.body
  );

	function start () {
		update_query(/[^\s@]+@[^\s@]+\.[^\s@]+/.test(data.email));
	}

  function update_query (result) {

    if (result === false) {
			winston.error('Error in validating email');
			return next('Pattern did not match');
		}

    mysql.use('master')
			.query(
				'UPDATE teacher SET email=?, first_name=?, middle_initial=?, last_name=? WHERE teacher_id=?',
				[data.email, data.first_name, data.middle_initial, data.last_name, req.session.user.teacher_id],
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

		logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' updated his account details.');

		res.item(result[0])
			.send();
	}

	start();
};

exports.delete_teacher = (req, res, next) => {

  function start () {
    mysql.use('master')
      .query(
        'DELETE FROM teacher WHERE teacher_id=?;',
      [req.session.user.teacher_id],
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

		logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' deleted his account.');

    res.item(result[0])
      .send();
  }

  start();
};

exports.upload_picture = (req, res, next) => {

	function start () {
		upload(req, res, update_picture);
	}

    function update_picture (err) {
        if (err) {
            winston.error('Error in uploading picture');
            return next(err);
        }

        mysql.use('master')
            .query(
                'UPDATE teacher SET picture = ? WHERE teacher_id = ?',
                [req.file.filename, req.session.user.teacher_id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in updating picture', last_query);
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' uploaded an account picture.');

       res.item({message: 'Successfully updated picture'}).send();
	}

	start();
}

exports.get_transaction_history = (req, res, next) => {

	function start () {
		mysql.use('master')
			.query(
				'SELECT * FROM history WHERE teacher_id = ? ORDER BY log_time DESC;',
				[req.session.user.teacher_id],
				send_response
			)
			.end();
	}

	function send_response (err, result, args, last_query){
		if(err){
			winston.error('Error in retrieving transaction log', last_query);
			return next(err);
		}

		if(!result.length){
			return res.status(404)
					.error({code: 'TEACHER404', message: 'Teacher Transaction Log not found'})
					.send();
		}

		res.item(result)
            .send();
	}

	start();
};

exports.get_picture = (req, res, next) => {
    let filePath;

	function start() {
		mysql.use('master')
			.query(
				'SELECT picture FROM teacher WHERE teacher_id = ?;',
				[req.session.user.teacher_id],
				read_image
			)
			.end();
	}

	function read_image(err, result, args, last_query){
		if(err){
			winston.error('Error in selecting teacher', last_query);
			return next(err);
		}

		if(!result.length){
			return res.status(404)
				.error({code: 'TEACHER404', message: 'Teacher image not found'})
				.send();
		}

        filePath = `${config.TEACHER_PIC_PATH}/${result[0].picture}`;
        fs.stat(filePath, give_image);
	}

    function give_image(err, stats) {
        if (err) {
            return res.redirect(config.DEFAULT_PIC_LINK);
        }

        res.writeHead(200, {
            'Content-Type': 'image',
            'Content-Length': stats.size
        });

        fs.createReadStream(filePath).pipe(res);

    logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed his account picture.');

	}

	start();
}
