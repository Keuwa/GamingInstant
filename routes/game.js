/**
 * Created by Grunt on 06/09/2017.
 */
var router = require('express').Router();
module.exports = function(server){
    router
        .post('/',
        server.actions.game.init)

        .get('/:gameId',
        server.actions.game.get)

        //.post('/logout',
        //    server.middlewares.ensureAuthenticated,
        //    server.actions.auth.logout)

    return router;
};