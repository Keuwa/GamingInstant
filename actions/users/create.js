/**
* Created by Grunt on 29/06/2017.
*/
var Sequelize = require('sequelize');
module.exports = function (server) {
    return function (req, res, next) {
        var models = require('../../models')

        models.User.create({
          steamId: req.body.steamId,
          birthdate: req.body.birthdate,
          password: req.body.password,
          gender: req.body.gender,
          profession: req.body.profession
        }).then(function (user) {
          if (!user) return res.status(500).send("Couldn't create user");
            return res.status(201).send(user);
        }).catch(Sequelize.ValidationError, function (err) {
            // respond with validation errors : already existing
            if (err.errors[0].message === 'User already existing')
                return res.status(409).send({message: err.errors[0].message});
            //other error
            return res.status(500).send({message: 'Error while creating account'});
        }).catch(function (err) {
            return res.status(500).send({message: 'Error while creating account'});
        });
    }
};
