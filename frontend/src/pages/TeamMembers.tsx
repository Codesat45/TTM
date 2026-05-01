import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, User } from '../services/userService';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import {
  UserGroupIcon,
  FolderIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const TeamMembers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<User[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignType, setAssignType] = useState<'projects' | 'tasks'>('projects');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const normalizeList = (data: any, key: string) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.[key])) return data[key];
    return [];
  };

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/app/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, projectsRes, tasksRes] = await Promise.all([
        userService.getTeamMembers(),
        projectService.getProjects(),
        taskService.getTasks()
      ]);

      if (membersRes.success) {
        setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
      }
      if (projectsRes.success) {
        setProjects(normalizeList(projectsRes.data, 'projects'));
      }
      if (tasksRes.success) {
        setTasks(normalizeList(tasksRes.data, 'tasks'));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignProjects = async () => {
    if (!selectedMember || selectedProjects.length === 0) return;

    try {
      const response = await userService.assignProjectsToUser(selectedMember._id, selectedProjects);
      if (response.success) {
        toast.success('Projects assigned successfully');
        setShowAssignModal(false);
        setSelectedProjects([]);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error('Failed to assign projects');
    }
  };

  const handleAssignTasks = async () => {
    if (!selectedMember || selectedTasks.length === 0) return;

    try {
      const response = await userService.assignTasksToUser(selectedMember._id, selectedTasks);
      if (response.success) {
        toast.success('Tasks assigned successfully');
        setShowAssignModal(false);
        setSelectedTasks([]);
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error('Failed to assign tasks');
    }
  };

  const handleRemoveFromProject = async (userId: string, projectId: string) => {
    try {
      const response = await userService.removeUserFromProject(userId, projectId);
      if (response.success) {
        toast.success('User removed from project');
        fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error('Failed to remove user from project');
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-netflix-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-netflix-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <XMarkIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Unable to load team members</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={fetchData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-netflix-black text-white flex flex-col">
      {/* Header */}
      <div className="relative h-20 bg-gradient-to-b from-transparent via-netflix-black/50 to-netflix-black flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20 animate-gradient" />
        <div className="relative z-10 px-4 md:px-6 py-3">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                Team Members
              </h1>
              <p className="text-sm md:text-base text-gray-300">Manage your team members and their assignments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 md:px-4 py-3 flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:border-red-500/40 transition-all duration-500 hover:transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setAssignType('projects');
                      setSelectedProjects([]);
                      setSelectedTasks([]);
                      setShowAssignModal(true);
                    }}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
                    title="Assign Projects"
                  >
                    <FolderIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setAssignType('tasks');
                      setSelectedProjects([]);
                      setSelectedTasks([]);
                      setShowAssignModal(true);
                    }}
                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-200"
                    title="Assign Tasks"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{member.email}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Assigned Tasks</span>
                  <span className="text-white font-medium">{member.stats?.assignedTasks || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-green-400 font-medium">{member.stats?.completedTasks || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Projects</span>
                  <span className="text-blue-400 font-medium">{member.stats?.memberProjects || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${member.stats?.completionRate || 0}%` }}
                  />
                </div>
                <div className="text-center text-xs text-gray-400">
                  {member.stats?.completionRate || 0}% Completion Rate
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-netflix-dark rounded-2xl border border-gray-700 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                Assign {assignType === 'projects' ? 'Projects' : 'Tasks'} to {selectedMember.name}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(assignType === 'projects' ? projects : tasks).map((item) => (
                <label
                  key={item._id}
                  className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-red-500/50 transition-all duration-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      assignType === 'projects'
                        ? selectedProjects.includes(item._id)
                        : selectedTasks.includes(item._id)
                    }
                    onChange={(e) => {
                      if (assignType === 'projects') {
                        setSelectedProjects(prev =>
                          e.target.checked
                            ? [...prev, item._id]
                            : prev.filter(id => id !== item._id)
                        );
                      } else {
                        setSelectedTasks(prev =>
                          e.target.checked
                            ? [...prev, item._id]
                            : prev.filter(id => id !== item._id)
                        );
                      }
                    }}
                    className="mr-3 h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.title || item.name}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </label>
              ))}
              {(assignType === 'projects' ? projects : tasks).length === 0 && (
                <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 text-center text-gray-400">
                  No {assignType === 'projects' ? 'projects' : 'tasks'} available to assign.
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={assignType === 'projects' ? handleAssignProjects : handleAssignTasks}
                className="btn btn-primary"
                disabled={
                  assignType === 'projects'
                    ? selectedProjects.length === 0
                    : selectedTasks.length === 0
                }
              >
                Assign {assignType === 'projects' ? 'Projects' : 'Tasks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
