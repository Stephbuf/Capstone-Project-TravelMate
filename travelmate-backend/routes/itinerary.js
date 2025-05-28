const express = require('express');
const router = express.Router();
const Itinerary = require('../models/itinerary');

// CREATE new itinerary item
router.post('/', async (req, res) => {
  try {
    const { userEmail, country, city, name, address } = req.body;
    const entry = await Itinerary.create({ userEmail, country, city, name, address });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create itinerary entry', error: err.message });
  }
});

// GET itinerary by user
router.get('/:userEmail', async (req, res) => {
  try {
    const entries = await Itinerary.findAll({ where: { userEmail: req.params.userEmail } });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch itinerary', error: err.message });
  }
});

module.exports = router;
