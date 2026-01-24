// Jest setup file
const { prisma } = require('./src/config/database');

// Global test timeout
jest.setTimeout(10000);

// Global teardown
afterAll(async () => {
  // Clean up database after all tests
  await prisma.$disconnect();
});