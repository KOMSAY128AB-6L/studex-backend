'use strict';

const importer = require('anytv-node-importer');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.post('/user', __.user.create_user);
    router.post('/reset', __.user.reset_password);
    router.post('/confirm_reset', __.user.confirm_reset_password);
    
    router.get('/teacher', __.teacher.get_teachers);
    router.get('/teacher/:id', __.teacher.get_teacher);
    router.post('/teacher', __.teacher.post_teacher);
    router.put('/teacher/:id',__.teacher.update_teacher);
    router.delete('/teacher/:id',__.teacher.delete_teacher);
    
    router.delete('/class/:id', __.class.delete_class);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
