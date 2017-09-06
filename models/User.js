/**
* Created by Grunt on 06/09/2017.
*/
var md5 = require('md5');
module.exports = function (sequelize, Datatypes) {

    var User = sequelize.define('User', {
        steamId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },
        birthdate: {
            type: Datatypes.STRING,
            validate: {isDate: true}
        },
        gender: {
            type: Datatypes.ENUM('M', 'F'),
            notNull: true
        },
        profession: Datatypes.STRING,
        password_hash: Datatypes.STRING,
        password: {
            type: Datatypes.VIRTUAL,
            notNull: true,
            set: function (val) {
                this.setDataValue('password_hash', md5(val));
            },
            validate: {
                isLongEnough: function (val) {
                    if (val.length < 7) {
                        throw new Error("Please choose a longer password")
                    }
                }
            }
        }
    });

    return User;
};
