/**
* Created by Grunt on 06/09/2017.
*/

"use strict";
var request = require('request-promise-native');
let sequelize = require('sequelize');



var models = require('../../models');
module.exports = function(server) {
  return function (req, res, next) {
    // TODO: Add filter of exclusion, age/price, played game ....

    //Retrieve steamuserid
    // make stat for user

    let steamid = req.auth.user.steamId;

    models.GameUser.findAll({
      where:{
        steamid:steamid
      }
    }).then(function (gamesUsers) {

      let moyenne = 0;
      let i = 0;


      for (var gameUser in gamesUsers) {
        moyenne += gamesUsers[gameUser].playedTime
        i++;
      }

      moyenne/=i
      console.log("moyenne",moyenne);
      models.Game.findAll({
        where:{
          records_count:{
            $gte: 1
          }
        },
        order:[['minutes_mean','DESC']],
        //limit:30
      }).then(function (instanceGame) {
        if(!instanceGame) return res.status(404).send("Not found");
          let promises = [];
          let tempBestValueIndex=0;
          let instanceGameKeys = Object.keys(instanceGame);


          for (let i = 0 ;i<instanceGameKeys.length;i++) {
            if (Math.abs(instanceGame[i].minutes_mean - moyenne) < Math.abs(instanceGame[tempBestValueIndex].minutes_mean - moyenne)) {
              tempBestValueIndex = i;
            }
          }


          console.log("value = ",instanceGame[tempBestValueIndex]);
          let end;
          let start;
          if(tempBestValueIndex < 5){
            start = 0
            end = tempBestValueIndex + 5 + (5-tempBestValueIndex)
          }else if(tempBestValueIndex > instanceGameKeys.length-5){
            start = tempBestValueIndex - 5 - (instanceGameKeys.length - tempBestValueIndex)
            end = instanceGameKeys.length
          }else{
            start = tempBestValueIndex - 5;
            end = tempBestValueIndex + 5
          }


          console.log("start : ",start,"end : ",end);

          for (let i = start; i < end; i++) {
            console.log("Value : ",instanceGame[instanceGameKeys[i]].appid);
            let options = {
              url: 'http://store.steampowered.com/api/appdetails?appids='+instanceGame[instanceGameKeys[i]].appid,
              json: true,
              headers: {
                'content-type': 'application/json; charset=utf-8'
              }
            };
            promises.push(request.get(options))
          }
          console.log(Object.keys(promises));

          // for(let i in instanceGame){
          //   let options = {
          //     url: 'http://store.steampowered.com/api/appdetails?appids='+instanceGame[i].appid,
          //     json: true,
          //     headers: {
          //       'content-type': 'application/json; charset=utf-8'
          //     }
          //   };
          //   promises.push(request.get(options))
          // }
        Promise.all(promises).then(function (gameList) {
          let results = []
          for(let i in gameList){
              let gameId = Object.keys(gameList[i])[0]
              let price;
              if(gameList[i][gameId].success != false){
                if(typeof(gameList[i][gameId].data.price_overview)=="undefined"){
                  price = 0
                }else{
                  price = gameList[i][gameId].data.price_overview.initial/100
                }
                results.push({
                  appid:gameId,
                  name:gameList[i][gameId].data.name,
                  required_age:gameList[i][gameId].data.required_age,
                  detailed_description:gameList[i][gameId].data.detailed_description,
                  price:price,
                  category:gameList[i][gameId].data.genres.description,
                  imageUrl:typeof(gameList[i][gameId].data.screenshots)=="undefined"?"http://www.jblog.fr/images/mini_500_noimg.gif":gameList[i][gameId].data.screenshots[0].path_thumbnail
                })
            }
          }
          return res.status(200).send(results);

        }).catch(function (err) {
          //console.error(err);
          return res.status(500).send(err);
        })

      }).catch(function (err) {
        return res.status(500).send(err);
      })
    })


  }
}
