const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const Location = require('../models/location');

// Create new location (wishlist or itinerary)
router.post('/', async (req, res) => {
  try {
    const {
      country,
      city,
      category,
      location_name,
      address,
      userEmail,
      wishlist,
      place_id,
      tag
    } = req.body;

    const newLocation = await Location.create({
      country,
      city,
      category,
      location_name,
      address,
      userEmail,
      wishlist,
      place_id,
      tag
    });

    res.status(201).json(newLocation);
  } catch (err) {
    console.error('🔥 Error creating location:', err);
    res.status(500).json({ message: 'Failed to save location', error: err.message });
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get locations', error: err.message });
  }
});

// Get countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Location.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('country')), 'country']],
    });
    res.status(200).json(countries.map((c) => c.country));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch countries', error: err.message });
  }
});

//Get locations by user and wishlist status
router.get('/user/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const { tag } = req.query;

    const whereClause = { userEmail };
    if (tag) {
      whereClause.tag = tag;
    }

    console.log('📦 Fetching with:', whereClause); 
    const entries = await Location.findAll({ where: whereClause });

    console.log('🎯 Found entries:', entries); 
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user locations', error: err.message });
  }
});
// Get single location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving location', error: err.message });
  }
});

// Update location
router.put('/:id', async (req, res) => {
  try {
    const {
      country,
      city,
      category,
   
      address,
      place_id,
      userEmail,
      location_name,
      wishlist,
    } = req.body;

    const [updated] = await Location.update(
      {
        country,
        city,
        category,
        address,
        place_id,
        userEmail,
        location_name,
        wishlist,
      },
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Location.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete location', error: err.message });
  }
});

module.exports = router;
