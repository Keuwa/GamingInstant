/**
* Created by Grunt on 29/06/2017.
*/
var Sequelize = require('sequelize');
var steamId;
var models = require('../../models')
module.exports = function (server) {
  return function (req, res, next) {
    steamId = req.body.steamId;
    models.User.create({
      steamId: req.body.steamId,
      birthdate: req.body.birthdate,
      password: req.body.password,
      gender: req.body.gender,
      profession: req.body.profession
    }).then(function (user) {
      if (!user) return res.status(500).send("Couldn't create user");
      //request on https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=1F90FB9A49F4A36356B1C3F3AB2088ED&format=json&steamid=
      var request = require('request-promise-native');
      var options = {
        url: 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=1F90FB9A49F4A36356B1C3F3AB2088ED&format=json&steamid=' + req.body.steamId,
        json: true,
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
        //resolveWithFullResponse: true
      };
      var errNum = 0;
      request.get(options)
      .then(function(result) {
        console.log(result);
        var array = [];
        for (var i = 0; i < result.response.games.length; i ++) {
          var item = {
            steamId: steamId,
            gameId: result.response.games[i].appid,
            playedTime: result.response.games[i].playtime_forever / 60
          }
          array.push(item);
        }
        var actions = array.map(fn);
        var results = Promise.all(actions);
        results.then(function() {
          return res.status(201).send(user);
        });
      });
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

var fn = function addItemToBdd(item){ // sample async action
  return new Promise(resolve => setTimeout(() => resolve(
    models.GameUser.upsert(item).catch(function(err) {
      console.log(err);
    })
  ), 100));
};
