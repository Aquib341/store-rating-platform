const express = require('express');
const { User, Store, Rating, sequelize } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

router.use(authenticate, authorize('admin'));

// Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    
    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with filtering
router.get('/users', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    if (role) {
      whereClause.role = role;
    }
    
    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      users: users.rows,
      totalCount: users.count,
      totalPages: Math.ceil(users.count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user (admin only)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      address,
      role: role || 'user'
    });
    
    res.status(201).json({
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

// Get all stores with filtering for admin
router.get('/stores', async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
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
      }, {
        model: User,
        as: 'Owner',
        attributes: ['id', 'name', 'email'],
        required: false
      }],
      attributes: {
        include: [
          [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('Ratings.rating')), 0), 'averageRating']
        ]
      },
      group: ['Store.id', 'Owner.id'],
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

module.exports = router;