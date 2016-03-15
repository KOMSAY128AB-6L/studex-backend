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


    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        return res.item(random.randomize(data.student_list, data.settings)).send();

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

        if (data.class_list.length == 0) {
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
