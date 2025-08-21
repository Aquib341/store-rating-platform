'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create demo users
    const users = await queryInterface.bulkInsert('Users', [
      {
        name: 'System Administrator User',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin123!', 10),
        address: '123 Admin Street, Admin City',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Store Owner User',
        email: 'owner@example.com',
        password: await bcrypt.hash('Owner123!', 10),
        address: '456 Owner Avenue, Owner Town',
        role: 'store_owner',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Regular Customer User',
        email: 'user@example.com',
        password: await bcrypt.hash('User123!', 10),
        address: '789 User Road, User Village',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create demo stores
    const stores = await queryInterface.bulkInsert('Stores', [
      {
        name: 'Best Electronics Store',
        email: 'electronics@example.com',
        address: '123 Tech Street, Tech City',
        ownerId: users[1].id, // Store owner user
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Quality Furniture Shop',
        email: 'furniture@example.com',
        address: '456 Comfort Road, Comfort Town',
        ownerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fresh Grocery Market',
        email: 'grocery@example.com',
        address: '789 Food Avenue, Food Village',
        ownerId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create demo ratings
    await queryInterface.bulkInsert('Ratings', [
      {
        rating: 5,
        userId: users[2].id, // Regular user
        storeId: stores[0].id, // Best Electronics Store
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        rating: 4,
        userId: users[2].id, // Regular user
        storeId: stores[1].id, // Quality Furniture Shop
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        rating: 3,
        userId: users[0].id, // Admin user
        storeId: stores[0].id, // Best Electronics Store
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ratings', null, {});
    await queryInterface.bulkDelete('Stores', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};