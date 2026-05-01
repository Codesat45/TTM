const express = require('express');
const { query } = require('express-validator');
const { getDashboardStats, getTaskTrends } = require('../controllers/dashboardController');
const authenticate = require('../middleware/auth');

const router = express.Router();

const dashboardStatsValidation = [
  query('projectId')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID'),
  query('timeRange')
    .optional()
    .isIn(['all', 'today', 'week', 'month'])
    .withMessage('Time range must be all, today, week, or month')
];

const taskTrendsValidation = [
  query('period')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Period must be day, week, or month'),
  query('projectId')
    .optional()
    .isMongoId()
    .withMessage('Invalid project ID')
];

router.use(authenticate);

router.get('/stats', dashboardStatsValidation, getDashboardStats);
router.get('/trends', taskTrendsValidation, getTaskTrends);

module.exports = router;
