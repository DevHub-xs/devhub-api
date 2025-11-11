import User from '../../models/User.js';
import RefreshToken from '../../models/RefreshToken.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const { username, email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      throw new Error(`${field} already registered`);
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshTokenString) {
    if (!refreshTokenString) {
      throw new Error('Refresh token is required');
    }

    // Find refresh token
    const refreshToken = await RefreshToken.findOne({
      token: refreshTokenString,
    }).populate('user');

    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Check if expired
    if (refreshToken.expiresAt < new Date()) {
      await refreshToken.deleteOne();
      throw new Error('Refresh token expired');
    }

    // Check if user is active
    if (!refreshToken.user.isActive) {
      throw new Error('Account is inactive');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(refreshToken.user._id);

    // Delete old refresh token
    await refreshToken.deleteOne();

    return {
      user: refreshToken.user.toJSON(),
      tokens,
    };
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(userId) {
    // Delete all refresh tokens for user
    await RefreshToken.deleteMany({ user: userId });
    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    const allowedUpdates = ['firstName', 'lastName', 'username', 'avatar', 'department'];
    const updateData = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        updateData[key] = updates[key];
      }
    }

    // Check if username is being updated and already exists
    if (updateData.username) {
      const existingUser = await User.findOne({
        username: updateData.username,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new Error('Username already taken');
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Invalidate all refresh tokens
    await RefreshToken.deleteMany({ user: userId });

    return { message: 'Password changed successfully' };
  }

  /**
   * Forgot password
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If email exists, reset instructions will be sent' };
    }

    // Generate password reset token
    const resetToken = generateRefreshToken();
    
    // In production, store this token with expiry and send email
    // For now, just return it (for testing)
    console.log('Password reset token:', resetToken);
    console.log('For user:', user.email);

    // TODO: Store reset token with expiry (30 minutes)
    // TODO: Send email with reset link

    return { 
      message: 'Password reset instructions sent to email',
      // Remove token from response in production
      resetToken: resetToken 
    };
  }

  /**
   * Reset password
   */
  async resetPassword(token, newPassword) {
    // TODO: Implement password reset token validation
    // For now, this is a placeholder
    
    throw new Error('Password reset functionality coming soon');
  }

  /**
   * Generate access and refresh tokens
   */
  async generateTokens(userId) {
    // Generate access token (JWT)
    const accessToken = generateAccessToken(userId);

    // Generate refresh token (random string)
    const refreshTokenString = generateRefreshToken();

    // Calculate expiry (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await RefreshToken.create({
      token: refreshTokenString,
      user: userId,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
      expiresIn: 3600, // 1 hour in seconds
    };
  }
}

export default new AuthService();
