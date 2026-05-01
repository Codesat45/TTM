import { apiClient } from '../utils/api';
import { Task, CreateTaskData, UpdateTaskData, PaginatedResponse, FilterOptions } from '../types';

export const taskService = {
  async createTask(taskData: CreateTaskData): Promise<{ success: boolean; message: string; data: { task: Task } }> {
    return await apiClient.post('/tasks', taskData);
  },

  async getTasks(filters?: FilterOptions): Promise<PaginatedResponse<Task>> {
    return await apiClient.get('/tasks', filters);
  },

  async getTaskById(id: string): Promise<{ success: boolean; message: string; data: { task: Task } }> {
    return await apiClient.get(`/tasks/${id}`);
  },

  async updateTask(id: string, taskData: UpdateTaskData): Promise<{ success: boolean; message: string; data: { task: Task } }> {
    return await apiClient.put(`/tasks/${id}`, taskData);
  },

  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    return await apiClient.delete(`/tasks/${id}`);
  },

  async getMyTasks(filters?: {
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Task>> {
    return await apiClient.get('/tasks/my-tasks', filters);
  }
};
