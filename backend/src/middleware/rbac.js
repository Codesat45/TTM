const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        error: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

const checkProjectMembership = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const projectId = req.params.id || req.params.projectId || req.body.projectId;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required.',
        error: 'PROJECT_ID_REQUIRED'
      });
    }

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isMember = project.members.some(member => member.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.',
        error: 'NOT_PROJECT_MEMBER'
      });
    }

    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking project membership.',
      error: 'PROJECT_MEMBERSHIP_CHECK_ERROR'
    });
  }
};

const checkTaskAssignment = async (req, res, next) => {
  try {
    const Task = require('../models/Task');
    const taskId = req.params.id || req.params.taskId;
    
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required.',
        error: 'TASK_ID_REQUIRED'
      });
    }

    const task = await Task.findById(taskId).populate('assignedTo');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
        error: 'TASK_NOT_FOUND'
      });
    }

    const isAssignedUser = task.assignedTo._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isAssignedUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update tasks assigned to you.',
        error: 'NOT_TASK_ASSIGNEE'
      });
    }

    req.task = task;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking task assignment.',
      error: 'TASK_ASSIGNMENT_CHECK_ERROR'
    });
  }
};

module.exports = {
  authorize,
  checkProjectMembership,
  checkTaskAssignment
};
