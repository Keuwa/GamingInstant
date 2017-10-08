/**
* Created by Grunt on 06/09/2017.
*/
module.exports = function (sequelize, Datatypes) {

    var Stats = sequelize.define('Stats', {
        appid: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true,
            index: true
        },
        playtime_2weeks: {
          type: Datatypes.INTEGER
        },
        playtime_forever: {
          type: Datatypes.INTEGER
        },
    });

    return Stats;
};
