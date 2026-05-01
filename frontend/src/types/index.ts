export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: User;
  members: User[];
  status: 'Active' | 'Completed' | 'On Hold';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  projectId: Project;
  assignedTo: User;
  status: 'Todo' | 'In Progress' | 'Completed';
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    pagination: PaginationInfo;
  };
}

export interface DashboardStats {
  overview: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    overdueTasks: number;
    dueTodayTasks: number;
    dueThisWeekTasks: number;
    completionRate: number;
  };
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  priorityDistribution: Array<{
    priority: string;
    count: number;
    percentage: number;
  }>;
  projectStats: Array<{
    projectId: string;
    projectName: string;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  }>;
  recentTasks: Task[];
  upcomingDeadlines: Task[];
}

export interface TaskTrends {
  period: string;
  trends: Array<{
    _id: string;
    created: number;
    completed: number;
  }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'Member';
}

export interface CreateProjectData {
  name: string;
  description: string;
  members?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: 'Active' | 'Completed' | 'On Hold';
  members?: string[];
}

export interface CreateTaskData {
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  dueDate: string;
  priority?: 'Low' | 'Medium' | 'High';
  status?: 'Todo' | 'In Progress' | 'Completed';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'Todo' | 'In Progress' | 'Completed';
  assignedTo?: string;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
}

export interface FilterOptions {
  status?: string;
  priority?: string;
  assignedTo?: string;
  projectId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
