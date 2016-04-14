
'use strict';

const importer  = require('anytv-node-importer');
const multer    = require('multer');
const storage =   multer.diskStorage( {
    destination: (req, file, cb) => {
		let destFolder =__dirname + '/';
		//create folder if does not exists
		if (!fs.existsSync(destFolder)) {
			fs.mkdirSync(destFolder);
		}

		console.log('File sent to: '  +destFolder);

		//set folder where files will be populated
		cb(null, destFolder);
    },
    filename: (req, file, cb) => {
		//set the names file within the folder
		//as the original name of the file
		cb(null,file.originalname);
    }
});
const upload = multer({storage : storage}).single('csv');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.post('/user', __.user.create_user);
    router.post('/reset', __.user.reset_password);
    router.post('/confirm_reset', __.user.confirm_reset_password);

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

    router.post('/class/csv', upload, __.class.insert_csv_classlist);
	// router.post('/upload', function (req, res) {
	// 	//var form_description = req.body.description;
	// 	console.log(req.body);
	// 	console.log(req.file);
	// 	console.log(req.files);
	// 	//  insert operations into database get placed here
	// 	return res.item({body: req.body, file: req.file, files: req.files}).send();
	// });
    router.put('/class', __.class.update_class);
    router.delete('/class/:id', __.class.delete_class);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });

    return router;
};
