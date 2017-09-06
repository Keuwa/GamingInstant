/**
* Created by Grunt on 29/06/2017.
*/

module.exports = {
    remove: function (server) {
        return function (req, res, next) {
            removeUser(req.auth.user, function (err, status, result) {
                return res.status(status).send(err || result);
            })
        }
    }
}

function removeUser(instanceUser, callback) {
    instanceUser.destroy().then(function () {
        return callback(null, 204, "User removed")
    }).catch(function (err) {
        return callback(err, 500, null)
    })
}
