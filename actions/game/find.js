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
      if(!instanceGame) return res.status(404).send("Not found");
        //filterResult(instanceGame)
        let promises = [];
        for(let i in instanceGame){
          let options = {
            url: 'http://store.steampowered.com/api/appdetails?appids='+instanceGame[i].appid,
            json: true,
            headers: {
              'content-type': 'application/json; charset=utf-8'
            }
          };
          promises.push(request.get(options))
        }
      Promise.all(promises).then(function (gameList) {
        let results = []
        for(let i in gameList){
            let gameId = Object.keys(gameList[i])[0]
            console.log("id : ",gameId," //// ",gameList[i][gameId]);
            let price;
            if(gameList[i][gameId].success != false){
              if(typeof(gameList[i][gameId].data.price_overview)=="undefined"){
                price = 0
              }else{
                price = gameList[i][gameId].data.price_overview.initial/100
              }
              results.push({
                name:gameList[i][gameId].data.name,
                required_age:gameList[i][gameId].data.required_age,
                detailed_description:gameList[i][gameId].data.detailed_description,
                price:price,
                category:gameList[i][gameId].data.genres,
                imageUrl:typeof(gameList[i][gameId].data.screenshots)=="undefined"?"http://www.jblog.fr/images/mini_500_noimg.gif":gameList[i][gameId].data.screenshots[0].path_thumbnail
              })
          }
        }
        return res.status(200).send(results);

      }).catch(function (err) {
        console.error(err);
        return res.status(500).send("ERROR");
      })

    }).catch(function (err) {
      return res.status(500).send(err);
    })
  }
}
