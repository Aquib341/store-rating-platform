const express = require('express');
const { Store, Rating, User, sequelize } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Get all stores with average ratings
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    const stores = await Store.findAndCountAll({
      where: whereClause,
      include: [{
        model: Rating,
        attributes: [],
        duplicating: false
      }],
      attributes: {
        include: [
          [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('Ratings.rating')), 0), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'ratingCount']
        ]
      },
      group: ['Store.id'],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      subQuery: false
    });
    
    res.json({
      stores: stores.rows,
      totalCount: stores.count.length,
      totalPages: Math.ceil(stores.count.length / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single store with ratings
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [{
        model: Rating,
        include: [{
          model: User,
          attributes: ['id', 'name']
        }]
      }]
    });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create store (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    
    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null
    });
    
    res.status(201).json(store);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;