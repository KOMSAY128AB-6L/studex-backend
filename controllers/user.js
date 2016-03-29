'use strict';

const util   = require(__dirname + '/../helpers/util');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');
const config  = require(__dirname + '/../config/config');
const nodemailer = require('nodemailer');

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
                'SELECT * FROM teacher WHERE email = ?;',
                [data.email],
                send_validate_response
            ) 
            
     	.end();
    }
    
    function send_validate_response (err, result, args, last_query) {
         if (result.length) {
            return res.status(404)
                .error({code: 'USER404', message: 'User email is existing'})
                .send();
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
            winston.error('Error creating user', last_query);	
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
    
    let user = {
        first_name: '',
        random_string: ''
    };

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        user.random_string = util.random_string();

        mysql.use('master')
            .query(
                'SELECT email, first_name FROM teacher WHERE email = ? LIMIT 1;',
                [data.email],
                find_user
             )
            .query(
                'REPLACE INTO reset_password(email, random_string) VALUES(?, ?);',
                [data.email, user.random_string],
                send_email
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

        user.first_name = result[0].first_name;

        return result[0];

    }

    function send_email (err, result, args, last_query) {
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'studex.staff@gmail.com',
                pass: 'cmsc128ab6l'
            }
        };

        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport(smtpConfig);

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Studex Support" <studex.staff@gmail.com>', // sender address
            to: data.email, // list of receivers
            subject: 'Studex Account Password Reset', // Subject line
            text: 'Dear '+user.first_name+', \n\n\
                    You have requested to have your password reset for your account at Studex. \n\
                    Please click on the following link or copy and paste the link on your address bar and enter '+user.random_string+' to reset your password. \
                    http://localhost:8000/confirm_reset \n\
                    This key is valid only for 24 hours.\n\
                    If you received this email in error, you can safely ignore this email.', // plaintext body
            html: '<p>Dear '+user.first_name+',</p><p></p>\
                    <p>You have requested to have your password reset for your account at Studex.</p><p></p>\
                    <p>Please click on the following link or copy and paste the link on your address bar and enter <strong>'+user.random_string+'</strong> to reset your password. </p><p></p>\
                    <p><a href="http://localhost:8000/confirm_reset">http://localhost:8000/confirm_reset</a></p><p></p>\
                    <p>This key is valid only for 24 hours.</p><p></p>\
                    <p>If you received this email in error, you can safely ignore this email.</p>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                winston.error('Error in sending email containing password reset key', error);
                return next(error);
            }

            res.status(200)
                .item({message: 'Message sent'})
                .send();
        });
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
                'SELECT email FROM reset_password WHERE email = ? AND random_string = ? AND date_expiry > CURDATE() LIMIT 1;',
                [data.email, data.random_string],
                validate_user_request
            )
            .end();

    }

    function validate_user_request (err, result, args, last_query) {

        if (err) {
            winston.error('Error in reset password link request', last_query);
            return next(err);
        }

       if (!result.length) {
            return res.status(404)
                .error({code: 'USERREQUEST404', message: 'User reset password request not found or already expired'})
                .send();
        }

        if(data.new_password !== data.confirm_password){
            return res.status(400)
                .error({code: 'USERREQUEST400', message: 'Passwords do not match'})
                .send();
        }

        mysql.use('master')
            .query(
                'UPDATE teacher SET password = PASSWORD(CONCAT(MD5(?), ?))\
                 WHERE email = ?;',
                [data.new_password, config.SALT, data.email],
                send_response
            )
            .end();

        return res.status(200);

    }


    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in reset password', last_query);
            return next(err);
        }

        mysql.use('master')
            .query(
                'DELETE FROM reset_password WHERE email = ? AND random_string = ?;',
                [data.email, data.random_string],
                remove_request
            )
            .end();

        return res.status(200)
                .item({message: 'Reset password request successfully claimed'})
                .send();
    }

    function remove_request (err, result, args, last_query) {
        if (err) {
            winston.error('Error in deleting reset password request', last_query);
            return next(err);
        }

        return res.status(200);
    }

    start();
};
