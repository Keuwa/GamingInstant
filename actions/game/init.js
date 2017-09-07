/**
* Created by Grunt on 06/09/2017.
*/
//var array;
var errors = 0;
var models = require('../../models');
var errors = 0;
var zlib = require('zlib')
var fs = require('fs')
var models = require('../../models')
var path = require('path');
var parse = require('csv-parse');

module.exports = function (server) {
  return function (req, res, next) {

    var request = require('request-promise-native');
    var options = {
      url: 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json',
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
            //TODO here add in db
            var actions2 = records.map(fnSearch);
            var results2 = Promise.all(actions2);
            results2.then(function(records) {
              return res.status(200).send("OK");
            });
            //records
          });
        });
        //res.status(200).send('Created with ' + errors + ' errors')
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
        models.GameUser.create({
          gameId: instanceGame.appid,
          steamId: entry[0],
          playedTime: entry[3]
        }).catch(function(err) {
          console.log(err);
        })
      }).catch(function(err) {
        console.log(err);
      })), 100));
    }
  };
