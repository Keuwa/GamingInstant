/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function (server) {
    return function (req, res, next) {
        var models = require('../../models')

        models.User.findAll({
            attributes: ['id', 'firstname', 'lastname', 'birthdate', 'email', 'gender', 'createdAt']
        }).then(function (instanceUsers) {
            res.status(200).send(instanceUsers);
        }).catch(function (err) {
            res.status(500).send(err);
        });
    }
};
