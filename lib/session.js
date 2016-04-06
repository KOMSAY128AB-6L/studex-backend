'use strict';

module.exports = (req, res, next) => {

    if (typeof res === 'undefined') {
        let role = req;

        return (req, res, next) => {
            if (req.session
                && req.session.user
                && (req.session.user.currentRole.toLowerCase() === role.toLowerCase()) 
            {
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
