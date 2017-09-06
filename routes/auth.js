/**
 * Created by Grunt on 29/06/2017.
 */
var router = require('express').Router();
module.exports = function(server){
    router
        .post('/login',
        server.middlewares.bodyparser,
        server.middlewares.ensureBodyFields(['steamId', 'password']),
        server.actions.auth.login)

        //.post('/logout',
        //    server.middlewares.ensureAuthenticated,
        //    server.actions.auth.logout)

    return router;
};
