'use strict';

const util   = require(__dirname + '/../helpers/util');
const random   = require(__dirname + '/../helpers/randomize');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');



/**
 * @api {post} /user Create new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 * @apiParam {String} first_name User's first name
 * @apiParam {String} middle_initial User's middle initial
 * @apiParam {String} last_name User's last name
 *
 * @apiSuccess 
 */

exports.randomize_students = (req, res, next) => {
    const data = util.get_data(
        {
            student_list: [{
                student_id : 0,
                'class' : 0,
                _weight: 0,
                _chance: 0.0
            }],
            settings: {
                _byCount: false,
                _byChance: false,
                _withChance: false,
        _unique: false,
                numberOfVolunteers: 0
            }
        },
        req.body
    );

    let volunteers;


    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        
	if (data.settings.byCount) {
		let student_ids = '(';

		let iii;
		for (iii = 0; iii < data.student_list.length - 1; iii++) {
			student_ids += data.student_list[iii].student_id + ',';
		}
		
		student_ids += data.student_list[iii].student_id + ')';

		mysql.use('master')
		     .query(`SELECT COUNT(v.class_id) FROM 
			volunteer v, volunteer_student vs WHERE v.volunteer_id = vs.volunteer_id 
			AND (v.class_id = 1 OR v.class_id = 3) AND vs.student_id IN ` + student_ids + 
			`GROUP BY v.class_id, vs.student_id`, get_count)
		     .end();
	} else {
		mysql.use('master')
		     .query('INSERT INTO volunteer(teacher_id) VALUES(?)', 1, insert_volunteers)
		     .end();
	}
    }

    function get_count(err, result, args, last_query) {
        if(err) {
            winston.error('Error in selecting number volunteers of student', last_query);
            return next(err);
        }

    }

    function insert_volunteers(err, result, args, last_query) {
        if(err) {
            winston.error('Error in creating volunteer entity', last_query);
            return next(err);
        }

        let query = '';
        volunteers = random.randomize(data.student_list, data.settings);
        let volunteerIds = [];
        let iii;
        for(iii = 0; iii < volunteers.length - 1; iii++) {
            query += '(?, ' + result.insertId + '), ';
            volunteerIds.push(volunteers[iii].student_id);
        }
        query += '(?, ' + result.insertId + ')';
        volunteerIds.push(volunteers[iii].student_id);
        mysql.use('master')
             .query('INSERT INTO volunteer_student VALUES ' + query,
                    volunteerIds,
                    send_response)
             .end();
    }

    function send_response(err, result, args, last_query) {
        if(err) {
            winston.error('Error in inserting volunteers', last_query);
            return next(err);
        }

        res.items(volunteers)
           .send();
    }

    start();
};

exports.randomize_classes = (req, res, next) => {
    const data = util.get_data(
        {
            class_list: [{
                class_id: 0
            }],
            settings: {
                _byCount: false,
                _withChance: false,
        _unique: false,
                numberOfVolunteers: 0
            }
        },
        req.body
    );


    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }
        if (data.class_list.length === 0) {
            return res.warn(400, {message: 'No class specified'});
        }

        let query = '';
        for(let iii = 0; iii < data.class_list.length - 1; iii++) {
                query += 'class_id = ? OR ';
        }
        query += 'class_id = ?';

        mysql.use('master')
            .query('SELECT student_id, class_id, times_called FROM student_class WHERE ' + query,
                data.class_list,
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting students from class', last_query);
            return next(err);
        }

        return res.status(200)
                .item(random.randomize(result, data.settings))
                .send();
    }

    start();
};
