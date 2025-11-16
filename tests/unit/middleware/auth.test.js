import { jest } from '@jest/globals';

// Create mocks before importing the middleware
const mockJwt = {
  verify: jest.fn()
};

const mockUser = {
  findById: jest.fn()
};

const mockConfig = {
  jwt: {
    secret: 'test-secret'
  }
};

// Mock modules
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: mockJwt
}));

jest.unstable_mockModule('../../../src/models/index.js', () => ({
  User: mockUser
}));

jest.unstable_mockModule('../../../src/config/index.js', () => ({
  default: mockConfig
}));

// Now import the middleware after mocking
const { authenticate, authorize, optionalAuth } = await import('../../../src/middleware/auth.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const mockUserData = {
        _id: '123',
        username: 'testuser',
        isActive: true
      };

      req.headers.authorization = 'Bearer valid-token';
      mockJwt.verify.mockReturnValue({ userId: '123' });
      mockUser.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserData)
      });

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockUserData);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      mockJwt.verify.mockImplementation(() => {
        const error = new Error('JsonWebTokenError');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject inactive user', async () => {
      const mockUserData = {
        _id: '123',
        isActive: false
      };

      req.headers.authorization = 'Bearer valid-token';
      mockJwt.verify.mockReturnValue({ userId: '123' });
      mockUser.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserData)
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should allow user with correct role', () => {
      req.user = { role: 'admin' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject user with incorrect role', () => {
      req.user = { role: 'viewer' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request without user', () => {
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should attach user if valid token provided', async () => {
      const mockUserData = {
        _id: '123',
        isActive: true
      };

      req.headers.authorization = 'Bearer valid-token';
      mockJwt.verify.mockReturnValue({ userId: '123' });
      mockUser.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUserData)
      });

      await optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockUserData);
    });

    it('should continue without user if no token', async () => {
      await optionalAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeNull();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
