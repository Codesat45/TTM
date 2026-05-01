import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { DashboardStats } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  SparklesIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardStats({ timeRange });
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToTasks = () => {
    navigate('/app/tasks');
  };

  const handleCreateProject = () => {
    navigate('/app/projects?create=1');
  };

  const handleNavigateToProject = (projectId: string) => {
    navigate(`/app/projects?project=${projectId}`);
  };

  const handleNavigateToTask = (taskId: string) => {
    navigate(`/app/tasks?task=${taskId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <ExclamationTriangleIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Unable to load dashboard</h3>
          <p className="text-gray-400 mb-6">{error || 'No data available'}</p>
          <button
            onClick={fetchStats}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="bg-netflix-black text-white flex flex-col">
      {/* Hero Header */}
      <div className="relative h-20 bg-gradient-to-b from-transparent via-netflix-black/50 to-netflix-black flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20 animate-gradient" />
        <div className="relative z-10 px-4 md:px-6 py-3">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent animate-fade-in">
                Task Dashboard
              </h1>
              <p className="text-sm md:text-base text-gray-300 animate-slide-up">
                Real-time insights into your team's performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === 'Admin' && (
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Project
                </button>
              )}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-1.5 bg-netflix-dark/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-2 md:px-4 py-3 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div 
            onClick={handleNavigateToTasks}
            className="group relative bg-gradient-to-br from-red-600/20 to-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/20 p-4 md:p-5 hover:border-red-500/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-netflix cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  {stats.overview.totalTasks}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Total Tasks</h3>
              <p className="text-gray-400 text-sm">Click to view all tasks</p>
            </div>
          </div>

          <div 
            onClick={() => handleNavigateToTasks()}
            className="group relative bg-gradient-to-br from-green-600/20 to-green-500/10 backdrop-blur-sm rounded-2xl border border-green-500/20 p-4 md:p-5 hover:border-green-500/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-netflix cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  {stats.overview.completedTasks}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Completed</h3>
              <p className="text-gray-400 text-sm">{stats.overview.completionRate}% completion rate</p>
            </div>
          </div>

          <div 
            onClick={() => handleNavigateToTasks()}
            className="group relative bg-gradient-to-br from-yellow-600/20 to-yellow-500/10 backdrop-blur-sm rounded-2xl border border-yellow-500/20 p-4 md:p-5 hover:border-yellow-500/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-netflix cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-yellow-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  {stats.overview.inProgressTasks}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">In Progress</h3>
              <p className="text-gray-400 text-sm">Currently being worked on</p>
            </div>
          </div>

          <div 
            onClick={() => handleNavigateToTasks()}
            className="group relative bg-gradient-to-br from-red-600/20 to-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/20 p-4 md:p-5 hover:border-red-500/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-netflix cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  {stats.overview.overdueTasks}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Overdue</h3>
              <p className="text-gray-400 text-sm">Requires immediate attention</p>
            </div>
          </div>
        </div>

        {/* Status & Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 mb-6">
          {/* Status Distribution */}
          <div className="group relative bg-netflix-dark/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 md:p-5 hover:border-red-500/40 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Task Status</h3>
              <SparklesIcon className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              {stats.statusDistribution.map((status) => (
                <div key={status.status} className="group/item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        status.status === 'Completed' ? 'bg-green-500' :
                        status.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-500'
                      } group-hover/item:scale-125 transition-transform duration-300`} />
                      <span className="text-white font-medium">{status.status}</span>
                    </div>
                    <span className="text-gray-300 font-semibold">{status.count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        status.status === 'Completed' ? 'bg-green-500' :
                        status.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">{status.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="group relative bg-netflix-dark/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 md:p-5 hover:border-red-500/40 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Priority Levels</h3>
              <FireIcon className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              {stats.priorityDistribution.map((priority) => (
                <div key={priority.priority} className="group/item">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        priority.priority === 'High' ? 'bg-red-500' :
                        priority.priority === 'Medium' ? 'bg-yellow-500' : 'bg-gray-500'
                      } group-hover/item:scale-125 transition-transform duration-300`} />
                      <span className="text-white font-medium">{priority.priority}</span>
                    </div>
                    <span className="text-gray-300 font-semibold">{priority.count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        priority.priority === 'High' ? 'bg-red-500' :
                        priority.priority === 'Medium' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${priority.percentage}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-1">{priority.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="group relative bg-netflix-dark/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-12 hover:border-red-500/40 transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Project Performance</h3>
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
            {stats.projectStats && stats.projectStats.length > 0 ? (
              stats.projectStats.map((project) => (
                <div 
                  key={project.projectId} 
                  onClick={() => handleNavigateToProject(project.projectId)}
                  className="group/card bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-600 p-4 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                >
                  <h4 className="text-lg font-semibold text-white mb-3 group-hover/card:text-red-400 transition-colors duration-300">
                    {project.projectName}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Tasks</span>
                      <span className="text-white font-medium">{project.totalTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Completed</span>
                      <span className="text-green-400 font-medium">{project.completedTasks}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${project.completionRate}%` }}
                      />
                    </div>
                    <div className="text-center text-sm text-gray-400">
                      {project.completionRate}% Complete
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No projects available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tasks & Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {/* Recent Tasks */}
          <div className="group relative bg-netflix-dark/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 md:p-5 hover:border-red-500/40 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              <ClockIcon className="h-6 w-6 text-blue-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              {stats.recentTasks && stats.recentTasks.length > 0 ? (
                stats.recentTasks.map((task) => (
                  <div 
                    key={task._id} 
                    onClick={() => handleNavigateToTask(task._id)}
                    className="group/item bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover/item:text-red-400 transition-colors duration-300">
                          {task.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{task.projectId?.name || 'Unknown Project'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          task.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="group relative bg-netflix-dark/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 md:p-5 hover:border-red-500/40 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Upcoming Deadlines</h3>
              <CalendarIcon className="h-6 w-6 text-orange-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              {stats.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                stats.upcomingDeadlines.map((task) => (
                  <div 
                    key={task._id} 
                    onClick={() => handleNavigateToTask(task._id)}
                    className="group/item bg-gray-800/30 rounded-lg p-4 border border-gray-700 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover/item:text-red-400 transition-colors duration-300">
                          {task.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{task.projectId?.name || 'Unknown Project'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
