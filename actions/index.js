/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function (server) {
    server.actions = server.actions || {};
    server.actions.users = require('./users')(server);
    server.actions.auth = require('./auth')(server);
    server.actions.game = require('./game')(server);
};
