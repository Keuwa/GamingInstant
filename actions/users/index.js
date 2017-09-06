/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function(server) {
    return {
        create: require('./create')(server),
        list: require('./list')(server),
        editSettings: require('./editSettings')(server),
        showById: require('./showById').showById(server)
    }
};
