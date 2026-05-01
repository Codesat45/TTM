import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              if (data.error === 'AUTH_TOKEN_MISSING' || data.error === 'INVALID_TOKEN') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                toast.error('Session expired. Please login again.');
              } else {
                toast.error(data.message || 'Authentication failed');
              }
              break;
            case 403:
              toast.error(data.message || 'Access denied');
              break;
            case 404:
              toast.error(data.message || 'Resource not found');
              break;
            case 429:
              toast.error('Too many requests. Please try again later.');
              break;
            case 500:
              toast.error('Server error. Please try again later.');
              break;
            default:
              toast.error(data.message || 'An error occurred');
          }
        } else if (error.request) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error('An unexpected error occurred.');
        }
        
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch(url, data);
    return response.data;
  }
}

export const apiClient = new ApiClient();
