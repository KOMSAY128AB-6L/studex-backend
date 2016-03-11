'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');

exports.update_teacher = (req, res, next) => {
 
     function start () {
         mysql.use('my_db')
             .query(
                 'UPDATE teacher SET ? WHERE id=?;',
               [req.body, req.params.id],
                 send_response
             )
             .end();
     }
 
     function send_response (err, result, args, last_query) {
         if (err) {
             winston.error('Error in updating teacher', last_query);
             return next(err);
         }
         
         if (!result.length) {
             return res.status(404)
                 .error({code: 'teacher404', message: 'teacher not found'})
                 .send();
         }        
         
         res.item(result[0])
             .send();
     }
 
     start();
 };
 
 exports.delete_teacher = (req, res, next) => {
 
     function start () {
         mysql.use('my_db')
             .query(
                 'DELETE from teacher WHERE id=?;',
               [req.params.id],
                 send_response
             )
             .end();
     }
 
     function send_response (err, result, args, last_query) {
         if (err) {
             winston.error('Error in deleting teacher', last_query);
             return next(err);
         }
         
         if (!result.length) {
             return res.status(404)
                 .error({code: 'teacher404', message: 'teacher not found'})
                 .send();
         }
         
         res.item(result[0])
             .send();
     }
 
     start();
 };
