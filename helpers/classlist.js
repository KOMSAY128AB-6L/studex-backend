'use strict';

const start = () => {
    const linereader = require('line-by-line');

    let lr;
    let class_name;

    if (process.argv.length < 3) {
	   console.log('Usage: node ' + process.argv[1] + ' INPUT > ../database/FILE.sql');
	   process.exit(1);
	}

	lr = new linereader(process.argv[2]);

	lr.on('error', (err) => {
        console.log(err);
	});

    console.log('use studex;\n');

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
                line_arr[i] = line_arr[i].replace('\'','\\\"');
                if (i != 2) {
                    line_arr[i] = '\'' + line_arr[i] + '\'';
                    line_arr[i] += ',';
                }
            }
            class_name = line_arr[1];
            console.log(
                ['\nCALL ADD_CLASS (', line_arr[0], line_arr[1], line_arr[2], ');'].join('')
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
                ['INSERT INTO student (email, first_name, middle_initial, last_name, picture, class_id)',
                ' VALUES (', line_arr[0], line_arr[1], line_arr[2],  line_arr[3],  line_arr[4],
                ', (SELECT class_id FROM class WHERE class_name = ', class_name.split(',')[0], ' LIMIT 1))',
                ' ON DUPLICATE KEY UPDATE ',
                    'email = ', line_arr[0].split(',')[0],
                ';'].join('')
            );
        }
	});

    lr.on('end', () => {});

};

start();
