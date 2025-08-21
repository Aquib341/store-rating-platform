const express = require('express');
const { Rating, Store, User } = require('../models');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Submit or update rating
router.post('/', authenticate, async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { userId: req.user.id, storeId }
    });
    
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json(existingRating);
    }
    
    const newRating = await Rating.create({
      rating,
      userId: req.user.id,
      storeId
    });
    
    res.status(201).json(newRating);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get user's rating for a store
router.get('/user/:storeId', authenticate, async (req, res) => {
  try {
    const rating = await Rating.findOne({
      where: { userId: req.user.id, storeId: req.params.storeId }
    });
    
    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;