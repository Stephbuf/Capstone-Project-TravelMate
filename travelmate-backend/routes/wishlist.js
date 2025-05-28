const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');

// CREATE wishlist item
router.post('/', async (req, res) => {
  try {
    const { userEmail, country, city, name, address } = req.body;
    const entry = await Wishlist.create({ userEmail, country, city, name, address });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create wishlist entry', error: err.message });
  }
});

// GET wishlist by user
router.get('/:userEmail', async (req, res) => {
  try {
    const entries = await Wishlist.findAll({ where: { userEmail: req.params.userEmail } });
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: err.message });
  }
});

module.exports = router;
