import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

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
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`/api/projects/${projectId}/tasks`);
      set({ tasks: response.data, isLoading: false });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch tasks'
        : 'Failed to fetch tasks';

      set({ error: message, isLoading: false });
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post('/api/tasks', data);
      set((state) => ({
        tasks: [...state.tasks, response.data],
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to create task'
        : 'Failed to create task';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (taskId: string, data: Partial<Task>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`/api/tasks/${taskId}`, data);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? response.data : task
        ),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to update task'
        : 'Failed to update task';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`/api/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to delete task'
        : 'Failed to delete task';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  moveTask: async (taskId: string, newStatus: TaskStatus) => {
    const previousTasks = get().tasks;

    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    }));

    try {
      await axios.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
    } catch (error: unknown) {
      // Revert on error
      set({ tasks: previousTasks });

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to move task'
        : 'Failed to move task';

      set({ error: message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));