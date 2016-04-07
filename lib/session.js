'use strict';

module.exports = (req, res, next) => {

    if (typeof res === 'undefined') {

        return (req, res, next) => {
            if (req.session && req.session.user) {
                return next();
            }

            res.status(403)
                .error({
                    code: 'SESSION403',
                    message: 'Unauthorized access'
                })
                .send();
        };
    }

    if (req.session && req.session.user) {
        return next();
    }

    res.status(403)
                .error({
                    code: 'SESSION403',
                    message: 'Unauthorized access'
                })
                .send();
};
