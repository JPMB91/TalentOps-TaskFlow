import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/config/database';

describe('Auth API', () => {
  beforeEach(async () => {
    // Clean up database
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    test('should register user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body).toHaveProperty('token');
    });

    test('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login successfully with correct credentials', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
      };

      // Register user first
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body).toHaveProperty('token');
    });

    test('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});