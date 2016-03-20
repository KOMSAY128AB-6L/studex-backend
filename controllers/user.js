'use strict';

const util   = require(__dirname + '/../helpers/util');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');
const config  = require(__dirname + '/../config/config');
const randomstring = require('randomstring');

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
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'INSERT INTO teacher(email, password, first_name, middle_initial,\
                                    last_name) \
                 VALUES(?, PASSWORD(CONCAT(MD5(?), ?)), ?, ?, ?);',
                [data.email, data.password, config.SALT, data.first_name, 
                 data.middle_initial, data.last_name],
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

exports.reset_password = (req, res, next) => {
    const data = util.get_data(
        {
            email: ''
        },
        req.body
    );

    let random_string;
    
    function start () {
        random_string = randomstring.generate();

        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'SELECT email FROM teacher WHERE email = ? LIMIT 1;',
                [data.email],
                find_user
            )
            .query(
                'INSERT INTO reset_password(email, random_string) VALUES(?, ?);',
                [data.email, random_string],
                send_response
            )
            .end();
        
    }

    function find_user (err, result, args, last_query) {

        if (err) {
            winston.error('Error in reset password link request', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error({code: 'USER404', message: 'User not found'})
                .send();
        }

        return result[0].email;

    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in reset password link request', last_query);
            return next(err);
        }

        return res.status(200)
                .item({ message: 'Enter given key to reset your password here: http://localhost:8000/reset',
                        key: random_string})
                .send();
        }

    start();
};


exports.confirm_reset_password = (req, res, next) => {
    const data = util.get_data(
        {
            email: '',
            random_string: '',
            new_password: '',
            confirm_password: ''
        },
        req.body
    );

    function start () {

        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'SELECT email FROM reset_password WHERE email = ? AND random_string = ? LIMIT 1;',
                [data.email, data.random_string],
                find_user_request
            )
            .query(
                'SELECT DATEDIFF( (SELECT date_expiry FROM reset_password WHERE  email = ? AND random_string = ? LIMIT 1), CURRENT_TIMESTAMP ) AS date_expiry LIMIT 1;',
                [data.email, data.random_string],
                validate_user_request_date
            )
            .end();

        if(data.new_password === data.confirm_password){
            mysql.use('master')
            .query(
                'UPDATE teacher SET password = PASSWORD(CONCAT(MD5(?), ?))\
                 WHERE email = ?;',
                [data.new_password, config.SALT, data.email],
                send_response
            )
            //*
            .query(
                'DELETE FROM reset_password WHERE email = ? AND random_string = ?;',
                [data.email, data.random_string],
                remove_request
            )
            //*/
            .end();
        }
        else{
            return res.status(400)
                    .error({code: 'USERREQUEST400', message: 'Passwords do not match'})
                    .send();       
        }

    }

    function find_user_request (err, result, args, last_query) {

        if (err) {
            winston.error('Error in reset password link request', last_query);
            return next(err);
        }

       if (!result.length) {
            return res.status(404)
                .error({code: 'USERREQUEST404', message: 'User reset password request not found'})
                .send();
        }

        return res.status(200)
                ;//.item({message: 'User reset password request exists'});

    }

    function validate_user_request_date (err, result, args, last_query) {

        if (err) {
            winston.error('Error in reset password', last_query);
            return next(err);
        }

        console.log(result[0]);

        if (result[0].date_expiry <= 0) {
            return res.status(400)
                .error({code: 'USERREQUEST404', message: 'User reset password request already expired'})
                .send();
        }        

        return res.status(200)
                ;//.item({message: 'User reset password request still valid'});
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in reset password', last_query);
            return next(err);
        }

        return res.status(200)
                ;//.item({message: 'Reset password success'});
    }

    function remove_request (err, result, args, last_query) {
        if (err) {
            winston.error('Error in deleting reset password request', last_query);
            return next(err);
        }

        return res.status(200)
                .item({message: 'Reset password request successfully claimed'})
                .send();
    }

    start();
};
