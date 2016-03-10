'use strict';

const importer = require('anytv-node-importer');


module.exports = (router) => {
    const __ = importer.dirloadSync(__dirname + '/../controllers');

    router.del = router.delete;

    router.get('/user/:id', __.user.get_user);
    

    router.get('/user/', __.user.get_users);
    router.post('/user/', __.user.post_user);

    router.all('*', (req, res) => {
        res.status(404)
            .send({message: 'Nothing to do here.'});
    });
    
    router.delete('/class/:id', __.class.delete_class);

    return router;
};
