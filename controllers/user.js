'use strict';

const util   = require(__dirname + '/../helpers/util');
const logger = require('../helpers/logger');
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
                .item({code: 'USER200', message: 'User successfully created'})
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
        teacher_id: '',
        first_name: '',
        middle_initial: '',
        last_name: '',
        random_string: ''
    };

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        user.random_string = util.random_string();

        mysql.use('master')
            .query(
                'SELECT email, teacher_id, first_name, middle_initial, last_name FROM teacher WHERE email = ? LIMIT 1;',
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

        user.teacher_id = result[0].teacher_id;
        user.first_name = result[0].first_name;
        user.middle_initial = result[0].middle_initial;
        user.last_name = result[0].last_name;
        return result[0];

    }

    function send_email (err, result, args, last_query) {
        let smtpConfig = config.SMTP;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(smtpConfig);

        // setup e-mail data with unicode symbols
        let mailOptions = {
            from: '"Studex Support" <studex.staff@gmail.com>', // sender address
            to: data.email, // list of receivers
            subject: 'Studex Account Password Reset', // Subject line
            text: `Dear ${user.first_name}, \n\n
                    You have requested to have your password reset for your account at Studex. \n
                    Please click on the following link or copy and paste the link on your address bar and enter ${user.random_string} to reset your password.
                    ${config.RESET_LINK} \n
                    This key is valid only for 24 hours.\n
                    If you received this email in error, you can safely ignore this email.`, // plaintext body
            html: `<p>Dear ${user.first_name},</p><p></p>
                    <p>You have requested to have your password reset for your account at Studex.</p><p></p>
                    <p>Please click on the following link or copy and paste the link on your address bar and enter <strong> ${user.random_string} </strong> to reset your password. </p><p></p>
                    <p><a href="${config.RESET_LINK}">${config.RESET_LINK}</a></p><p></p>
                    <p>This key is valid only for 24 hours.</p><p></p>
                    <p>If you received this email in error, you can safely ignore this email.</p>` // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                winston.error('Error in sending email containing password reset key', error);
                return next(error);
            }
            
            logger.logg(user.teacher_id, user.first_name + ' ' + user.middle_initial + ' ' + user.last_name + ' requested to change password.');

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

    let user = {
        teacher_id: '',
        first_name: '',
        middle_initial: '',
        last_name: ''
    };

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
            .query(
                'SELECT email, teacher_id, first_name, middle_initial, last_name FROM teacher WHERE email = ? LIMIT 1;',
                [data.email],
                get_user_credentials
             )
            .end();

    }

    function get_user_credentials (err, result, args, last_query) {
        if (err) {
            winston.error('Error in reset password link request', last_query);
            return next(err);
        }

        if (!result.length) {
            return res.status(404)
                .error({code: 'USER404', message: 'User not found'})
                .send();
        }

        user.teacher_id = result[0].teacher_id;
        user.first_name = result[0].first_name;
        user.middle_initial = result[0].middle_initial;
        user.last_name = result[0].last_name;
        return result[0];
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
            
        logger.logg(user.teacher_id, user.first_name + ' ' + user.middle_initial + ' ' + user.last_name + ' successfully changed password.');

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


exports.logout_user = (req,res,next) => {

    logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' logged out to StudEx.');
            
	function start () {
		req.session.destroy();
	}
	start();

	res.item({code: 'USER200', message:'User succesfully logged out.'}).send();
};



exports.login_user = (req, res, next) => {
    const data = util.get_data(
        {
            email : '',
            password : ''
        },
        req.body
    );

    function start(){
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        if (req.session && req.session.user) {
            return res.status(403)
                    .error({
                        code: 'SESSION403',
                        message: 'Already logged in'
                    })
                .send();
        }

        mysql.use('master')
            .query(
                'SELECT * from teacher where email = ? and password = PASSWORD(CONCAT(MD5(?), ?))', [data.email, data.password, config.SALT],
                send_response
            )
            .end();
    }

    function send_response(err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting teacher', last_query);
            return next(err);
        }

        if(!result.length) {
            res.status(400).error({code: 'USER200', message: 'User Email or Password is incorrect.'})
                .send();
        }

        else {

            req.session.user = {
                teacher_id: result[0].teacher_id,
                email: result[0].email,
                first_name: result[0].first_name,
                middle_initial: result[0].middle_initial,
                last_name: result[0].last_name
            };

            logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' logged in to StudEx.');
            res.item({code :'USER200', message:'User succesfully logged in.'}).send();
        }
    }

    start();
};

exports.change_password = (req, res, next) => {
    const data = util.get_data(
      {
          old_password: '',
          new_password: ''
      },
          req.body
    );

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
             .query(
               'SELECT teacher_id FROM teacher WHERE password = PASSWORD(CONCAT(MD5(?), ?)) AND teacher_id = ?',
               [data.old_password, config.SALT, req.session.user.teacher_id],
               check_password
             )
             .end();
    }

    function check_password(err, result, args, last_query) {
        if (result.length === 0) {
            res.status(400)
               .item({message: 'Password does not match current password'})
               .send();
        }

        mysql.use('master')
             .query(
               'UPDATE teacher SET password = PASSWORD(CONCAT(MD5(?), ?)) WHERE teacher_id = ?',
               [data.new_password, config.SALT, req.session.user.teacher_id],
               send_response
             )
             .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in changing password', last_query);
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' changed password.');

        res.item({message: 'Password changed'})
           .send();
    }



    start();
};
