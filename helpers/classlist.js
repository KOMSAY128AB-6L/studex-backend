'use strict';

const start = () => {
    const linereader = require('line-by-line');
    
    if (process.argv.length < 3) {
	   console.log('Usage: node ' + process.argv[1] + ' INPUT > ../database/FILE.sql');
	   process.exit(1);
	}
	
    let class_name;
	const lr = new linereader(process.argv[2]);
    
    console.log('use studex');
    
	lr.on('error', (err) => {
        console.log(err);
	});
	
	lr.on('line', (line) => {
        let tokens = line.split(',');
        let line_arr;
        
        line_arr = line.split(',');
        
        if (line_arr[0].indexOf('#') >= 0) {
            return;
        }
        
        if (line_arr.length !== 5 && line_arr.length !== 3) {
            console.log('ERR at: ' + line);
            return;
        }
        
        if (line_arr.length === 3) {
            for (let i = 0; i < 3; i += 1) {
                line_arr[i] = line_arr[i].replace("'","\\'");
                if (i != 2) {
                    line_arr[i] = '\'' + line_arr[i] + '\'';
                    line_arr[i] += ',';
                }
            }
            class_name = line_arr[0];
            console.log(
                ['INSERT INTO class (class_name, section, teacher_id)',
                'VALUES (', line_arr[0], line_arr[1], line_arr[2], ')'].join('')
            );
        }
        
        if (line_arr.length === 5) {
            for (let i = 0; i < 5; i += 1) {
                line_arr[i] = line_arr[i].replace("'","\\'");
                line_arr[i] = '\'' + line_arr[i] + '\'';
                if (i != 4) {
                    line_arr[i] += ',';
                }
            }
            console.log(
                ['INSERT INTO student (email, password, first_name, middle_initial, last_name, picture)',
                'VALUES (', line_arr[0], line_arr[1], line_arr[2],  line_arr[3],  line_arr[4], ')'].join('')
            );
            console.log(
                ['INSERT INTO student_class ',
                'VALUES (',
                    '(SELECT class_id FROM class WHERE class_name=', class_name, '),',
                    '(SELECT student_id FROM student WHERE email=', line_arr[0].split(',')[0],')',
                ')'].join('')
            );
        }
	});
    
    lr.on('end', () => {});

};

start();
