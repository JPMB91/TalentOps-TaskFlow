import { create } from 'zustand';
import axios from 'axios';
import { apiService } from '@/services/api';

interface Project {
  id: string;
  name: string;
  description?: string;
  owner: { id: string; name: string; email: string };
  members: Array<{ id: string; name: string; email: string; avatar?: string }>;
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number };
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  createProject: (data: {
    name: string;
    description?: string;
    memberEmails?: string[];
  }) => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  updateProject: (id: string, updates: {
    name?: string;
    description?: string;
  }) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await apiService.getProjects();
      set({ projects, isLoading: false });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch projects'
        : 'Failed to fetch projects';
      
      set({
        error: message,
        isLoading: false
      });
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await apiService.createProject(projectData);
      set(state => ({
        projects: [newProject, ...state.projects],
        isLoading: false
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to create project'
        : 'Failed to create project';
      
      set({
        error: message,
        isLoading: false
      });
      throw error;
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const project = await apiService.getProject(id);
      set({ currentProject: project, isLoading: false });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch project'
        : 'Failed to fetch project';
      
      set({
        error: message,
        isLoading: false
      });
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await apiService.updateProject(id, updates);
      set(state => ({
        projects: state.projects.map(p =>
          p.id === id ? updatedProject : p
        ),
        currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject,
        isLoading: false
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to update project'
        : 'Failed to update project';
      
      set({
        error: message,
        isLoading: false
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteProject(id);
      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to delete project'
        : 'Failed to delete project';
      
      set({
        error: message,
        isLoading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));