import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { userService, User } from '../services/userService';
import { Project, CreateProjectData, UpdateProjectData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  FolderIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    members: []
  });
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      if (response.success) {
        const responseData = response.data as any;
        const projectItems = responseData?.items || responseData?.projects || [];
        setProjects(Array.isArray(projectItems) ? projectItems : []);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      if (user?.role === 'Admin') {
        const response = await userService.getTeamMembers();
        if (response.success) {
          const usersData = response.data;
          setUsers(Array.isArray(usersData) ? usersData : []);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setUsers([]); // Set empty array as fallback
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user?.role === 'Admin' && searchParams.get('create') === '1') {
      setShowCreateModal(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, user?.role]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await projectService.createProject(formData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({ name: '', description: '', members: [] });
        fetchProjects();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      const updateData: UpdateProjectData = {
        name: formData.name,
        description: formData.description,
        members: formData.members
      };

      const response = await projectService.updateProject(selectedProject._id, updateData);
      if (response.success) {
        setShowEditModal(false);
        setSelectedProject(null);
        setFormData({ name: '', description: '', members: [] });
        fetchProjects();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await projectService.deleteProject(projectId);
      if (response.success) {
        fetchProjects();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    }
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      members: Array.isArray(project.members) ? project.members.map(member => member._id) : []
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Completed': return 'badge-primary';
      case 'On Hold': return 'badge-warning';
      default: return 'badge-gray';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage your projects and team members</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Project
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-danger-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-danger-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const members = Array.isArray(project.members) ? project.members : [];
          const createdByName = project.createdBy?.name || 'Unknown';

          return (
          <div key={project._id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FolderIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <span className={`badge ${getStatusColor(project.status)} mt-1`}>
                    {project.status}
                  </span>
                </div>
              </div>
              {user?.role === 'Admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="text-gray-400 hover:text-danger-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4">{project.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span>{members.length} members</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                <span>Created by {createdByName}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex -space-x-2">
                {members.slice(0, 4).map((member, index) => (
                  <div
                    key={member._id}
                    className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                    style={{ zIndex: 4 - index }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {members.length > 4 && (
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                    +{members.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">
            {user?.role === 'Admin' 
              ? 'Create your first project to get started'
              : 'You haven\'t been added to any projects yet'
            }
          </p>
          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Project
            </button>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Enter project description"
                  />
                </div>
                {user?.role === 'Admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Members
                    </label>
                    <select
                      multiple
                      value={formData.members}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        members: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                      className="input"
                      size={4}
                    >
                      {Array.isArray(users) && users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple members
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Project</h3>
            <form onSubmit={handleUpdateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Enter project description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
