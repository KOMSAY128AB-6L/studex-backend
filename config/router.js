'use strict';

const importer = require('anytv-node-importer');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    // router.get('/user', __.user.get_users);
    router.post('/user', __.user.create_user);
    
    // router.get('/user/:id', __.user.get_user);
    
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
