/**
* Created by Grunt on 06/09/2017.
*/
module.exports = function(server) {
    return {
        init: require('./init')(server),
        get: require('./get')(server),
        getAll: require('./getAll')(server),
        getList: require('./getList')(server)
    }
};
