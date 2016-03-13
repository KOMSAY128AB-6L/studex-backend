'use strict';

const importer = require('anytv-node-importer');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.delete('/class/:id', __.class.delete_class);
    router.post('/user', __.user.create_user);
    router.post('/randomize', __.randomize.randomize);

    
    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });
    
    

    return router;
};
