
'use strict';

const importer = require('anytv-node-importer');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    // router.get('/user', __.user.get_users);
    router.post('/user', __.user.create_user);

    // router.get('/user/:id', __.user.get_user);
    /*Routes for Student CRUD*/
    router.post('/student', __.student.create_student);
    router.get ('/student/:id', __.student.retrieve_student);
    router.get ('/student', __.student.retrieve_all_student);
    router.put ('/student/:id', __.student.update_student);
    router.delete('/student/:id', __.student.delete_student);

    router.get('/teacher', __.teacher.get_teachers);

    router.get('/teacher/:id', __.teacher.get_teacher);
    router.post('/teacher', __.teacher.post_teacher);
    router.put('/teacher/:id',__.teacher.update_teacher);
    router.delete('/teacher/:id',__.teacher.delete_teacher);

    router.update('/class/', __.class.update_class);
    router.delete('/class/:id', __.class.delete_class);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};

