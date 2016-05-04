'use strict';

const config    = require(__dirname + '/../config/config');
const util      = require(__dirname + '/../helpers/util');
const logger    = require('../helpers/logger');
const mysql     = require('anytv-node-mysql');
const winston   = require('winston');
const sh        = require('shelljs');
const multer    = require('multer');
const fs        = require('fs');
const storage   = multer.diskStorage({
    destination: (req, file, cb) => {
        let destFolder =__dirname + '/../uploads/students/pictures';

        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder);
        }

        cb(null, destFolder);
    },
    filename: (req, file, cb) => {
        let arr = /.*(\.[^\.]+)$/.exec(file.originalname);

        cb(null, req.params.id + (arr? arr[1]: '.jpg'));
    }
});
const upload    = multer({storage : storage}).single('pic');


exports.create_student = (req, res, next) => {
	const data = util.get_data(
        {
            email: '',
            student_number: '',
            first_name: '',
            middle_initial: '',
            last_name: '',
            picture: ''
        },
        req.body
    );

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'SELECT student_id FROM student WHERE email = ? and class_id = ?;',
                [data.email, req.params.id],
                check_duplicate
            )
            .end();

    }

    function check_duplicate (err, result) {

        if(result.length){
            return res.item({message:'Student already exists.'}).send();
        }

        mysql.use('master')
            .query(
                'INSERT INTO student(email, student_number, first_name, middle_initial,last_name, picture, class_id)VALUES(?,?,?,?,?,?,?);',
                [data.email, data.student_number, data.first_name, data.middle_initial, data.last_name, data.picture, req.params.id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating student', last_query);
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' added student #' + data.student_number + '.');

        return res.status(200)
                .item({message: 'Student successfully created'})
                .send();
    }

    start();
};

exports.update_student = (req, res, next) => {
    const data = util.get_data(
        {
            email: '',
            student_number: '',
            first_name: '',
            middle_initial: '',
            last_name: '',
            picture: '',
            chance: ''
        },
        req.body
    );


    function start () {
        let id;

        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        id = req.params.id;
        delete req.params.id;

        mysql.use('master')
            .query(
                'UPDATE student SET ? WHERE student_id = ? LIMIT 1;',
                [data, id],
                send_response
            )
            .end();
    }

    function send_response (err, result) {
        if (err) {
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' updated student #' + data.student_number + '.');

        res.send({message: 'Student successfully updated'});
    }

    start();
};

exports.delete_student = (req, res, next) => {
	function start () {

        mysql.use('master')
            .query(
                'DELETE FROM student_tag WHERE student_id = ?;',
                [req.params.id],
                delete_student_volunteer
            )
            .end();

    }
    function delete_student_volunteer (err, result){
        if (err) {
            winston.error('Error in deleting student in tags', last_query);
            return next(err);
        }

         mysql.use('master')
            .query(
                'DELETE FROM volunteer_student WHERE student_id = ?;',
                [req.params.id],
                delete_student_data
            )
            .end();

    }

    function delete_student_data (err, result){
        if (err) {
            winston.error('Error in deleting student in volunteers', last_query);
            return next(err);
        }

         mysql.use('master')
            .query(
                'DELETE FROM student WHERE student_id = ?;',
                [req.params.id],
                send_response
            )
            .end();

    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in deleting student', last_query);
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' deleted student #' + req.params.id + '.');

        res.item(result[0])
            .send();
    }

    start();
};

exports.retrieve_student = (req, res, next) => {
    const data = util.get_data(
        {
            last_name: ''
        },
        req.body
    );
    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM student WHERE last_name = ? and class_id = ?;',
                [data.last_name, req.params.id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting students', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error({code: 'STUDENT404', message: 'Student not found'})
                .send();
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed student #' + req.params.id + '\'s details.');

        res.item(result)
            .send();
    }

    start();
};

exports.retrieve_all_student = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM student where class_id = ?;',
                req.params.id,
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting students', last_query);
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed all students\' details.');

        res.item(result)
            .send();
    }

    start();
};

exports.get_times_student_volunteered = (req, res, next) => {
	function start () {
		mysql.use('master')
		.query(
			 'SELECT * FROM student WHERE student_id = ? LIMIT 1;',
			[req.params.id],
			function(err,results){
				if (err) {
					winston.error('Error in getting student', last_query);
					return next(err);
				}
				if (!results.length) {
					return res.status(404)
					.error({code: 'STUDENT404', message: 'student not found'})
					.send();
				}
				getVolunteerTimes();
			}
		)
		.end();
	}
	function getVolunteerTimes(){
		mysql.use('master')
		.query(
			'SELECT COUNT(*) AS volunteer_times FROM volunteer_student WHERE student_id = ?;',
			[req.params.id],
			send_response
		)
		.end();
	}
	function send_response (err, result, args, last_query) {

		logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed the number of times student #' + req.params.id + ' has volunteered.');

		res.item(result[0])
		.send();
	}
	start();
};

exports.retrieve_log_of_volunteers = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT CONCAT(CONCAT(teacher.first_name, ", "), teacher.last_name) as "Teacher",\
                    CONCAT(CONCAT(class.class_name, "-"), class.section) as "Class",\
                    CONCAT(CONCAT(student.first_name, ", "), student.last_name) as "Volunteer", student.picture as Picture, \
                    volunteer_date FROM volunteer, teacher, class, volunteer_student, student WHERE teacher.teacher_id = ? and \
                    teacher.teacher_id = volunteer.teacher_id and class.class_id = volunteer.class_id\
                    and student.student_id= volunteer_student.student_id ORDER BY volunteer_date DESC;',
                    [req.session.user.teacher_id],
                    send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in retrieving log of volunteers', last_query);
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed log of volunteers.');

        res.item(result)
            .send();
    }

    start();
};

exports.upload_picture = (req, res, next) => {

   function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM student s JOIN class c ON s.class_id = c.class_id WHERE c.teacher_id = ? AND s.student_id = ?',
                [req.session.user.teacher_id, req.params.id],
                verify_student
            )
            .end();
   }

   function verify_student (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting students', last_query);
            return next(err);
        }

        if (result.length === 0) {
            return res.warn(400, {message: 'Student id does not belong in your class'});
        }

        upload(req, res, update_picture);
   }

   function update_picture (err) {
        if (err) {
            winston.error('Error in uploading picture');
            return next(err);
        }

        mysql.use('master')
            .query(
                'UPDATE student SET picture = ? WHERE student_id = ?',
                [req.file.filename, req.params.id],
                send_response
            )
            .end();
   }

   function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in updating picture', last_query);
            return next(err);
        }

       res.item({message: 'Successfully updated picture'}).send();
   }

    start();
};

exports.insert_student_tag = (req, res, next) => {
    const data = util.get_data(
        {
            tag: ''
        },
        req.body
    );

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'SELECT * FROM student_tag WHERE student_id = ? AND tag = ?;',
                [req.params.id,data.tag],
                check_duplicate
            )
            .end();

    }

    function check_duplicate (err, result) {
    
        if(result.length){
        	return res.status(409)
                .error({code: 'STUDENT_TAG409', message: 'CONFLICT:Student tag already exists'})
                .send();
        }
        
		mysql.use('master')
            .query(
                'SELECT s.* FROM student s, class c WHERE s.student_id = ? AND s.class_id = c.class_id AND c.teacher_id=?;',
                [req.params.id,req.session.user.teacher_id],
                check_if_student
            )
            .end();
        
    }
    
    function check_if_student(err, result){
    	if(!result.length){
        	return res.status(404)
                .error({code: 'STUDENT404', message: 'Student not found'})
                .send();
        }
        console.log(result);
        mysql.use('master')
            .query(
                'INSERT INTO student_tag(student_id, tag) VALUES (?,?);',
                [req.params.id, data.tag],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in inserting tag', last_query);
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' added student tag #' + data.student_id + '.');

        return res.status(200)
                .item({message: 'Student tag successfully inserted'})
                .send();
    }

    start();
};

exports.get_picture = (req, res, next) => {
    let filePath;
	function start() {
		mysql.use('master') 
			.query(
				'SELECT picture FROM student s, class c WHERE s.student_id = ? AND s.class_id = c.class_id AND c.teacher_id = ?',
				[req.params.id, req.session.user.teacher_id],
				read_image
			)
			.end();	
	}
	
	function read_image(err, result, args, last_query){
		if(err){
			winston.error('Error in selecting student', last_query);
			return next(err);
		}
	
		if(!result.length){
			return res.status(404)
				.error({message: 'Student not found'})
				.send();
		}

        filePath = `${config.STUDENT_PIC_PATH}/${result[0].picture}`;
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
    }

	start();
}
