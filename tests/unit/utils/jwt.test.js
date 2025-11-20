import jwt from 'jsonwebtoken';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyToken 
} from '../../../src/utils/jwt.js';
import config from '../../../src/config/index.js';

describe('JWT Utils', () => {
  describe('generateAccessToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateAccessToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include userId in token payload', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateAccessToken(userId);
      const decoded = jwt.verify(token, config.jwt.secret);

      expect(decoded.userId).toBe(userId);
    });

    it('should set expiration time', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateAccessToken(userId);
      const decoded = jwt.verify(token, config.jwt.secret);

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    it('should generate different tokens for different users', () => {
      const userId1 = '507f1f77bcf86cd799439011';
      const userId2 = '507f1f77bcf86cd799439012';
      
      const token1 = generateAccessToken(userId1);
      const token2 = generateAccessToken(userId2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a random hex string', () => {
      const token = generateRefreshToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate 80-character token (40 bytes in hex)', () => {
      const token = generateRefreshToken();
      expect(token.length).toBe(80);
    });

    it('should generate unique tokens', () => {
      const token1 = generateRefreshToken();
      const token2 = generateRefreshToken();
      const token3 = generateRefreshToken();

      expect(token1).not.toBe(token2);
      expect(token2).not.toBe(token3);
      expect(token1).not.toBe(token3);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateAccessToken(userId);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(userId);
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = jwt.sign(
        { userId },
        config.jwt.secret,
        { expiresIn: '0s' }
      );

      const decoded = verifyToken(token);
      expect(decoded).toBeNull();
    });

    it('should return null for token with wrong secret', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = jwt.sign(
        { userId },
        'wrong-secret',
        { expiresIn: '1h' }
      );

      const decoded = verifyToken(token);
      expect(decoded).toBeNull();
    });

    it('should verify token with correct payload structure', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateAccessToken(userId);
      const decoded = verifyToken(token);

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });
  });

  describe('Token Expiration', () => {
    it('should create token that expires in configured time', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateAccessToken(userId);
      const decoded = jwt.verify(token, config.jwt.secret);

      const expiresInSeconds = decoded.exp - decoded.iat;
      expect(expiresInSeconds).toBeGreaterThan(0);
      expect(expiresInSeconds).toBeLessThanOrEqual(86400); // 24 hours max
    });
  });
});
