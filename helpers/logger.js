'use strict';

const mysql   = require('anytv-node-mysql');
const winston = require('winston');

function logg(id, query_log){
	mysql.use('master')
		.query(
			'INSERT INTO history (teacher_id, log_text) VALUES (?,?)',
			[id, query_log],
			send_response
		)
		.end();
}

function send_response (err, result, args, last_query){
	if(err){
		winston.error('Error in getting teacher', last_query);
		return;
	}
	
	if(!result.affectedRows){
		return result.status(404)
				.error({code: 'teacher404', message: 'teacher not found'})
				.send();
	}
}

module.exports = {
	logg
};
