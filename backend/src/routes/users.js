const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllUsers,
  assignProjectsToUser,
  assignTasksToUser,
  removeUserFromProject,
  getUserAssignments
} = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all team members (Admin only)
router.get('/team', authenticateToken, requireAdmin, getAllUsers);

// Assign projects to user (Admin only)
router.post('/:userId/assign-projects', 
  authenticateToken, 
  requireAdmin,
  [
    body('projectIds')
      .isArray({ min: 1 })
      .withMessage('Project IDs must be a non-empty array'),
    body('projectIds.*')
      .isMongoId()
      .withMessage('Each project ID must be a valid MongoDB ID')
  ],
  assignProjectsToUser
);

// Assign tasks to user (Admin only)
router.post('/:userId/assign-tasks', 
  authenticateToken, 
  requireAdmin,
  [
    body('taskIds')
      .isArray({ min: 1 })
      .withMessage('Task IDs must be a non-empty array'),
    body('taskIds.*')
      .isMongoId()
      .withMessage('Each task ID must be a valid MongoDB ID')
  ],
  assignTasksToUser
);

// Remove user from project (Admin only)
router.delete('/:userId/projects/:projectId', 
  authenticateToken, 
  requireAdmin,
  [
    param('userId').isMongoId().withMessage('Invalid user ID'),
    param('projectId').isMongoId().withMessage('Invalid project ID')
  ],
  removeUserFromProject
);

// Get user assignments (Admin only)
router.get('/:userId/assignments', 
  authenticateToken, 
  requireAdmin,
  [
    param('userId').isMongoId().withMessage('Invalid user ID')
  ],
  getUserAssignments
);

module.exports = router;
