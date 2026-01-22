// backend/src/services/authService.test.ts
import { AuthService } from './authService';
import { prisma } from '../config/database';

// Mock Prisma
jest.mock('../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should create user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        createdAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.register(userData);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name,
          email: userData.email,
          password: expect.any(String), // Password hashed
        },
        select: expect.any(Object),
      });

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
    });

    test('should throw error if user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'john@test.com',
      });

      await expect(
        AuthService.register({
          name: 'John Doe',
          email: 'john@test.com',
          password: 'password123',
        })
      ).rejects.toThrow('User already exists');
    });
  });
});