import { User } from '../../models/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { generateToken } from '../../utils/jwt.js';

class UserService {
  // Register new user
  async register(userData) {
    const { username, email, password, firstName, lastName, department, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new AppError('Email already registered', 400);
      }
      if (existingUser.username === username) {
        throw new AppError('Username already taken', 400);
      }
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      department,
      role: role || 'developer',
    });

    // Generate token
    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  }

  // Login user
  async login(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is inactive', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return {
      user: user.toJSON(),
      token,
    };
  }

  // Get user profile
  async getProfile(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId, updates) {
    const { firstName, lastName, department } = updates;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(department && { department }),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Get all users (admin only)
  async getAllUsers(query = {}) {
    const { page = 1, limit = 10, role, isActive, search } = query;

    const filter = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Delete user (admin only)
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Toggle user active status (admin only)
  async toggleUserStatus(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    return user;
  }
}

export default new UserService();
