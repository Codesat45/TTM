const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'USER_EXISTS'
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'Member'
    });

    await user.save();

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: 'REGISTRATION_ERROR'
    });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: 'LOGIN_ERROR'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving profile',
      error: 'PROFILE_ERROR'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
