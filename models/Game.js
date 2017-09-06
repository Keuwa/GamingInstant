/**
* Created by Grunt on 06/09/2017.
*/
module.exports = function (sequelize, Datatypes) {

    var Game = sequelize.define('Game', {
        appid: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },
        name: Datatypes.STRING,
        required_age: Datatypes.INTEGER,
        price: Datatypes.STRING
    });

    return Game;
};
