import { apiClient } from '../utils/api';
import { DashboardStats, TaskTrends } from '../types';

export const dashboardService = {
  async getDashboardStats(filters?: {
    projectId?: string;
    timeRange?: 'all' | 'today' | 'week' | 'month';
  }): Promise<{ success: boolean; message: string; data: DashboardStats }> {
    return await apiClient.get('/dashboard/stats', filters);
  },

  async getTaskTrends(filters?: {
    period?: 'day' | 'week' | 'month';
    projectId?: string;
  }): Promise<{ success: boolean; message: string; data: TaskTrends }> {
    return await apiClient.get('/dashboard/trends', filters);
  }
};
