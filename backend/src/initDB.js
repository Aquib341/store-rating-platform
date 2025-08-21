const { sequelize, User, Store, Rating } = require('./models');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

async function initializeDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
    
    // Add some demo data
    await addDemoData();
    console.log('Demo data added successfully.');
    
  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

async function addDemoData() {
  // Create demo users
  const adminUser = await User.create({
    name: 'System Administrator User',
    email: 'admin@example.com',
    password: 'Admin123!',
    address: '123 Admin Street, Admin City',
    role: 'admin'
  });
  
  const ownerUser = await User.create({
    name: 'Store Owner User',
    email: 'owner@example.com',
    password: 'Owner123!',
    address: '456 Owner Avenue, Owner Town',
    role: 'store_owner'
  });
  
  const regularUser = await User.create({
    name: 'Regular Customer User',
    email: 'user@example.com',
    password: 'User123!',
    address: '789 User Road, User Village',
    role: 'user'
  });
  
  // Create demo stores
  const electronicsStore = await Store.create({
    name: 'Best Electronics Store',
    email: 'electronics@example.com',
    address: '123 Tech Street, Tech City',
    ownerId: ownerUser.id
  });
  
  const furnitureStore = await Store.create({
    name: 'Quality Furniture Shop',
    email: 'furniture@example.com',
    address: '456 Comfort Road, Comfort Town',
    ownerId: null
  });
  
  const groceryStore = await Store.create({
    name: 'Fresh Grocery Market',
    email: 'grocery@example.com',
    address: '789 Food Avenue, Food Village',
    ownerId: null
  });
  
  // Create demo ratings
  await Rating.create({
    rating: 5,
    userId: regularUser.id,
    storeId: electronicsStore.id
  });
  
  await Rating.create({
    rating: 4,
    userId: regularUser.id,
    storeId: furnitureStore.id
  });
  
  await Rating.create({
    rating: 3,
    userId: adminUser.id,
    storeId: electronicsStore.id
  });
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;