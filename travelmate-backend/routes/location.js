const express = require('express');
const router = express.Router();
const Location = require('../models/location');


// CREATE a new location
router.post('/', async (req, res) => {
  try {
    const { country, category, customCategory, address } = req.body;
    const location = await Location.create({ country, category, customCategory, address });
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create location', error: err });
  }
});

// GET all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch locations', error: err });
  }
});

// GET single location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving location', error: err });
  }
});

// UPDATE a location
router.put('/:id', async (req, res) => {
  try {
    const { country, category, customCategory, address } = req.body;
    const [updated] = await Location.update(
      { country, category, customCategory, address },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update location', error: err });
  }
});

// DELETE a location
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Location.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Location not found' });
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete location', error: err });
  }
});

module.exports = router;
