import { create } from 'zustand';
import axios from 'axios';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
}

interface CreateProjectData {
  name: string;
  description?: string;
  memberEmails?: string[];
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  members: ProjectMember[];
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (projectId: string, data: Partial<CreateProjectData>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  fetchMembers: (projectId: string) => Promise<void>;
  addMember: (projectId: string, email: string) => Promise<void>;
  removeMember: (projectId: string, memberId: string) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  members: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get('/api/projects');
      set({ projects: response.data, isLoading: false });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch projects'
        : 'Failed to fetch projects';

      set({ error: message, isLoading: false });
    }
  },

  fetchProject: async (projectId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      set({ currentProject: response.data, isLoading: false });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch project'
        : 'Failed to fetch project';

      set({ error: message, isLoading: false });
    }
  },

  createProject: async (data: CreateProjectData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post('/api/projects', data);
      set((state) => ({
        projects: [...state.projects, response.data],
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to create project'
        : 'Failed to create project';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateProject: async (projectId: string, data: Partial<CreateProjectData>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`/api/projects/${projectId}`, data);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId ? response.data : p
        ),
        currentProject: state.currentProject?.id === projectId
          ? response.data
          : state.currentProject,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to update project'
        : 'Failed to update project';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (projectId: string) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`/api/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to delete project'
        : 'Failed to delete project';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchMembers: async (projectId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`/api/projects/${projectId}/members`);
      set({ members: response.data, isLoading: false });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to fetch members'
        : 'Failed to fetch members';

      set({ error: message, isLoading: false });
    }
  },

  addMember: async (projectId: string, email: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`/api/projects/${projectId}/members`, { email });
      set((state) => ({
        members: [...state.members, response.data],
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to add member'
        : 'Failed to add member';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  removeMember: async (projectId: string, memberId: string) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`/api/projects/${projectId}/members/${memberId}`);
      set((state) => ({
        members: state.members.filter((m) => m.id !== memberId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to remove member'
        : 'Failed to remove member';

      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));