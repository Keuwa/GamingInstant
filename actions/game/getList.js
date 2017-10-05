/**
* Created by Grunt on 06/09/2017.
*/
var models = require('../../models');
module.exports = function(server) {
  return function (req, res, next) {
    var User = models.User;

    // TODO: Add filter of exclusion, age/price, played game ....
    models.Game.findAll({
    }).then(function (instanceGame) {
      if(!instanceGame) return res.status(404).send("Not found");
        filterResult(instanceGame);
      return res.status(200).send(instanceGame);
    }).catch(function (err) {
      return res.status(500).send(err);
    })
  }
}


function filterResult() {
  // TODO: calculate user preferences (time played on games, genre, type)
  // order game by
}
