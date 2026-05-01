const express = require('express');
const { body, param } = require('express-validator');
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const authenticate = require('../middleware/auth');
const { authorize, checkProjectMembership } = require('../middleware/rbac');

const router = express.Router();

const projectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 100 })
    .withMessage('Project name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array')
    .custom((members) => {
      if (members && members.length > 0) {
        return members.every(member => typeof member === 'string' && member.match(/^[0-9a-fA-F]{24}$/));
      }
      return true;
    })
    .withMessage('Each member must be a valid user ID')
];

const updateProjectValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Project name cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project description cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['Active', 'Completed', 'On Hold'])
    .withMessage('Status must be Active, Completed, or On Hold'),
  body('members')
    .optional()
    .isArray()
    .withMessage('Members must be an array')
    .custom((members) => {
      if (members && members.length > 0) {
        return members.every(member => typeof member === 'string' && member.match(/^[0-9a-fA-F]{24}$/));
      }
      return true;
    })
    .withMessage('Each member must be a valid user ID')
];

const addMemberValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
];

const removeMemberValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID')
];

router.use(authenticate);

router.post('/', projectValidation, createProject);
router.get('/', getProjects);
router.get('/:id', 
  param('id').isMongoId().withMessage('Invalid project ID'),
  getProjectById
);
router.put('/:id', updateProjectValidation, updateProject);
router.delete('/:id', 
  param('id').isMongoId().withMessage('Invalid project ID'),
  deleteProject
);
router.post('/:id/members', addMemberValidation, addMember);
router.delete('/:id/members/:userId', removeMemberValidation, removeMember);

module.exports = router;
