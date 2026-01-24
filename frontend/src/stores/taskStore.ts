import { create } from 'zustand'
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '@/types'
import { tasksApi } from '@/services/tasks'

// USE_MOCK = false means we use real backend
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
        set({ tasks: [], isLoading: false })
        return
      }
      console.log('📝 Fetching tasks for project:', projectId)
      const response = await tasksApi.getAll(projectId)
      console.log('📝 Tasks response:', response.data)
      set({ tasks: response.data || [], isLoading: false })
    } catch (error) {
      console.error('📝 Error fetching tasks:', error)
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
          status: 'TODO',
          origin: 'USER',
          weight: data.weight || 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
          isCreating: false,
        }))
        return newTask
      }
      console.log('📝 Creating task:', data)
      const response = await tasksApi.create(projectId, data)
      console.log('📝 Task created:', response.data)
      set((state) => ({
        tasks: [...state.tasks, response.data],
        isCreating: false,
      }))
      return response.data
    } catch (error) {
      console.error('📝 Error creating task:', error)
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
        set({ isGenerating: false })
        return
      }
      console.log('📝 Generating/recommending tasks for project:', projectId)
      const response = await tasksApi.recommend(projectId)
      console.log('📝 Generated tasks:', response.data)
      set((state) => ({
        tasks: [...state.tasks, ...(response.data || [])],
        isGenerating: false,
      }))
    } catch (error) {
      console.error('📝 Error generating tasks:', error)
      set({ error: (error as Error).message, isGenerating: false })
    }
  },

  getProgress: () => {
    const { tasks } = get()
    const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0)
    const completedWeight = tasks
      .filter((t) => t.status === 'DONE')
      .reduce((sum, t) => sum + t.weight, 0)
    const percentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0
    return {
      completed: tasks.filter((t) => t.status === 'DONE').length,
      total: tasks.length,
      percentage,
    }
  },

  clearError: () => set({ error: null }),
}))
