/**
* Created by Grunt on 06/09/2017.
*/
var router = require('express').Router();
module.exports = function(server){
  router
  .post('/',
  server.actions.game.init)

  .post('/stats/',
  server.actions.game.putStats)

  .get('/',
  server.actions.game.getAll)

  .get('/search/',server.middlewares.ensureAuthenticated,
  server.actions.game.find)

  .get('/:gameId/',
  server.actions.game.get)



  //.post('/logout',
  //    server.middlewares.ensureAuthenticated,
  //    server.actions.auth.logout)

  return router;
};
