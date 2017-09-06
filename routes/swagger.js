/**
 * Created by Grunt on 29/06/2017.
 */
var router = require('express').Router();
module.exports = function (server) {
    //router.get('/', server.actions.initSwagger);
    router.get('/', function (req, res) {
        res.sendFile(__dirname + '/dist/index.html');
    });
};