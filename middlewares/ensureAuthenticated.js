/**
* Created by Grunt on 29/06/2017.
*/
var jwt = require('jsonwebtoken');

module.exports = function(server){
    //var models = server.models.db.sequelize.models;
    var AuthToken = require('../models').AuthToken;
    var User = require('../models').User;

    return function(req, res, next){
        var signed = req.headers['x-auth-token'];
        if (!signed)
            return res.status(401).send('unauthorized');

        jwt.verify(signed, server.config.TOKEN_SECRET, function(err, decoded){
            if (err)
                return res.status(401).send(err);

            var tokenId = decoded.auth;
            AuthToken.findOne({
                where: {
                    id: tokenId
                }
            }).then(function(instanceToken) {
                if (!instanceToken)
                    return res.status(401).send('unauthorized');

                User.findOne({
                    where: {
                        id: instanceToken.userId
                    }
                }).then(function(instanceUser) {
                    if (!instanceUser)
                        return res.status(500).send(instanceUser);

                    req.auth = req.auth || {};
                    req.auth.user = instanceUser;
                    req.auth.token = instanceToken.id;

                    next();
                }).catch(function(err) {
                    if (err)
                        return res.status(500).send(err);
                })
            }).catch(function(err) {
                if (err)
                    return res.status(500).send(err);
            });

            AuthToken.findById(tokenId, function(err, token){
                if (err)
                    return res.status(500).send(err);
                if (!token)
                    return res.status(401).send('unauthorized');

                User.findById(token.userId, function(err, user){
                    if (err)
                        return res.status(500).send(err);

                    req.auth = req.auth || {};
                    req.auth.user = user;
                    req.auth.token = token._id;

                    next();
                })
            })
        });
    }
}
