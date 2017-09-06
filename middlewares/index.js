/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function(server){
    server.middlewares = server.middlewares || {};
    server.middlewares.bodyparser = require('body-parser').json({limit: '2mb'});
    server.middlewares.ensureBodyFields = require('./ensureBodyFields');
    server.middlewares.ensureAuthenticated = require('./ensureAuthenticated')(server);
};
