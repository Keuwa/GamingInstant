/**
* Created by Grunt on 06/09/2017.
*/
module.exports = function (sequelize, Datatypes) {

    var GameUser = sequelize.define('GameUser', {
        id: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true,
            index: true
        },
        steamId: {
          type: Datatypes.STRING
        },
        gameId: {
          type: Datatypes.STRING
        },
        playedTime: Datatypes.FLOAT
    });


    return GameUser;
};
