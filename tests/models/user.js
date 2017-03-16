'use strict'
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      bio: DataTypes.TEXT
    },
    {
      classMethods: {
        associate: function (models) {
          models.User.belongsToMany(models.Group, {
            through: 'UserGroups'
          })
          models.User.belongsTo(models.Department)
          // associations can be defined here
        }
      }
    }
  )
  return User
}
