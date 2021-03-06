'use strict';

const _    = require('lodash');
const path = require('path');

const config = {
    APP_NAME: 'Studex',

    PORT: 5000,

    CORS:  {
        allowed_headers: 'Access-Token, X-Requested-With, Content-Type, Accept',
        allowed_origins_list: [
            'localhost:8000'
        ],
        allowed_methods: 'GET, POST, PUT, OPTIONS, DELETE',
        allow_credentials: true
    },

    UPLOAD_DIR: path.normalize(__dirname + '/../uploads/'),
    ASSETS_DIR: path.normalize(__dirname + '/../assets'),
    VIEWS_DIR: path.normalize(__dirname + '/../views'),
    LOGS_DIR: path.normalize(__dirname + '/../logs'),


    DB: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'studex'
    },

    SALT: 'q5cH9VoL',

    STUDENT_PIC_PATH: __dirname +  '/../uploads/students/pictures',
    TEACHER_PIC_PATH: __dirname + '/../uploads/teachers/pictures',
    DEFAULT_PIC_LINK: 'http://localhost:8000/assets/images/default-avatar.png',

    RESET_LINK: 'http://localhost:8000/confirm_reset',

    SMTP: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'studex.staff@gmail.com',
                pass: 'cmsc128ab6l'
            }
        },

    use: (env) => {
        _.assign(config, require(__dirname + '/env/' + env));
        return config;
    }

};

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

module.exports = config.use(process.env.NODE_ENV);
