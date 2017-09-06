/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function (server) {
    return function (req, res, next) {
        res.sendFile(__dirname + '../../dist/index.html');
    }
};
