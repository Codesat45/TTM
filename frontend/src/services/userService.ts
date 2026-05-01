import { apiClient } from '../utils/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  stats?: {
    assignedTasks: number;
    completedTasks: number;
    memberProjects: number;
    completionRate: number;
  };
}

export interface UserAssignment {
  user: User;
  projects: Array<{
    _id: string;
    name: string;
    description: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    members: Array<{
      _id: string;
      name: string;
      email: string;
    }>;
  }>;
  tasks: Array<{
    _id: string;
    title: string;
    description: string;
    projectId: {
      _id: string;
      name: string;
    };
    status: string;
    priority: string;
    dueDate: string;
    createdAt: string;
  }>;
}

export const userService = {
  async getTeamMembers(): Promise<{ success: boolean; message: string; data: User[] }> {
    return await apiClient.get('/users/team');
  },

  async assignProjectsToUser(userId: string, projectIds: string[]): Promise<{ success: boolean; message: string; data: any }> {
    return await apiClient.post(`/users/${userId}/assign-projects`, { projectIds });
  },

  async assignTasksToUser(userId: string, taskIds: string[]): Promise<{ success: boolean; message: string; data: any }> {
    return await apiClient.post(`/users/${userId}/assign-tasks`, { taskIds });
  },

  async removeUserFromProject(userId: string, projectId: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete(`/users/${userId}/projects/${projectId}`);
  },

  async getUserAssignments(userId: string): Promise<{ success: boolean; message: string; data: UserAssignment }> {
    return await apiClient.get(`/users/${userId}/assignments`);
  }
};
