const Itinerary = sequelize.define('itinerary', {
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
  tableName: 'itinerary'
});

module.exports = Itinerary;
