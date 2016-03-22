'use strict';

const importer = require('anytv-node-importer');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.delete('/class/:id', __.class.delete_class);
    router.post('/user', __.user.create_user);

    /*Routes for Student CRUD*/
    router.post('/student', __.student.create_student);
    router.get ('/student/:id', __.student.retrieve_student);
    router.get ('/student', __.student.retrieve_all_student);
    router.put ('/student/:id', __.student.update_student);
    router.delete('/student/:id', __.student.delete_student);

    /*Routes for Log*/
    /*router.get ('/history/volunteers', __.log.volunteers);
    router.get ('/history/transactions', __.log.transactions);

    /*Routes for N Volunteers*/
    //router.post ('/classes/randomize/nVolunteers', __.randomize.nVolunteers);

    /*Routes for Teacher Login*/
    //router.post('/login', __.user.login_user);
    
    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};