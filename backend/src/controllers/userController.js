const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const users = await User.find({ role: 'Member' })
      .select('-password')
      .sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const assignedTasks = await Task.countDocuments({ assignedTo: user._id });
        const completedTasks = await Task.countDocuments({ 
          assignedTo: user._id, 
          status: 'Completed' 
        });
        const memberProjects = await Project.countDocuments({ 
          members: user._id 
        });

        return {
          ...user.toObject(),
          stats: {
            assignedTasks,
            completedTasks,
            memberProjects,
            completionRate: assignedTasks > 0 ? Math.round((completedTasks / assignedTasks) * 100) : 0
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Team members retrieved successfully',
      data: usersWithStats
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving team members',
      error: 'GET_USERS_ERROR'
    });
  }
};

const assignProjectsToUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const { userId, projectIds } = req.body;

    if (!userId || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User ID and project IDs are required',
        error: 'INVALID_INPUT'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const projects = await Project.find({ _id: { $in: projectIds } });
    if (projects.length !== projectIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more projects not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    await Project.updateMany(
      { _id: { $in: projectIds } },
      { 
        $addToSet: { members: userId },
        $set: { updatedAt: new Date() }
      }
    );

    const updatedProjects = await Project.find({ _id: { $in: projectIds } })
      .select('_id name members')
      .populate('members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Projects assigned successfully',
      data: updatedProjects
    });
  } catch (error) {
    console.error('Assign projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while assigning projects',
      error: 'ASSIGN_PROJECTS_ERROR'
    });
  }
};

const assignTasksToUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const { userId, taskIds } = req.body;

    if (!userId || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User ID and task IDs are required',
        error: 'INVALID_INPUT'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const tasks = await Task.find({ _id: { $in: taskIds } });
    if (tasks.length !== taskIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more tasks not found',
        error: 'TASK_NOT_FOUND'
      });
    }

    await Task.updateMany(
      { _id: { $in: taskIds } },
      { 
        assignedTo: userId,
        updatedAt: new Date()
      }
    );

    const updatedTasks = await Task.find({ _id: { $in: taskIds } })
      .select('_id title description projectId assignedTo status priority dueDate')
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Tasks assigned successfully',
      data: updatedTasks
    });
  } catch (error) {
    console.error('Assign tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while assigning tasks',
      error: 'ASSIGN_TASKS_ERROR'
    });
  }
};

const removeUserFromProject = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const { userId, projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    await Project.updateOne(
      { _id: projectId },
      { 
        $pull: { members: userId },
        $set: { updatedAt: new Date() }
      }
    );

    res.status(200).json({
      success: true,
      message: 'User removed from project successfully'
    });
  } catch (error) {
    console.error('Remove user from project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while removing user from project',
      error: 'REMOVE_USER_PROJECT_ERROR'
    });
  }
};

const getUserAssignments = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const assignedProjects = await Project.find({ members: userId })
      .select('_id name description createdBy members')
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    const assignedTasks = await Task.find({ assignedTo: userId })
      .select('_id title description projectId status priority dueDate createdAt')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User assignments retrieved successfully',
      data: {
        user,
        projects: assignedProjects,
        tasks: assignedTasks
      }
    });
  } catch (error) {
    console.error('Get user assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving user assignments',
      error: 'GET_USER_ASSIGNMENTS_ERROR'
    });
  }
};

module.exports = {
  getAllUsers,
  assignProjectsToUser,
  assignTasksToUser,
  removeUserFromProject,
  getUserAssignments
};
