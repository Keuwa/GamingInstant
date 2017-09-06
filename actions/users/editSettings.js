/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function (server) {
    return function (req, res, next) {
        var models = require('../../models');
        var idUser = req.auth.user.steamId;
        var User = models.User;

        User.findOne({
            where: {
                steamId: idUser
            }
        }).then(function(instanceUser) {
            if(!instanceUser)
                return res.status(404).send('Not found');

            instanceUser.update({
                
            }).then(function(instanceUserUpdated) {
                if(!instanceUserUpdated)
                    return res.status(500).send(instanceUserUpdated);

                return res.status(200).send(instanceUserUpdated);
            }).catch(function (err) {
                return res.status(500).send(err);
            })
        }).catch(function (err) {
            return res.status(500).send(err);
        });

    }
};
