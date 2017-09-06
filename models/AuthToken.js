/**
* Created by Grunt on 29/06/2017.
*/
module.exports = function(sequelize, Datatypes) {
    return User = sequelize.define('AuthToken', {
        id: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: Datatypes.UUID,
            allowNull: false
        }
    }, {
        instanceMethods: {
            isTokenOutdated: function() {
                var
                currentDate = new Date(),
                tokenAge = (currentDate - this.createdAt) / 1000;

                return tokenAge > 3600;
            }
        }
    })
};
