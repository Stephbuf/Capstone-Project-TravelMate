const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./db_config');

const app = express();
const PORT = 3000;

// ✅ Import models first
const User = require('./models/users');
const Location = require('./models/location');

// ✅ Define associations AFTER models are loaded
User.hasMany(Location, {
  foreignKey: 'userEmail',
  sourceKey: 'email',
  as: 'locations'
});

Location.belongsTo(User, {
  foreignKey: 'userEmail',
  targetKey: 'email'
});

// ✅ Import routes
const usersRoutes = require('./routes/users');
const locationsRoutes = require('./routes/locations');

// ✅ Middleware
app.use(cors({
    origin: ['http://localhost:8100', 'http://localhost:8101'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Register routes
app.use('/users', usersRoutes);
app.use('/locations', locationsRoutes);

// ✅ Base endpoint
app.get('/', (req, res) => {
  res.send('Motiv API is running.. yay!');
});

// ✅ Sync DB and start server
sequelize.sync()
  .then(() => {
    console.log('✅ Database synced successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync database:', err);
  });
