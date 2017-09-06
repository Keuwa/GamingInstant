/**
 * Created by Grunt on 29/06/2017.
 */
module.exports = function (server) {
    server.swagger = require('./swagger')(server);
};