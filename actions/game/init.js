/**
* Created by Grunt on 06/09/2017.
*/
//var array;
"use strict";

var errors = 0;
var models = require('../../models');
var errors = 0;
var zlib = require('zlib')
var fs = require('fs')
var models = require('../../models')
var path = require('path');
var parse = require('csv-parse');
var request = require('request-promise-native');

module.exports = function (server) {
  return function (req, res, next) {

    var options = {
      url: 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json',
      json: true,
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    };
    var errNum = 0;

    request.get(options)
    .then(function(result) {
      console.log(result);

      result={
	"applist": {
		"apps": [
			{
				"appid": 5,
				"name": "Half-Life"
			},
			{
				"appid": 7,
				"name": "Steam Client"
			},
			{
				"appid": 8,
				"name": "winui2"
			},
			{
				"appid": 10,
				"name": "Counter-Strike"
			},
			{
				"appid": 20,
				"name": "Team Fortress Classic"
			},
			{
				"appid": 30,
				"name": "Day of Defeat"
			},
			{
				"appid": 40,
				"name": "Deathmatch Classic"
			},
			{
				"appid": 50,
				"name": "Half-Life: Opposing Force"
			},
			{
				"appid": 60,
				"name": "Ricochet"
			},
			{
				"appid": 70,
				"name": "Half-Life"
			},
			{
				"appid": 80,
				"name": "Counter-Strike: Condition Zero"
			},
			{
				"appid": 90,
				"name": "Half-Life Dedicated Server"
			},
			{
				"appid": 92,
				"name": "Codename Gordon"
			},
			{
				"appid": 100,
				"name": "Counter-Strike: Condition Zero Deleted Scenes"
			},
			{
				"appid": 130,
				"name": "Half-Life: Blue Shift"
			},
			{
				"appid": 150,
				"name": "Counter-Strike Steamworks Beta"
			},
			{
				"appid": 205,
				"name": "Source Dedicated Server"
			},
			{
				"appid": 210,
				"name": "Source Dedicated Server"
			},
			{
				"appid": 211,
				"name": "Source SDK"
			},
			{
				"appid": 215,
				"name": "Source SDK Base 2006"
			},
			{
				"appid": 218,
				"name": "Source SDK Base 2007"
			},
			{
				"appid": 219,
				"name": "Half-Life 2: Demo"
			},
			{
				"appid": 220,
				"name": "Half-Life 2"
			},
			{
				"appid": 240,
				"name": "Counter-Strike: Source"
			},
			{
				"appid": 260,
				"name": "Counter-Strike: Source Beta"
			},
			{
				"appid": 280,
				"name": "Half-Life: Source"
			},
			{
				"appid": 300,
				"name": "Day of Defeat: Source"
			},
			{
				"appid": 304,
				"name": "Day of Defeat: Source Press Review"
			},
			{
				"appid": 310,
				"name": "Source 2007 Dedicated Server"
			},
			{
				"appid": 320,
				"name": "Half-Life 2: Deathmatch"
			},
			{
				"appid": 340,
				"name": "Half-Life 2: Lost Coast"
			},
			{
				"appid": 360,
				"name": "Half-Life Deathmatch: Source"
			},
			{
				"appid": 364,
				"name": "HL1:MP Linux client"
			}]
    }
  }

      var actions = result.applist.apps.map(fn);
      var results = Promise.all(actions);
      results.then(function(data) {
        var csv =  path.join(__dirname, '..', '..', 'dist','steam.csv');
        var options = {
          auto_parse:true
        }

        fs.readFile(csv, function read(err, data) {
          if (err) {
            throw err;
          }
          parse(data, options, function functionName(err, records) {
            var actions2 = records.map(fnSearch);
            var results2 = Promise.all(actions2);

            results2.then(function(records) {
              console.log("hello");
              return res.status(200).send("OK");

              // models.Game.findAll({}).then(function (games) {
              //   let promises = []
              //   for(var game in games){
              //     console.log("\n ID : ",games[game].appid);
              //     var options = {
              //       url: 'http://store.steampowered.com/api/appdetails?appids='+games[game].appid,
              //       json: true,
              //       headers: {
              //         'content-type': 'application/json; charset=utf-8'
              //       }
              //     };
              //     promises.push(request.get(options))
              //   }
              //
              //   Promise.all(promises).then(function (results) {
              //     let price;
              //     let age;
              //     let categories;
              //     let promiseAddCategoryToBdd = []
              //     for(let result in results){
              //       for(let gameid in results[result]){
              //
              //         models.Game
              //           .findOne({id:gameid})
              //           .then(function (game) {
              //              for(let i in results){
              //                if(Object.keys(results[i])[0] == gameid){
              //                  if(results[i][gameid].success){
              //                    if(typeof(results[i][gameid].price_overview) != "undefined"){
              //                      price =  console.log("price : ",results[i][gameid].price_overview.final);
              //                    }else{
              //                      price = 0
              //                    }
              //                    age = results[i][gameid].data.required_age
              //                    categories = results[i][gameid].data.genres
              //                    console.log(categories,"\n");
              //                    models.Category.findOrCreate(
              //                      {
              //                        where:{
              //                          description:categories[0].description,
              //                          appid:gameid
              //                        }
              //                      }).then(function (category) {
              //                        models.Game.find(
              //                          {
              //                            where:{
              //                              appid:gameid
              //                            }
              //                          }).then(function (game) {
              //                            game.update({age:age,price:price})
              //                          })
              //                    })
              //                  }
              //                  break;
              //                }
              //              }
              //           }).catch(function (err) {
              //             console.error(err);
              //           })
              //
              //           // models.Category.bulkCreate(categories).then(function () {
              //           //   console.log("done");
              //           // })
              //           // .catch(function (err) {
              //           //   console.error(err);
              //           // })
              //
              //
              //           //Retrieve and create catégory if needed
              //           //When created --> add them to the game
              //           //REturn 200
              //         }
              //       }
              //       //console.log(results[1][result].data.price_overview);
              //     return res.status(200).send("OK");
              //   }).catch(function (err) {
              //     console.error(err);
              //   })
              //
              // }).catch(function (err) {
              //   console.log(err);
              // })
            });

          });
        });
      });
    }).catch(function(err) {
      console.log(err);
      return res.status(500).send(err);
    });
  }
};

var fn = function addItemToBdd(item){ // sample async action
  return new Promise(resolve => setTimeout(() => resolve(models.Game.upsert(item).catch(function(err) {
    errors = errors + 1;
  })), 100));
};

var fnSearch = function getIdForGameName(entry){ // sample async action
  if (entry[2] === "play") {
    return new Promise(resolve => setTimeout(() => resolve(
      models.Game.findOne({
        where: {
          name: entry[1]
        },
        attributes: ['appid']
      }).then(function(instanceGame) {
        if (instanceGame)
        {
          models.GameUser.create({
            gameId: instanceGame.appid,
            steamId: entry[0],
            playedTime: entry[3]
          }).catch(function(err) {
            console.log(err);
          })
        }
      }).catch(function(err) {
        console.log(err);
      })), 100));
    }
  };









function addGameInfo(appid) {
  var options = {
    url: 'http://store.steampowered.com/api/appdetails?appids='+appid,
    json: true,
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  };
  let requestResult;
  request.get(options).then(function (result) {
    requestResult = result
    models.Game.findOne({
      where: {appid: appid}
    }).then(game => {
        console.log(" \n \n Price :",typeof(requestResult[appid].data.price_overview) == "undefined"? "0" : requestResult[appid].data.price_overview.initial);

        //create all category if needed

        //then add to
        //game.setCategory([category])

        game.update({
          required_age:requestResult[appid].data.required_age,
          price:typeof(requestResult[appid].data.price_overview) == "undefined"? "0" : requestResult[appid].data.price_overview.initial
        }).catch(function(err) {
          ///console.log(err);
        })
        // TODO: catégorie




    }).catch(err =>{
      console.log(err);
    })
  })
};
