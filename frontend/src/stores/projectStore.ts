import { create } from 'zustand'
import type { Project, CreateProjectInput, UpdateProjectInput, DashboardStats } from '@/types'
import { projectsApi } from '@/services/projects'

// ============================================
// Mock Data (for development without backend)
// ============================================

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration',
    status: 'ACTIVE',
    userId: 'user-1',
    progress: 45,
    documentCount: 3,
    taskCount: 12,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates',
    status: 'ACTIVE',
    userId: 'user-1',
    progress: 72,
    documentCount: 2,
    taskCount: 8,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const MOCK_STATS: DashboardStats = {
  totalProjects: 2,
  totalDocuments: 5,
  totalTasks: 20,
  completedTasks: 11,
  averageProgress: 58.5,
  recentProjects: MOCK_PROJECTS,
}

// Set to true to use mock data (for development)
const USE_MOCK = false

// ============================================
// Store Interface
// ============================================

interface ProjectState {
  // Data
  projects: Project[]
  currentProject: Project | null
  stats: DashboardStats | null
  
  // Loading states
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  
  // Error
  error: string | null
  
  // Actions
  fetchProjects: () => Promise<void>
  fetchProject: (id: string) => Promise<void>
  fetchStats: () => Promise<void>
  createProject: (data: CreateProjectInput) => Promise<Project | null>
  updateProject: (id: string, data: UpdateProjectInput) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project | null) => void
  clearError: () => void
}

// ============================================
// Store Implementation
// ============================================

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  currentProject: null,
  stats: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // Fetch all projects
  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500)) // Simulate delay
        set({ projects: MOCK_PROJECTS, isLoading: false })
        return
      }
      const response = await projectsApi.getAll()
      set({ projects: response.data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  // Fetch single project
  fetchProject: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300))
        const project = MOCK_PROJECTS.find((p) => p.id === id) || null
        set({ currentProject: project, isLoading: false })
        return
      }
      const response = await projectsApi.getById(id)
      set({ currentProject: response.data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  // Fetch dashboard stats
  // Note: Backend doesn't have /dashboard/stats endpoint yet, so we compute from projects
  fetchStats: async () => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set({ stats: MOCK_STATS, isLoading: false })
        return
      }
      // Fetch projects and compute stats from them
      const response = await projectsApi.getAll()
      const projects = response.data || []
      const stats: DashboardStats = {
        totalProjects: projects.length,
        totalDocuments: projects.reduce((acc, p) => acc + (p.documentCount || 0), 0),
        totalTasks: projects.reduce((acc, p) => acc + (p.taskCount || 0), 0),
        completedTasks: 0, // Will be computed when tasks endpoint is available
        averageProgress: projects.length > 0 
          ? projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length 
          : 0,
        recentProjects: projects.slice(0, 5),
      }
      set({ stats, projects, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  // Create project
  createProject: async (data: CreateProjectInput) => {
    set({ isCreating: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500))
        const newProject: Project = {
          id: Date.now().toString(),
          ...data,
          status: 'ACTIVE',
          userId: 'user-1',
          progress: 0,
          documentCount: 0,
          taskCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          projects: [newProject, ...state.projects],
          isCreating: false,
        }))
        return newProject
      }
      const response = await projectsApi.create(data)
      set((state) => ({
        projects: [response.data, ...state.projects],
        isCreating: false,
      }))
      return response.data
    } catch (error) {
      set({ error: (error as Error).message, isCreating: false })
      return null
    }
  },

  // Update project
  updateProject: async (id: string, data: UpdateProjectInput) => {
    set({ isUpdating: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...data, updatedAt: new Date().toISOString() }
              : state.currentProject,
          isUpdating: false,
        }))
        return
      }
      const response = await projectsApi.update(id, data)
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? response.data : p)),
        currentProject: state.currentProject?.id === id ? response.data : state.currentProject,
        isUpdating: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isUpdating: false })
    }
  },

  // Delete project
  deleteProject: async (id: string) => {
    set({ isDeleting: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
          isDeleting: false,
        }))
        return
      }
      await projectsApi.delete(id)
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isDeleting: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isDeleting: false })
    }
  },

  // Set current project
  setCurrentProject: (project) => {
    set({ currentProject: project })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },
}))
