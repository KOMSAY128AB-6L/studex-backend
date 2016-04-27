'use strict';

const $        = require(__dirname + '/../lib/session');
const importer = require('anytv-node-importer');



module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.post('/user',                            __.user.create_user);
    router.post('/login',                           __.user.login_user);
    router.post('/logout',                          __.user.logout_user);
    router.post('/reset',                           __.user.reset_password);
    router.post('/confirm_reset',                   __.user.confirm_reset_password);
    router.post('/change_password',                   __.user.change_password);

    //For sample purposes only
    router.post('/randomize/classes',               $, __.randomize.randomize_classes);
    router.post('/randomize/students',              $, __.randomize.randomize_students);

    /*Routes for Student CRUD*/
    router.post('/student/:id',                     $, __.student.create_student);
    router.post('/search/:id',                     $, __.student.retrieve_student);
    router.get ('/student/:id',                     $, __.student.retrieve_all_student);
    router.get ('/student_logs/',                   $, __.student.retrieve_log_of_volunteers);
    router.put ('/student/:id',                     $, __.student.update_student);
    router.del ('/student/:id',                     $, __.student.delete_student);
    router.get ('/volunteer/:id',                   $, __.student.get_times_student_volunteered);

    router.get ('/teachers',                        $, __.teacher.get_teachers);
    router.get ('/teacher',                         $, __.teacher.get_teacher);
    router.post('/teacher',                         $, __.teacher.post_teacher);
    router.put ('/teacher',                         $, __.teacher.update_teacher);
    router.del ('/teacher',                         $, __.teacher.delete_teacher);
    router.get ('/history',			                $, __.teacher.get_transaction_history);

    // Routes for class
    router.get ('/classes',			                $, __.class.view_classes);
    router.get ('/class/:id',                       $, __.class.view_class);
    router.put ('/class',                           $, __.class.update_class);
    router.del ('/class/:id',                       $, __.class.delete_class);

	// Routes for class read and write CSV
    router.get('/class/csv',                        $, __.class.write_to_csv);
    router.post('/class/csv',                       $, __.class.insert_csv_classlist);
    router.post('/class',                           $, __.class.create_class);
    router.post('/randomize/get_num',               $, __.randomize.get_num_volunteers);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
