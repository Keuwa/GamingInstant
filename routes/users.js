/**
 * Created by Grunt on 29/06/2017.
 */
var router = require('express').Router();

module.exports = function (server) {
    router
        .post('/', server.middlewares.bodyparser,
        server.middlewares.ensureBodyFields(['birthdate', 'gender', 'profession', 'steamId', 'password']),
        server.actions.users.create)

        .put('/settings', server.middlewares.bodyparser,
        server.middlewares.ensureBodyFields(['year', 'price', 'style']),
        server.middlewares.ensureAuthenticated,
        server.actions.users.editSettings)

        .get('/:steamId', server.actions.users.showById);

    return router;
};
