// Jest setup file
const { prisma } = require('./src/config/database');

// Global teardown
module.exports = async () => {
  // Clean up database after all tests
  await prisma.$disconnect();
};

// Global test timeout
jest.setTimeout(10000);