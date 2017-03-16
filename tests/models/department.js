'use strict'
module.exports = function (sequelize, DataTypes) {
  var Department = sequelize.define(
    'Department',
    {
      name: DataTypes.STRING
    },
    {
      classMethods: {
        associate: function (models) {
          models.Department.hasMany(models.Department)
        }
      }
    }
  )
  return Department
}
