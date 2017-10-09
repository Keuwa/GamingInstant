/**
* Created by Grunt on 06/09/2017.
*/
module.exports = function (sequelize, Datatypes) {

    var Game = sequelize.define('Game', {
        appid: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true,
            index: true
        },
        name: Datatypes.STRING,
        required_age: Datatypes.INTEGER,
        price: Datatypes.STRING,
        records_count: Datatypes.INTEGER,
        minutes_mean: Datatypes.FLOAT
    });

    Game.associate = function(models) {
        Game.hasMany(models.Category)
      }

    return Game;
};
