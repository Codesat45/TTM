const Project = require('../models/Project');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const createProject = async (req, res) => {
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

    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      createdBy: req.user._id,
      members: members || []
    });

    await project.save();
    await project.populate('createdBy', 'name email');
    await project.populate('members', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating project',
      error: 'PROJECT_CREATION_ERROR'
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.user.role === 'Admin') {
      query = {
        $or: [
          { createdBy: req.user._id },
          { members: req.user._id }
        ]
      };
    } else {
      query = {
        $or: [
          { createdBy: req.user._id },
          { members: req.user._id }
        ]
      };
    }

    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: {
        projects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProjects: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Projects retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving projects',
      error: 'PROJECTS_RETRIEVAL_ERROR'
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    const isCreator = project.createdBy._id.toString() === req.user._id.toString();
    const isMember = project.members.some(member => member._id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isMember && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project',
        error: 'NOT_PROJECT_MEMBER'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Project retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving project',
      error: 'PROJECT_RETRIEVAL_ERROR'
    });
  }
};

const updateProject = async (req, res) => {
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
    const { name, description, status, members } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project creators can update projects',
        error: 'NOT_PROJECT_CREATOR'
      });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    if (members) project.members = members;

    await project.save();
    await project.populate('createdBy', 'name email');
    await project.populate('members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Project update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating project',
      error: 'PROJECT_UPDATE_ERROR'
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project creators can delete projects',
        error: 'NOT_PROJECT_CREATOR'
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Project deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting project',
      error: 'PROJECT_DELETION_ERROR'
    });
  }
};

const addMember = async (req, res) => {
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
    const { userId } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project creators can add members',
        error: 'NOT_PROJECT_CREATOR'
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

    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project',
        error: 'USER_ALREADY_MEMBER'
      });
    }

    project.members.push(userId);
    await project.save();
    await project.populate('members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding member',
      error: 'ADD_MEMBER_ERROR'
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project creators can remove members',
        error: 'NOT_PROJECT_CREATOR'
      });
    }

    project.members = project.members.filter(member => member.toString() !== userId);
    await project.save();
    await project.populate('members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while removing member',
      error: 'REMOVE_MEMBER_ERROR'
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
