import { Task } from '@/stores/taskStore';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
      timeout: 10000,
    });

    // Request interceptor para agregar token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, redirigir a login
          localStorage.removeItem('auth-token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: { name: string; email: string; password: string }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // Project endpoints
  async getProjects() {
    const response = await this.api.get('/projects');
    return response.data;
  }

  async createProject(projectData: {
    name: string;
    description?: string;
    memberEmails?: string[];
  }) {
    const response = await this.api.post('/projects', projectData);
    return response.data;
  }

  async getProject(id: string) {
    const response = await this.api.get(`/projects/${id}`);
    return response.data;
  }

  async updateProject(id: string, updates: { name?: string; description?: string }) {
    const response = await this.api.put(`/projects/${id}`, updates);
    return response.data;
  }

  async deleteProject(id: string) {
    const response = await this.api.delete(`/projects/${id}`);
    return response.data;
  }

  // Task endpoints
  async getProjectTasks(projectId: string) {
    const response = await this.api.get(`/projects/${projectId}/tasks`);
    return response.data;
  }

  async createTask(projectId: string, taskData: {
    title: string;
    description?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) {
    const response = await this.api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
  }

  async updateTaskStatus(taskId: string, status: string) {
    const response = await this.api.put(`/tasks/${taskId}`, { status });
    return response.data;
  }

  async updateTask(taskId: string, updates: Partial<Task>) {
    const response = await this.api.put(`/tasks/${taskId}`, updates);
    return response.data;
  }

  async deleteTask(taskId: string) {
    const response = await this.api.delete(`/tasks/${taskId}`);
    return response.data;
  }

  // Dashboard
  async getDashboardStats() {
    const response = await this.api.get('/dashboard/stats');
    return response.data;
  }
}

export const apiService = new ApiService();