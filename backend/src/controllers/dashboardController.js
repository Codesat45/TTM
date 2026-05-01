const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const { projectId, timeRange = 'all' } = req.query;

    let dateFilter = {};
    if (timeRange !== 'all') {
      const now = new Date();
      switch (timeRange) {
        case 'today':
          dateFilter = {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lt: new Date(now.setHours(23, 59, 59, 999))
          };
          break;
        case 'week':
          dateFilter = {
            $gte: new Date(now.setDate(now.getDate() - now.getDay())),
            $lt: new Date(now.setDate(now.getDate() - now.getDay() + 6))
          };
          break;
        case 'month':
          dateFilter = {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            $lt: new Date(now.getFullYear(), now.getMonth() + 1, 0)
          };
          break;
      }
    }

    let projectFilter = {};
    if (projectId) {
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

      projectFilter.projectId = projectId;
    } else {
      if (req.user.role !== 'Admin') {
        const userProjects = await Project.find({
          $or: [
            { createdBy: req.user._id },
            { members: req.user._id }
          ]
        }).select('_id');
        
        const projectIds = userProjects.map(p => p._id);
        projectFilter.projectId = { $in: projectIds };
      }
    }

    if (Object.keys(dateFilter).length > 0) {
      projectFilter.createdAt = dateFilter;
    }

    const totalTasks = await Task.countDocuments(projectFilter);
    const completedTasks = await Task.countDocuments({ ...projectFilter, status: 'Completed' });
    const inProgressTasks = await Task.countDocuments({ ...projectFilter, status: 'In Progress' });
    const todoTasks = await Task.countDocuments({ ...projectFilter, status: 'Todo' });

    const overdueTasksQuery = {
      ...projectFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' }
    };
    const overdueTasks = await Task.countDocuments(overdueTasksQuery);

    const dueTodayTasksQuery = {
      ...projectFilter,
      dueDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      },
      status: { $ne: 'Completed' }
    };
    const dueTodayTasks = await Task.countDocuments(dueTodayTasksQuery);

    const dueThisWeekTasksQuery = {
      ...projectFilter,
      dueDate: {
        $gte: new Date(),
        $lt: new Date(new Date().setDate(new Date().getDate() + 7))
      },
      status: { $ne: 'Completed' }
    };
    const dueThisWeekTasks = await Task.countDocuments(dueThisWeekTasksQuery);

    let projectStats = [];
    if (!projectId) {
      const projects = await Project.find(
        req.user.role === 'Admin' ? {} : {
          $or: [
            { createdBy: req.user._id },
            { members: req.user._id }
          ]
        }
      ).select('_id name');

      projectStats = await Promise.all(
        projects.map(async (project) => {
          const projectTasks = await Task.countDocuments({ projectId: project._id });
          const projectCompleted = await Task.countDocuments({ 
            projectId: project._id, 
            status: 'Completed' 
          });
          
          return {
            projectId: project._id,
            projectName: project.name,
            totalTasks: projectTasks,
            completedTasks: projectCompleted,
            completionRate: projectTasks > 0 ? Math.round((projectCompleted / projectTasks) * 100) : 0
          };
        })
      );
    }

    const taskStatusDistribution = [
      { status: 'Todo', count: todoTasks, percentage: totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0 },
      { status: 'In Progress', count: inProgressTasks, percentage: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0 },
      { status: 'Completed', count: completedTasks, percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0 }
    ];

    const priorityDistribution = await Promise.all([
      Task.countDocuments({ ...projectFilter, priority: 'Low' }),
      Task.countDocuments({ ...projectFilter, priority: 'Medium' }),
      Task.countDocuments({ ...projectFilter, priority: 'High' })
    ]);

    const priorityStats = [
      { priority: 'Low', count: priorityDistribution[0], percentage: totalTasks > 0 ? Math.round((priorityDistribution[0] / totalTasks) * 100) : 0 },
      { priority: 'Medium', count: priorityDistribution[1], percentage: totalTasks > 0 ? Math.round((priorityDistribution[1] / totalTasks) * 100) : 0 },
      { priority: 'High', count: priorityDistribution[2], percentage: totalTasks > 0 ? Math.round((priorityDistribution[2] / totalTasks) * 100) : 0 }
    ];

    const recentTasks = await Task.find(projectFilter)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingDeadlines = await Task.find({
      ...projectFilter,
      dueDate: { $gte: new Date(), $lte: new Date(new Date().setDate(new Date().getDate() + 7)) },
      status: { $ne: 'Completed' }
    })
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        overview: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          overdueTasks,
          dueTodayTasks,
          dueThisWeekTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        },
        statusDistribution: taskStatusDistribution,
        priorityDistribution: priorityStats,
        projectStats,
        recentTasks,
        upcomingDeadlines
      }
    });
  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving dashboard statistics',
      error: 'DASHBOARD_STATS_ERROR'
    });
  }
};

const getTaskTrends = async (req, res) => {
  try {
    const { period = 'week', projectId } = req.query;

    let projectFilter = {};
    if (projectId) {
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

      projectFilter.projectId = projectId;
    } else {
      if (req.user.role !== 'Admin') {
        const userProjects = await Project.find({
          $or: [
            { createdBy: req.user._id },
            { members: req.user._id }
          ]
        }).select('_id');
        
        const projectIds = userProjects.map(p => p._id);
        projectFilter.projectId = { $in: projectIds };
      }
    }

    let groupBy, dateFormat;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 7));
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateFormat = "%Y-%m-%d";
        break;
      case 'week':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        groupBy = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } };
        dateFormat = "%Y-W%U";
        break;
      case 'month':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        dateFormat = "%Y-%m";
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        groupBy = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } };
        dateFormat = "%Y-W%U";
    }

    const taskTrends = await Task.aggregate([
      {
        $match: {
          ...projectFilter,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          created: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Task trends retrieved successfully',
      data: {
        period,
        trends: taskTrends
      }
    });
  } catch (error) {
    console.error('Task trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving task trends',
      error: 'TASK_TRENDS_ERROR'
    });
  }
};

module.exports = {
  getDashboardStats,
  getTaskTrends
};
