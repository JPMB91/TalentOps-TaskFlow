import { create } from 'zustand';
import axios from 'axios';
import { apiService } from '@/services/api';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (taskId: string, data: UpdateTaskInput) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  clearError: () => void;
}


export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId: string | null;
  reporterId: string;
  dueDate: string | null; 
  createdAt: string;
  updatedAt: string;
  // Relations from Prisma 'include'
  assignee?: UserSummary | null;
  reporter?: UserSummary;
}

/**
 * Data required to create a task. 
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
  assigneeId?: string;
  dueDate?: string; 
}

/**
 * Data allowed for updates.
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await apiService.getProjectTasks(projectId);
      set({ tasks, isLoading: false });
    } catch (error: unknown) {
      set({ 
        error: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to fetch tasks', 
        isLoading: false 
      });
    }
  },

  createTask: async (data: CreateTaskInput) => {
    set({ isLoading: true, error: null });
    try {

      const newTask = await apiService.createTask(data.projectId, data);
      
      set((state) => ({
        // backend returns 'desc' order, so we prepend the new task
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({ 
        error: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to create task', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateTask: async (taskId: string, data: UpdateTaskInput) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await apiService.updateTask(taskId, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({ 
        error: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to update task', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({ 
        error: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to delete task', 
        isLoading: false 
      });
      throw error;
    }
  },

  moveTask: async (taskId: string, newStatus: TaskStatus) => {
    const previousTasks = get().tasks;

    // Optimistic UI Update: change state before the API call finishes
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }));

    try {
      // Specifically triggers the status update endpoint
      await apiService.updateTaskStatus(taskId, newStatus);
    } catch (error: unknown) {
      // Rollback to previous state if the network request fails
      set({ tasks: previousTasks });
      set({ 
        error: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to move task' 
      });
    }
  },

  clearError: () => set({ error: null }),
}));