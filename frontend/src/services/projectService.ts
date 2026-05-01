import { apiClient } from '../utils/api';
import { Project, CreateProjectData, UpdateProjectData, PaginatedResponse } from '../types';

export const projectService = {
  async createProject(projectData: CreateProjectData): Promise<{ success: boolean; message: string; data: { project: Project } }> {
    return await apiClient.post('/projects', projectData);
  },

  async getProjects(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Project>> {
    return await apiClient.get('/projects', filters);
  },

  async getProjectById(id: string): Promise<{ success: boolean; message: string; data: { project: Project } }> {
    return await apiClient.get(`/projects/${id}`);
  },

  async updateProject(id: string, projectData: UpdateProjectData): Promise<{ success: boolean; message: string; data: { project: Project } }> {
    return await apiClient.put(`/projects/${id}`, projectData);
  },

  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete(`/projects/${id}`);
  },

  async addMember(projectId: string, userId: string): Promise<{ success: boolean; message: string; data: { project: Project } }> {
    return await apiClient.post(`/projects/${projectId}/members`, { userId });
  },

  async removeMember(projectId: string, userId: string): Promise<{ success: boolean; message: string; data: { project: Project } }> {
    return await apiClient.delete(`/projects/${projectId}/members/${userId}`);
  }
};
