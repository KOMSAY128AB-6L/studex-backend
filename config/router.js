'use strict';

const $        = require(__dirname + '/../lib/session');
const importer = require('anytv-node-importer');



module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.post('/user',                            __.user.create_user);
    router.post('/login',                           __.user.login_user);
    router.post('/logout',                           __.user.logout_user);
    router.post('/reset',                           __.user.reset_password);
    router.post('/confirm_reset',                   __.user.confirm_reset_password);

    //For sample purposes only
    router.post('/randomize/classes',               $, __.randomize.randomize_classes);

    /*Routes for Student CRUD*/
    router.post('/student',                         $, __.student.create_student);
    router.get ('/student/:id',                     $, __.student.retrieve_student);
    router.get ('/student',                         $, __.student.retrieve_all_student);
    router.put ('/student/:id',                     $, __.student.update_student);
    router.delete('/student/:id',                   $, __.student.delete_student);
    router.get('/volunteer/:id',                    $, __.student.get_times_student_volunteered);
    

    
    router.get('/teacher',                          $, __.teacher.get_teachers);
    router.get('/teacher/:id',                      $, __.teacher.get_teacher);
    router.post('/teacher',                         $, __.teacher.post_teacher);
    router.put('/teacher/:id',                      $, __.teacher.update_teacher);
    router.delete('/teacher/:id',                   $, __.teacher.delete_teacher);

    // Routes for class
    router.get('/class/:id',                        $, __.class.view_class);
    router.put('/class',                            $, __.class.update_class);
    router.delete('/class/:id',                     $, __.class.delete_class);
	
	// Routes for class read and write CSV
    router.get('/class/csv',                        $, __.class.write_to_csv);
    router.post('/class/csv',                       $, __.class.insert_csv_classlist);
    
    router.post('/randomize/get_num',               $, __.randomize.get_num_volunteers);
    
    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
