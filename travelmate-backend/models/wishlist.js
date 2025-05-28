const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Wishlist = sequelize.define('wishlist', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userEmail: DataTypes.STRING,
  country: DataTypes.STRING,
  city: DataTypes.STRING,
  name: DataTypes.STRING,
  address: DataTypes.TEXT
}, {
  timestamps: false,
  tableName: 'wishlist'
});

module.exports = Wishlist;
