const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./db_config');

const app = express();
const PORT = 3000;

// Import routes
const usersRoutes = require('./routes/users');
const locationsRoutes = require('./routes/locations'); 

// Middleware
app.use(cors({
  origin: 'http://localhost:8100',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.use('/users', usersRoutes);
app.use('/locations', locationsRoutes); 
app.use('/itinerary', require('./routes/itinerary'));
app.use('/wishlist', require('./routes/wishlist'));



// Base endpoint
app.get('/', (req, res) => {
  res.send('Motiv API is running.. yay!');
});

// Sync DB and start server
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
