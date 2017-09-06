/**
 * Created by Grunt on 29/06/2017.
 */
module.exports = function (server) {
    server.use('/users', require('./users')(server));
    server.use('/auth', require('./auth')(server));
    server.use('/game', require('./game')(server));
};
