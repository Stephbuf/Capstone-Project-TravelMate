const express = require('express');
const router = express.Router();
const db = require('../db_config');
const { DataTypes } = require('sequelize');

// Define User model
const User = db.define('users', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING(50), allowNull: false },
  lastName: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
}, {
  timestamps: false
});

// Create table if not exists
User.sync();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new user
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.create({ firstName, lastName, email, password });

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (result) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /users/login - Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
