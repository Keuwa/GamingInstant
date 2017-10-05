/**
* Created by Grunt on 06/09/2017.
*/
module.exports = function (sequelize, Datatypes) {

    var Category = sequelize.define('Category', {
        id: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true,
            index: true
        },
        description: {
          type: Datatypes.STRING,
          index: true
        }
    });

    Category.associate = function(models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
    models.Category.belongsToMany(models.User,
      {
        as: 'Category',
        allowNull: true,
        through: 'category_game'
      })
  }

    return Category;
};
