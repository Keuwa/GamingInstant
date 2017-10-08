/**
* Created by Grunt on 06/09/2017.
*/

"use strict";
var request = require('request-promise-native');

var models = require('../../models');
module.exports = function(server) {
  return function (req, res, next) {
    console.log("bbbbbbbbbbbbbbbbbb");

    // TODO: Add filter of exclusion, age/price, played game ....
    models.Game.findAll({
    }).then(function (instanceGame) {
      console.log("aaaaaaaaaaaaaaaaaa");
      if(!instanceGame) return res.status(404).send("Not found");
        //filterResult(instanceGame)
        let promises = [];
        for(let i in instanceGame){
          let options = {
            url: 'http://store.steampowered.com/api/appdetails?appids='+instanceGame.appid,
            json: true,
            headers: {
              'content-type': 'application/json; charset=utf-8'
            }
          };
          promises.push(request.get(options))
        }
      Promise.all(promises).then(function (gameList) {
        let results = {}
        return res.status(200).send(instanceGame);

      })

    }).catch(function (err) {
      return res.status(500).send(err);
    })
  }
}
