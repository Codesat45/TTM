const express = require('express');
const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const taskRoutes = require('./tasks');
const dashboardRoutes = require('./dashboard');
const userRoutes = require('./users');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
