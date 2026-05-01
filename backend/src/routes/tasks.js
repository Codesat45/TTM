const express = require('express');
const { body, param } = require('express-validator');
const { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask,
  getMyTasks
} = require('../controllers/taskController');
const authenticate = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

const router = express.Router();

const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 })
    .withMessage('Task title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Task description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('projectId')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('assignedTo')
    .isMongoId()
    .withMessage('Invalid assigned user ID'),
  body('dueDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid due date'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High')
];

const updateTaskValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Task title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Completed'])
    .withMessage('Status must be Todo, In Progress, or Completed'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assigned user ID'),
  body('dueDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid due date'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High')
];

const taskIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID')
];

router.use(authenticate);

router.post('/', taskValidation, createTask);
router.get('/', getTasks);
router.get('/my-tasks', getMyTasks);
router.get('/:id', taskIdValidation, getTaskById);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', taskIdValidation, deleteTask);

module.exports = router;
