const { DataTypes } = require('sequelize');
const sequelize = require('../db_config');

const Location = sequelize.define('Location', {
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  custom_category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  place_id: {
    type: DataTypes.STRING,
    allowNull: true // 
  },
  tag:{
    type:DataTypes.STRING,
    allowNull: false

  }
}, {
  timestamps: false, 
  tableName: 'locations'
});

module.exports = Location;
