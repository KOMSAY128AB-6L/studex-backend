'use strict';

const util         = require(__dirname + '/../helpers/util');
const date         = require(__dirname + '/../helpers/date');
const config         = require(__dirname + '/../config/config');
const logger       = require('../helpers/logger');
const csv_writer   = require('fast-csv');
const mysql          = require('anytv-node-mysql');
const winston        = require('winston');
const sh              = require('shelljs');
const multer       = require('multer');
const opener       = require('opener');
const fs           = require('fs');
const storage      =   multer.diskStorage( {
    destination: (req, file, cb) => {
        let destFolder =__dirname + '/../uploads/csv';
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder);
        }

        cb(null, destFolder);
    },
    filename: (req, file, cb) => {
        file.originalname = 'classlist-' + date.get_today();
        if(sh.exec('test -f ' + 'uploads/csv/classlist-' + date.get_today()).code === 0) {
            file.originalname += sh.ls().length;
        }
        file.originalname += '.csv';

        cb(null,file.originalname);
    }
});
const upload = multer({storage : storage}).single('csv');

/**
 * @api {get} /user/:id Get user information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} id User's unique ID
 *
 * @apiSuccess {String} user_id User's unique ID
 * @apiSuccess {String} date_created Time when the user was created
 * @apiSuccess {String} date_updated Time when last update occurred
 */
exports.view_class = (req, res, next) => {
    function start () {
    mysql.use('master')
            .query(
            'SELECT s.* FROM student s, class c  WHERE c.class_id = ? AND s.class_id=c.class_id AND c.teacher_id=?',
            [req.params.id,req.session.user.teacher_id],
            send_response
        )
        .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in viewing class', last_query);
            return next(err);
        }
        if (!result.length) {
            return res.status(404)
            .error({code: 'CLASS404', message: 'Class not found'})
            .send();
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed students from class #' + req.params.id + '.');

        res.item(result)
            .send();
    }
    start();
};

exports.view_classes = (req, res, next) => {
    function start () {
    mysql.use('master')
            .query(
            'SELECT * FROM class WHERE teacher_id=?',
            [req.session.user.teacher_id],
            send_response
        )
        .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in viewing classes', last_query);
            return next(err);
        }
        if (!result.length) {
            return res.status(404)
            .error({code: 'CLASS404', message: 'Classes not found'})
            .send();
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed his classes.');

        res.item(result)
        .send();
    }
    start();
};

exports.view_classes = (req, res, next) => {
    function start () {
    mysql.use('master')
            .query(
            'SELECT * FROM class WHERE teacher_id=?',
            [req.session.user.teacher_id],
            send_response
        )
        .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in viewing classes', last_query);
            return next(err);
        }
        if (!result.length) {
            return res.status(404)
            .error({code: 'CLASS404', message: 'Classes not found'})
            .send();
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed his classes.');

        res.item(result)
        .send();
    }
    start();
};

exports.update_class = (req, res, next) => {
    const data = util.get_data({
               id:'',
            className:'',
            section:''
        },
        req.body
    );
    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
            }

        mysql.use('master')
            .query(
                'UPDATE class SET class_name = ?, section = ? WHERE class_id = ? AND teacher_id=?;',
                [data.className, data.section, data.id, req.session.user.teacher_id],
                send_response
            )
            .end();

    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in updating class', last_query);
            return next(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404)
                .error({code: 'CLASS404', message: 'Class not found'})
                .send();
    }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' viewed students from class #' + data.id + '.');

        res.item({message:'Class successfully updated'})
        .send();
    }

    start();
};

exports.delete_class = (req, res, next) => {

    function start () {

        mysql.use('master')
            .query(
                'DELETE FROM class WHERE class_id = ? AND teacher_id=?',
                [req.params.id, req.session.user.teacher_id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in deleting class', last_query);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404)
                .error({code: 'CLASS404', message: 'Class not found'})
                .send();
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' deleted class #' + req.params.id + '.');

        res.item({message:'Class successfully deleted'})
            .send();
    }

    start();
};

exports.no_repetition = (req, res, next) => {
    function start () {
        mysql.use('master')
                .query(
                        `SELECT DISTINCT s.* FROM student s JOIN class c ON s.class_id = c.class_id AND
						c.class_id = ? AND c.teacher_id = ? AND s.student_id NOT IN (SELECT DISTINCT s.student_id FROM student s
						JOIN volunteer_student vs ON s.student_id = vs.student_id
						JOIN volunteer v ON v.volunteer_id = vs.volunteer_id AND DATE(v.volunteer_date) = CURDATE())`,
                        [req.params.id, req.session.user.teacher_id],
                        send_response
            )
            .end();
    }
    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in filtering student list', last_query);
            return next(err);
        }
        if (!result.length) {
            return res.status(404)
            .error({code: 'CLASS404', message: 'Classes not found'})
            .send();
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' set randomizer to no repetition.');

        res.item(result)
        .send();
    }
    start();
};

exports.write_to_csv = (req, res, next) => {

    let values = [];
  let filename = "classlist-" + date.get_today() + ".csv";

  function start(){

        mysql.use('master')
          .query(
        'SELECT c.class_id, c.class_name, c.section, s.email, s.first_name, s.middle_initial, s.last_name, s.picture \
          FROM class c, student s \
          WHERE s.class_id = c.class_id AND c.teacher_id=?;',
        [req.session.user.teacher_id],
              generate_csv
          )
          .end();
    }

    function generate_csv(err, result, args, last_query){

    let currentClassId = 0;

        if(err){
            winston.error('Selection query of students failed', last_query);
            return next(err);
        }

    result.forEach((element) => {
      if (element.class_id !== currentClassId) {
        values.push([
          element.class_name,
          element.section,
        ]);

        values.push([
          element.email,
          element.first_name,
          element.middle_initial,
          element.last_name,
          element.picture
        ]);

        currentClassId = element.class_id;
      } else {
        values.push([
          element.email,
          element.first_name,
          element.middle_initial,
          element.last_name,
          element.picture
        ]);
      }
    });

        csv_writer
          .writeToPath("uploads/csv/" + filename, values, {headers: true})
          .on("finish", send_response);
    }

    function send_response(err, result, args){
    if(err){
      winston.error('Could not write to CSV');
      return next(err);
    }

    // TODO: Download file after importing to backend
    // opener('http://' + config.UPLOAD_DIR + 'csv/' + filename);

         logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' added students list to CSV.');

         res.send();
     }

    start();
};

exports.create_class = (req, res, next) => {
    const data = util.get_data(
        {
            class_name: '',
            section: ''
        },
        req.body
    );

    function start () {
        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        mysql.use('master')
            .query(
                'SELECT class_id FROM class WHERE class_name = ? AND section = ? AND teacher_id = ?;',
                [data.class_name, data.section, req.session.user.teacher_id],
                check_duplicate
            )
            .end();

    }

    function check_duplicate (err, result) {

      if (err) {
          winston.error('Error in finding duplicate class');
          return next(err);
      }

        if(result.length){
            return res.status(409)
                .error({code: 'CLASS409', message: 'CONFLICT: Class already exists', result})
                .send();
        }

        mysql.use('master')
            .query(
                'INSERT INTO class (class_name, section, teacher_id) VALUES (?,?,?);',
                [data.class_name,data.section,req.session.user.teacher_id],
                send_response
            )
            .end();
    }

    function send_response (err, result, args, last_query) {
        if (err) {
            winston.error('Error in creating class', last_query);
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' created ' + data.class_name + ' class.');

        return res.status(200)
                .item({message: 'Class successfully created'})
                .send();
    }

    start();
};

exports.insert_csv_classlist = (req, res, next) => {

  const timestamp = date.get_today();
    let path;

    function start () {
        upload(req, res, generate_query);
    }

    function generate_query (err) {
        if (err) {
            winston.error('Error in setting permissions of helper function');
            return next(err);
        }

        path = req.file.path;
        sh.exec('node helpers/classlist.js ' + path + ' > database/classlist-' + timestamp + '.sql', execute_query);
    }

    function execute_query (err) {
        if (err) {
            winston.error('Error in parsing CSV file and converting it to into SQL format');
            return next(err);
        }

        sh.exec('sudo mysql -uroot < database/classlist-' + timestamp + '.sql', clean_sql);
    }

    function clean_sql (err) {
        if (err) {
            winston.error('Error in inserting classlist from CSV');
            sh.rm('database/classlist-' + timestamp + '.sql', path);
            return next(err);
        }

        sh.exec('rm database/classlist-' + timestamp + '.sql', clean_csv);
    }

    function clean_csv (err) {
        if (err) {
            winston.error('Error in removing sql file');
            return next(err);
        }

        sh.exec('rm ' + path, send_response);
    }

    function send_response (err) {
        if (err) {
            winston.error('Error in removing csv file');
            return next(err);
        }

        logger.logg(req.session.user.teacher_id, req.session.user.first_name + ' ' + req.session.user.middle_initial + ' ' + req.session.user.last_name + ' inserted students list from CSV.');
        res.send({message: "Classlist inserted"});
    }

    start();
}
