/**
* Created by Grunt on 06/09/2017.
*/




var models = require('../../models');
module.exports = function(server) {
  return function (req, res, next) {
    var User = models.User;
    models.Game.findAll({
    }).then(function (instanceGame) {
      if(!instanceGame) return res.status(404).send("Not found");
      return res.status(200).send(instanceGame);
    }).catch(function (err) {
      return res.status(500).send(err);
    })
  }
}
