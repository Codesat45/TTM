import { apiClient } from '../utils/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>('/auth/register', credentials);
  },

  async getProfile(): Promise<{ success: boolean; message: string; data: { user: User } }> {
    return await apiClient.get('/auth/profile');
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }
};
