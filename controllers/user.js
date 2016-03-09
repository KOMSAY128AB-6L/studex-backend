'use strict';

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
exports.create_user = (req, res, next) => {
    
    function start () {
        mysql.use('my_db')
            .query(
                'INSERT INTO users(email, password, first_name, middle_initial,\
                                    last_name) \
                 VALUES(?,?,?,?,?);',
                [req.body.email, req.body.password, req.body.first_name,
                 req.body.middle_initial, req.body.last_name],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating user', last_query);
            return next(err);
        }

        return res.status(200)
                .item({message: 'User successfully created'})
                .send();
    }

    start();
};
