import { create } from 'zustand'
import type { Project, CreateProjectInput, UpdateProjectInput, DashboardStats } from '@/types'
import { projectsApi } from '@/services/projects'
import { documentsApi } from '@/services/documents'
import { tasksApi } from '@/services/tasks'

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

export const useProjectStore = create<ProjectState>((set) => ({
  // Initial state
  projects: [],
  currentProject: null,
  stats: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,

  // Fetch all projects with enriched stats (documentCount, taskCount, progress)
  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500))
        set({ projects: MOCK_PROJECTS, isLoading: false })
        return
      }
      
      const response = await projectsApi.getAll()
      const projects = Array.isArray(response) ? response : (response.data || [])
      
      if (projects.length === 0) {
        set({ projects: [], isLoading: false })
        return
      }
      
      // Fetch documents and tasks for each project to compute progress
      const enrichedProjects = await Promise.all(
        projects.map(async (project) => {
          try {
            const [docsResponse, tasksResponse] = await Promise.all([
              documentsApi.getAll(project.id),
              tasksApi.getAll(project.id),
            ])
            
            const docs = Array.isArray(docsResponse) 
              ? docsResponse 
              : (docsResponse.data || [])
            const tasks = Array.isArray(tasksResponse) 
              ? tasksResponse 
              : (tasksResponse.data || [])
            
            const completedTasks = tasks.filter((t) => t.status === 'DONE').length
            const progress = tasks.length > 0 
              ? Math.round((completedTasks / tasks.length) * 100) 
              : 0
            
            return {
              ...project,
              documentCount: docs.length,
              taskCount: tasks.length,
              progress,
            }
          } catch (error) {
            console.warn(`Failed to fetch stats for project ${project.id}:`, error)
            return {
              ...project,
              documentCount: 0,
              taskCount: 0,
              progress: 0,
            }
          }
        })
      )
      
      set({ projects: enrichedProjects, isLoading: false })
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

  // Fetch dashboard stats from real API data
  fetchStats: async () => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set({ stats: MOCK_STATS, isLoading: false })
        return
      }
      
      console.log('📊 Fetching dashboard stats...')
      
      // Fetch all projects
      const projectsResponse = await projectsApi.getAll()
      console.log('📊 Raw projects response:', projectsResponse)
      
      // Handle both { data: [...] } and direct array responses
      const projects = Array.isArray(projectsResponse) 
        ? projectsResponse 
        : (projectsResponse.data || [])
      console.log('📊 Projects count:', projects.length)
      
      if (projects.length === 0) {
        console.log('📊 No projects found, returning empty stats')
        set({ 
          stats: {
            totalProjects: 0,
            totalDocuments: 0,
            totalTasks: 0,
            completedTasks: 0,
            averageProgress: 0,
            recentProjects: [],
          }, 
          projects: [], 
          isLoading: false 
        })
        return
      }
      
      // Fetch documents and tasks for each project in parallel
      const projectStats = await Promise.all(
        projects.map(async (project) => {
          try {
            console.log(`📊 Fetching data for project ${project.id}...`)
            const [docsResponse, tasksResponse] = await Promise.all([
              documentsApi.getAll(project.id),
              tasksApi.getAll(project.id),
            ])
            
            console.log(`📊 Project ${project.id} docs response:`, docsResponse)
            console.log(`📊 Project ${project.id} tasks response:`, tasksResponse)
            
            // Handle both { data: [...] } and direct array responses
            const docs = Array.isArray(docsResponse) 
              ? docsResponse 
              : (docsResponse.data || [])
            const tasks = Array.isArray(tasksResponse) 
              ? tasksResponse 
              : (tasksResponse.data || [])
            
            console.log(`📊 Project ${project.id}: ${docs.length} docs, ${tasks.length} tasks`)
            
            const completedTasks = tasks.filter((t) => t.status === 'DONE').length
            
            return {
              projectId: project.id,
              documentCount: docs.length,
              taskCount: tasks.length,
              completedTasks,
              progress: tasks.length > 0 
                ? Math.round((completedTasks / tasks.length) * 100) 
                : 0,
            }
          } catch (error) {
            console.error(`📊 Failed to fetch stats for project ${project.id}:`, error)
            return {
              projectId: project.id,
              documentCount: 0,
              taskCount: 0,
              completedTasks: 0,
              progress: 0,
            }
          }
        })
      )
      
      console.log('📊 Project stats:', projectStats)
      
      // Aggregate stats
      const totalDocuments = projectStats.reduce((acc, p) => acc + p.documentCount, 0)
      const totalTasks = projectStats.reduce((acc, p) => acc + p.taskCount, 0)
      const completedTasks = projectStats.reduce((acc, p) => acc + p.completedTasks, 0)
      const totalProgress = projectStats.reduce((acc, p) => acc + p.progress, 0)
      const averageProgress = projects.length > 0 ? totalProgress / projects.length : 0
      
      // Enrich projects with stats
      const enrichedProjects = projects.map((project) => {
        const pStats = projectStats.find((ps) => ps.projectId === project.id)
        return {
          ...project,
          documentCount: pStats?.documentCount || 0,
          taskCount: pStats?.taskCount || 0,
          progress: pStats?.progress || 0,
        }
      })
      
      // Sort by updatedAt for recent projects
      const recentProjects = [...enrichedProjects]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
      
      const stats: DashboardStats = {
        totalProjects: projects.length,
        totalDocuments,
        totalTasks,
        completedTasks,
        averageProgress,
        recentProjects,
      }
      
      console.log('📊 Dashboard stats:', stats)
      set({ stats, projects: enrichedProjects, isLoading: false })
    } catch (error) {
      console.error('📊 Error fetching stats:', error)
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
