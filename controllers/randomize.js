'use strict';

const config  = require(__dirname + '/../config/config');
const util   = require(__dirname + '/../helpers/util');
const random   = require(__dirname + '/../helpers/randomize');
const logger = require('../helpers/logger');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');



/**
 * @api {post} /randomize/sample
 * @apiName Randomize Sample
 * @apiGroup Randomize
 *
 * @apiParam {Array} List of class_ids get the student from
 * @apiParam {Object} Contains the settings to use
 *
 * @apiSuccess Returns a list of random students from the classes specified
 */
exports.randomize_classes = (req, res, next) => {
    const data = util.get_data(
        {
            class_list: [
                0
            ],
            settings: {
                _byCount: false,
                _byChance: false,
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

        mysql.use('master')
            .query('SELECT *, .10 as chance FROM student_class WHERE class_id in ?',
                [[data.class_list]],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in selecting students from class', last_query);
            return next(err);
        }
        
        logger.logg(req.session.user.teacher_id, last_query);

        return res.item(random.randomize(result, data.settings))
                .send();
    }

    start();
};



exports.get_num_volunteers = (req, res, next) => {
    const data = util.get_data(
        {
            num_of_volunteers : ''
        },
        req.body
    ); 

    function start () {
    	logger.logg(req.session.user.teacher_id, last_query);
    	
        res.item(data.num_of_volunteers).send();
    }

    start();
};
