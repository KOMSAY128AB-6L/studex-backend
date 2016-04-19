'use strict';

const config  = require(__dirname + '/../config/config');
const util   = require(__dirname + '/../helpers/util');
const random   = require(__dirname + '/../helpers/randomize');
const mysql   = require('anytv-node-mysql');
const winston = require('winston');



exports.randomize_students = (req, res, next) => {
    const data = util.get_data(
        {
            student_list: [{
                student_id : 0,
                _chance: 0.0
            }],
            settings: {
                _byCount: false,
                _byChance: false,
                _unique: false,
                numberOfVolunteers: 0
            }
        },
        req.body
    );

    let volunteers;


    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        
        if (data.settings.byCount) {
            let student_ids = [];

            let iii;
            data.student_list.forEach((student) => 
                student_ids.push(student.student_id)
            );
            
            mysql.use('master')
                 .query(`SELECT s.*, GET_VOLUNTEER_COUNT(s.student_id) AS 
                         volunteerCount FROM student s LEFT JOIN 
                         volunteer_student vs ON s.student_id=vs.student_id 
                         WHERE s.student_id IN (SELECT s.student_id FROM 
                         student s, class c WHERE s.class_id = c.class_id AND 
                         c.teacher_id = ?) AND s.student_id IN ?`, 
                         [req.session.user.teacher_id, [student_ids]],
                         chance_by_count
                 )
                 .end();
        } else {
            //TODO modify query to only select students of that teacher
            mysql.use('master')
                 .query('INSERT INTO volunteer(teacher_id) VALUES(?)', req.session.user.teacher_id, insert_volunteers)
                 .end();
        }
    }

    function chance_by_count(err, result, args, last_query) {
        if(err) {
            winston.error('Error in selecting number volunteers of student', last_query);
            return next(err);
        }

        data.student_list = result;

        mysql.use('master')
             .query('INSERT INTO volunteer(teacher_id) VALUES(?)', req.session.user.teacher_id, insert_volunteers)
             .end();
    }

    function insert_volunteers(err, result, args, last_query) {
        if(err) {
            winston.error('Error in creating volunteer entity', last_query);
            return next(err);
        }

        let query = '';
        volunteers = random.randomize(data.student_list, data.settings);
        let volunteerIds = [];
        let iii;
        for(iii = 0; iii < volunteers.length - 1; iii++) {
            query += '(?, ' + result.insertId + '), ';
            volunteerIds.push(volunteers[iii].student_id);
        }
        query += '(?, ' + result.insertId + ')';
        volunteerIds.push(volunteers[iii].student_id);
        //TODO what to do about case of multiple volunteer to same student
        mysql.use('master')
             .query('INSERT INTO volunteer_student VALUES ' + query,
                    volunteerIds,
                    send_response)
             .end();
    }

    function send_response(err, result, args, last_query) {
        if(err) {
            winston.error('Error in inserting volunteers', last_query);
            return next(err);
        }

        res.items(volunteers)
           .send();
    }

    start();
};

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
        res.item(data.num_of_volunteers).send();
    }

    start();
};
