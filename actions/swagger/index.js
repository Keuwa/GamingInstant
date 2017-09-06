/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function(server) {
    return {
        initSwagger: require('./initSwagger')(server)
    }
};
