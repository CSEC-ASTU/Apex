import { create } from 'zustand'
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types'
import { tasksApi } from '@/services/tasks'

// ============================================
// Mock Data
// ============================================

const MOCK_TASKS: Record<string, Task[]> = {
  '1': [
    {
      id: 'task-1',
      projectId: '1',
      requirementId: 'req-1',
      title: 'Implement email/password signup',
      description: 'Create signup form with validation and backend endpoint',
      status: 'completed',
      source: 'agent',
      weight: 3,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task-2',
      projectId: '1',
      requirementId: 'req-1',
      title: 'Implement email/password signin',
      description: 'Create signin form with session management',
      status: 'completed',
      source: 'agent',
      weight: 3,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task-3',
      projectId: '1',
      requirementId: 'req-2',
      title: 'Create product listing page',
      description: 'Display products in a grid with images and prices',
      status: 'in_progress',
      source: 'agent',
      weight: 5,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task-4',
      projectId: '1',
      requirementId: 'req-5',
      title: 'Setup HTTPS and security headers',
      description: 'Configure SSL certificates and security middleware',
      status: 'completed',
      source: 'agent',
      weight: 2,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task-5',
      projectId: '1',
      title: 'Design database schema',
      description: 'Create Prisma schema for all entities',
      status: 'completed',
      source: 'user',
      weight: 4,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task-6',
      projectId: '1',
      title: 'Implement search functionality',
      description: 'Add product search with filters',
      status: 'todo',
      source: 'user',
      weight: 4,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  '2': [
    {
      id: 'task-7',
      projectId: '2',
      requirementId: 'req-6',
      title: 'Create task model and API',
      status: 'completed',
      source: 'agent',
      weight: 5,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

const USE_MOCK = false

// ============================================
// Store Interface
// ============================================

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  isCreating: boolean
  isGenerating: boolean
  error: string | null
  
  fetchTasks: (projectId: string) => Promise<void>
  createTask: (projectId: string, data: CreateTaskInput) => Promise<Task | null>
  updateTask: (projectId: string, taskId: string, data: UpdateTaskInput) => Promise<void>
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>
  deleteTask: (projectId: string, taskId: string) => Promise<void>
  generateTasks: (projectId: string) => Promise<void>
  getProgress: () => { completed: number; total: number; percentage: number }
  clearError: () => void
}

// ============================================
// Store Implementation
// ============================================

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  isCreating: false,
  isGenerating: false,
  error: null,

  fetchTasks: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set({ tasks: MOCK_TASKS[projectId] || [], isLoading: false })
        return
      }
      const response = await tasksApi.getAll(projectId)
      set({ tasks: response.data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createTask: async (projectId: string, data: CreateTaskInput) => {
    set({ isCreating: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        const newTask: Task = {
          id: `task-${Date.now()}`,
          projectId,
          ...data,
          status: 'todo',
          source: 'user',
          weight: data.weight || 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
          isCreating: false,
        }))
        return newTask
      }
      const response = await tasksApi.create(projectId, data)
      set((state) => ({
        tasks: [...state.tasks, response.data],
        isCreating: false,
      }))
      return response.data
    } catch (error) {
      set({ error: (error as Error).message, isCreating: false })
      return null
    }
  },

  updateTask: async (projectId: string, taskId: string, data: UpdateTaskInput) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300))
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          ),
        }))
        return
      }
      await tasksApi.update(projectId, taskId, data)
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
        ),
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateTaskStatus: async (projectId: string, taskId: string, status: TaskStatus) => {
    // Optimistic update
    const previousTasks = get().tasks
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    }))

    try {
      if (!USE_MOCK) {
        await tasksApi.updateStatus(projectId, taskId, status)
      }
    } catch (error) {
      // Revert on error
      set({ tasks: previousTasks, error: (error as Error).message })
    }
  },

  deleteTask: async (projectId: string, taskId: string) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300))
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }))
        return
      }
      await tasksApi.delete(projectId, taskId)
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  generateTasks: async (projectId: string) => {
    set({ isGenerating: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 2000))
        const newTasks: Task[] = [
          {
            id: `task-${Date.now()}`,
            projectId,
            title: 'Implement shopping cart UI',
            description: 'Create cart page with item list and totals',
            status: 'todo',
            source: 'agent',
            weight: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `task-${Date.now() + 1}`,
            projectId,
            title: 'Create checkout flow',
            description: 'Implement multi-step checkout with payment',
            status: 'todo',
            source: 'agent',
            weight: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
        set((state) => ({
          tasks: [...state.tasks, ...newTasks],
          isGenerating: false,
        }))
        return
      }
      const response = await tasksApi.generate(projectId)
      set((state) => ({
        tasks: [...state.tasks, ...response.data],
        isGenerating: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isGenerating: false })
    }
  },

  getProgress: () => {
    const { tasks } = get()
    const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0)
    const completedWeight = tasks
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.weight, 0)
    const percentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0
    return {
      completed: tasks.filter((t) => t.status === 'completed').length,
      total: tasks.length,
      percentage,
    }
  },

  clearError: () => set({ error: null }),
}))
