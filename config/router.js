'use strict';

const importer = require('anytv-node-importer');



module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.route('/user/:id')
    	.get(__.user.get_user);

    router.route('/student')
        .get(__.student.get_students)
        .post(__.student.post_student);
    
    router.route('/student/:id')    
        .get(__.student.get_student);

    router.route('/teacher')
        .get(__.teacher.get_teachers)
        .post(__.teacher.post_teacher);

    router.route('/teacher/:id')
        .get(__.teacher.get_teacher);



    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
