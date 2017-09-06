/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function(server) {
    return {
        login: require('./login')(server)
    }
};
