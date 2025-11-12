import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/index.js';

// Generate Access Token (short-lived)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn || '1h' }
  );
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

// Legacy support - deprecated
export const generateToken = generateAccessToken;
