/**
* Created by Grunt on 06/09/2017.
*/
var models = require('../../models');
module.exports = function(server) {
  return function (req, res, next) {

    //Get all stats by game calculate moyenne this week + moyenne total.
    models.GameUser.findAll({
        order: [['gameId', 'DESC']]
  }).then(function (instanceGame) {
      var result = {}
      for(var i = 0 ; i < instanceGame.length ; i++ ){
        //do stats
        console.log(instanceGame[i]);
        /*if(typeof result[instanceGame[i].gameId] == "undefined")
        {
          result[instanceGame[i].gameId] = {
            count:0,
            minutes:0.0
          }
        }*/

        result[instanceGame[i].gameId].count += 1;
        result[instanceGame[i].gameId].minutes += [instanceGame[i].playedTime];
      }
      //MAKE STATS
      console.log(result);
      return res.status(200).send(result);
    }).catch(function (err) {
      return res.status(500).send(err);
    })
  }
}
