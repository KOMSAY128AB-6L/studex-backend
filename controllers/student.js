'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');


exports.get_students = (req, res, next) => {

    function start () {
        mysql.use('studex')
            .query(
                'SELECT * FROM student;',
                send_response
            )
            .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting students', last_query);
            return next(err);
        }

        res.item(result[0])
            .send();
    }

    start();
};

exports.get_student = (req, res, next) => {

    function start () {
        mysql.use('studex')
            .query(
                'SELECT * FROM student WHERE student_id = ?;',
                [req.params.id],
                send_response
            )
            .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting student', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error({code: 'STUDENT404', message: 'student not found'})
                .send();
        }

        res.item(result[0])
            .send();
    }

    start();
};

exports.post_student = (req, res, next) => {

    function start () {
        mysql.use('studex')
            .query(
                'INSERT INTO student(email, first_name, middle_initial, last_name, picture) VALUES(?,?,?,?,?);',
                [req.body.email, req.body.first_name, req.body.middle_initial, req.body.last_name, req.body.picture],
                send_response
            )
            .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating student', last_query);
            return next(err);
        }

        res.item(result[0])
            .send();
    }

    start();
};

