const { DataTypes } = require('sequelize');
const sequelize = require('../db_config'); 

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'locations',
  timestamps: true, 
});

module.exports = Location;
