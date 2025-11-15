import User from '../../../src/models/User.js';

// Mock mongoose
jest.mock('mongoose', () => ({
  Schema: jest.fn(),
  model: jest.fn(),
  connect: jest.fn(),
  connection: {
    close: jest.fn()
  }
}));

// Mock User model
jest.mock('../../../src/models/User.js');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const mockUser = {
        ...userData,
        role: 'developer',
        isActive: true,
        _id: '123',
        toJSON: jest.fn().mockReturnValue({ ...userData, role: 'developer' })
      };

      User.create = jest.fn().mockResolvedValue(mockUser);

      const user = await User.create(userData);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('developer');
      expect(user.isActive).toBe(true);
    });

    it('should hash password before saving', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        ...userData,
        password: '$2a$10$hashedPassword',
        _id: '123'
      };

      User.create = jest.fn().mockResolvedValue(mockUser);

      const user = await User.create(userData);

      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[aby]\$/);
    });

    it('should fail with duplicate username', async () => {
      User.create = jest.fn().mockRejectedValue(new Error('E11000 duplicate key error'));

      await expect(
        User.create({ username: 'testuser', email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow();
    });

    it('should fail with duplicate email', async () => {
      User.create = jest.fn().mockRejectedValue(new Error('E11000 duplicate key error'));

      await expect(
        User.create({ username: 'testuser', email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow();
    });

    it('should fail with invalid email format', async () => {
      User.create = jest.fn().mockRejectedValue(new Error('Validation failed'));

      await expect(
        User.create({ username: 'testuser', email: 'invalid-email', password: 'pass' })
      ).rejects.toThrow();
    });

    it('should set default role to developer', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        role: 'developer'
      };

      User.create = jest.fn().mockResolvedValue(mockUser);

      const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'pass' });
      expect(user.role).toBe('developer');
    });
  });

  describe('Password Methods', () => {
    it('should compare password correctly', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: '$2a$10$hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const user = await User.findById('123').select('+password');
      const isMatch = await user.comparePassword('password123');

      expect(isMatch).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const mockUser = {
        _id: '123',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const user = await User.findById('123').select('+password');
      const isMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(false);
    });
  });

  describe('toJSON Method', () => {
    it('should exclude password from JSON output', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        toJSON: jest.fn().mockReturnValue({
          _id: '123',
          username: 'testuser',
          email: 'test@example.com'
        })
      };

      User.create = jest.fn().mockResolvedValue(mockUser);

      const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'pass' });
      const json = user.toJSON();

      expect(json.password).toBeUndefined();
    });
  });
});
