'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');

exports.get_times_student_volunteered = (req, res, next) => {

    function start () {
        mysql.use('master')
            .query(
                'SELECT COUNT(*) FROM volunteer_student WHERE student_id = ?;',
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