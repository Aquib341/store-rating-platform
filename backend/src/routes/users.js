const express = require('express');
const { User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, address } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (name) user.name = name;
    if (address) user.address = address;
    
    await user.save();
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;