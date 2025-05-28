const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize'); // ✅ Required for DISTINCT
const Location = require('../models/location');

// CREATE a new location
router.post('/', async (req, res) => {
  try {
    console.log('Received payload:', req.body);

    const { country, city, category, custom_category, address } = req.body;

    const finalCategory =
      category === 'Add Category' && custom_category
        ? custom_category
        : category;

    const location = await Location.create({
      country,
      city,
      address,
      category: finalCategory,
      custom_category,
      palce_id,
      tag
    });

    res.status(201).json(location);
  } catch (err) {
    console.error('🔥 Error creating location:', err);
    res
      .status(500)
      .json({ message: 'Failed to create location', error: err.message });
  }
});

// GET distinct countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Location.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('country')), 'country'],
      ],
    });
    res.status(200).json(countries.map((c) => c.country));
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch countries', error: err.message });
  }
});

// GET all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch locations', error: err.message });
  }
});

// GET single location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location)
      return res.status(404).json({ message: 'Location not found' });
    res.status(200).json(location);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error retrieving location', error: err.message });
  }
});

// UPDATE a location
router.put('/:id', async (req, res) => {
  try {
    const { country, city, category, custom_category, address, place_id } =
      req.body;

    const [updated] = await Location.update(
      {
        country,
        city,
        category,
        custom_category,
        address,
        place_id,
      },
      { where: { id: req.params.id } }
    );

    if (!updated)
      return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to update location', error: err.message });
  }
});

// DELETE a location
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Location.destroy({ where: { id: req.params.id } });
    if (!deleted)
      return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete location', error: err.message });
  }
});

module.exports = router;
