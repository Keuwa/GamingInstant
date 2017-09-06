/**
* Created by Grunt on 29/06/2017.
*/
var jwt = require('jsonwebtoken');
var md5 = require('md5');
module.exports = function (server) {
    var models = require('../../models');
    var User = models.User;
    var AuthToken = models.AuthToken;

    return function (req, res, next) {
        req.body.password = md5(req.body.password);
        User.findOne({
            where: {
                steamId: req.body.steamId,
                password_hash: req.body.password
            }
        }).then(function (instanceUser) {
            if(!instanceUser) {
                return res.status(401).send('invalid credentials');
            }
            AuthToken.findOrCreate({
                where: {
                    userId: instanceUser.steamId
                },
                defaults: {
                    userId: instanceUser.steamId
                }
            }).then(function(instanceAuthToken) {
                var encrypted = jwt.sign({auth: instanceAuthToken[0].id}, server.config.TOKEN_SECRET);
                res.header('X-AUTH-TOKEN', encrypted).send(instanceUser);
            }).catch(function (err) {
                res.status(500).send(err);
            });
        }).catch(function (err) {
            res.status(500).send(err);
        });
    }
};

//function cryptMd5(val) {
//
//}
