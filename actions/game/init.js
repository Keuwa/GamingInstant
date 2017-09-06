/**
* Created by Grunt on 06/09/2017.
*/
module.exports = function (server) {
  return function (req, res, next) {
    var models = require('../../models')

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
      var i = 0;
      models.Game.upsert(result.applist.apps[i])
      .then(function (added) {

      }).catch(function (err) {
        errNum ++;
      });
      return res.status(200).send('Created');
    }).catch(function(err) {
      console.log(err);
      return res.status(500).send(err);
    });
  }
};
