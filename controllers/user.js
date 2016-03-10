'use strict';

const util   = require(__dirname + '/../helpers/util');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');
const config  = require(__dirname + '/../config/config');

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
    const data = util.get_data(
        {
            email: '',
            password: '',
            first_name: '',
            middle_initial: '',
            last_name: ''
        },
        req.body
    );


    function start () {
        let email, password, first_name, middle_initial, last_name;

        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        email = data.email;
        delete data.email;
        
        password = data.password;
        delete data.password;
        
        first_name = data.first_name;
        delete data.first_name;
        
        middle_initial = data.middle_initial;
        delete data.middle_initial;
        
        last_name = data.last_name;
        delete data.last_name;

        mysql.use('master')
            .query(
                'INSERT INTO teacher(email, password, first_name, middle_initial,\
                                    last_name) \
                 VALUES(?, PASSWORD(CONCAT(MD5(?), ?)), ?, ?, ?);',
                [email, password, config.SALT, first_name, middle_initial, 
                 last_name],
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
