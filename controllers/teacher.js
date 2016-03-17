'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');


exports.get_teachers = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM get_teacher;',
                send_response
            )
            .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting teachers', last_query);
            return next(err);
        }

        res.item(result[0])
            .send();
    }

    start();
};

exports.get_teacher = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT * FROM teacher WHERE teacher_id = ?;',
                [req.params.id],
                send_response
            )
            .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in getting teacher', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error({code: 'TEACHER404', message: 'teacher not found'})
                .send();
        }

        res.item(result[0])
            .send();
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

