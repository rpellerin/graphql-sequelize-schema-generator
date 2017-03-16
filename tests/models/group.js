'use strict'
module.exports = function (sequelize, DataTypes) {
  var Group = sequelize.define(
    'Group',
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      classMethods: {
        associate: function (models) {
          models.Group.belongsToMany(models.User, {
            through: 'UserGroups'
          })
          // associations can be defined here
        }
      }
    }
  )
  return Group
}
