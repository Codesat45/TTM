const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const createTask = async (req, res) => {
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

    const { title, description, projectId, assignedTo, dueDate, priority } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isMember = project.members.some(member => member.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project',
        error: 'NOT_PROJECT_MEMBER'
      });
    }

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: 'Assigned user not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const isUserProjectMember = project.members.includes(assignedTo) || 
                               project.createdBy.toString() === assignedTo;
    
    if (!isUserProjectMember) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user must be a member of the project',
        error: 'USER_NOT_PROJECT_MEMBER'
      });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      dueDate,
      priority: priority || 'Medium',
      createdBy: req.user._id
    });

    await task.save();
    await task.populate('projectId', 'name description');
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating task',
      error: 'TASK_CREATION_ERROR'
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { 
      projectId, 
      status, 
      assignedTo, 
      priority, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;

    let query = {};

    if (req.user.role === 'Admin') {
      if (projectId) {
        const project = await Project.findById(projectId);
        if (project) {
          const isCreator = project.createdBy.toString() === req.user._id.toString();
          const isMember = project.members.some(member => member.toString() === req.user._id.toString());
          
          if (!isCreator && !isMember) {
            return res.status(403).json({
              success: false,
              message: 'Access denied. You are not a member of this project',
              error: 'NOT_PROJECT_MEMBER'
            });
          }
        }
      }
    } else {
      if (projectId) {
        const project = await Project.findById(projectId);
        if (project) {
          const isCreator = project.createdBy.toString() === req.user._id.toString();
          const isMember = project.members.some(member => member.toString() === req.user._id.toString());
          
          if (!isCreator && !isMember) {
            return res.status(403).json({
              success: false,
              message: 'Access denied. You are not a member of this project',
              error: 'NOT_PROJECT_MEMBER'
            });
          }
        }
      } else {
        const userProjects = await Project.find({
          $or: [
            { createdBy: req.user._id },
            { members: req.user._id }
          ]
        }).select('_id');
        
        const projectIds = userProjects.map(p => p._id);
        query.projectId = { $in: projectIds };
      }
    }

    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(query)
      .populate('projectId', 'name description')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTasks: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Tasks retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving tasks',
      error: 'TASKS_RETRIEVAL_ERROR'
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate('projectId', 'name description createdBy members')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        error: 'TASK_NOT_FOUND'
      });
    }

    const project = task.projectId;
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isMember = project.members.some(member => member.toString() === req.user._id.toString());
    const isAssignedUser = task.assignedTo._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isMember && !isAssignedUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this task',
        error: 'TASK_ACCESS_DENIED'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Task retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving task',
      error: 'TASK_RETRIEVAL_ERROR'
    });
  }
};

const updateTask = async (req, res) => {
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

    const { id } = req.params;
    const { title, description, status, assignedTo, dueDate, priority } = req.body;

    const task = await Task.findById(id).populate('projectId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        error: 'TASK_NOT_FOUND'
      });
    }

    const project = task.projectId;
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAssignedUser = task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isAssignedUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update tasks assigned to you or that you created',
        error: 'TASK_UPDATE_DENIED'
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;

    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      if (!isAdmin && !isCreator) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only admins or task creators can reassign tasks',
          error: 'TASK_REASSIGN_DENIED'
        });
      }

      const newAssignee = await User.findById(assignedTo);
      if (!newAssignee) {
        return res.status(404).json({
          success: false,
          message: 'New assigned user not found',
          error: 'USER_NOT_FOUND'
        });
      }

      const isUserProjectMember = project.members.includes(assignedTo) || 
                                 project.createdBy.toString() === assignedTo;
      
      if (!isUserProjectMember) {
        return res.status(400).json({
          success: false,
          message: 'New assigned user must be a member of the project',
          error: 'USER_NOT_PROJECT_MEMBER'
        });
      }

      task.assignedTo = assignedTo;
    }

    await task.save();
    await task.populate('projectId', 'name description');
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('Task update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating task',
      error: 'TASK_UPDATE_ERROR'
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('projectId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        error: 'TASK_NOT_FOUND'
      });
    }

    const project = task.projectId;
    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isTaskCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isTaskCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project creators, task creators, or admins can delete tasks',
        error: 'TASK_DELETION_DENIED'
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Task deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting task',
      error: 'TASK_DELETION_ERROR'
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { assignedTo: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('projectId', 'name description')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'My tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTasks: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('My tasks retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving my tasks',
      error: 'MY_TASKS_RETRIEVAL_ERROR'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks
};
