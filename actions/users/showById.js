/**
* Created by Grunt on 29/06/2017.
*/
var models = require('../../models');
module.exports = {
    showById: function (server) {
        return function (req, res, next) {
            getUserById(req.params.steamId, function (err, status, instanceUser) {
                return res.status(status).send(err || instanceUser);
            })
        }
    },
    showByIdCB: getUserById
}


function getUserById(idUser, callback) {
    var User = models.User;
    User.findOne({
        where: {
            steamId: idUser
        },
        attributes: ['steamId', 'gender', 'profession', 'birthdate']
    }).then(function (instanceUser) {
        if(!instanceUser) return callback('User not found', 404, null);
        return callback(null, 200, instanceUser);
    }).catch(function (err) {
        return callback(err, 500, null);
    })
}
