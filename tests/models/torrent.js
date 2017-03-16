'use strict'
module.exports = function (sequelize, DataTypes) {
  var Torrent = sequelize.define(
    'Torrent',
    {
      magnet: DataTypes.STRING,
      name: DataTypes.STRING,
      source: DataTypes.STRING
    },
    {
      classMethods: {
        associate: function (models) {
          models.Torrent.belongsTo(models.User) // Will add a UserId attribute to Torrent to hold the primary value for User
          // associations can be defined here
        }
      }
    }
  )
  return Torrent
}
