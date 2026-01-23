import { api } from './api'
import type {
  Task,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  ApiResponse,
} from '@/types'

// ============================================
// Tasks API Service
// ============================================

export const tasksApi = {
  /**
   * Get all tasks for a project
   */
  async getAll(
    projectId: string,
    params?: { status?: TaskStatus; source?: 'agent' | 'user' }
  ): Promise<ApiResponse<Task[]>> {
    return api.get<ApiResponse<Task[]>>(
      `/projects/${projectId}/tasks`,
      { params: params as Record<string, string> }
    )
  },

  /**
   * Get a single task by ID
   */
  async getById(projectId: string, taskId: string): Promise<ApiResponse<Task>> {
    return api.get<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`)
  },

  /**
   * Create a new task manually
   */
  async create(projectId: string, data: CreateTaskInput): Promise<ApiResponse<Task>> {
    return api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, data)
  },

  /**
   * Update a task
   */
  async update(projectId: string, taskId: string, data: UpdateTaskInput): Promise<ApiResponse<Task>> {
    return api.patch<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`, data)
  },

  /**
   * Delete a task
   */
  async delete(projectId: string, taskId: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/projects/${projectId}/tasks/${taskId}`)
  },

  /**
   * Update task status (convenience method)
   */
  async updateStatus(projectId: string, taskId: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    return api.patch<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`, { status })
  },

  /**
   * Generate tasks from requirements using AI
   */
  async generate(projectId: string): Promise<ApiResponse<Task[]>> {
    return api.post<ApiResponse<Task[]>>(`/projects/${projectId}/tasks/generate`)
  },

  /**
   * Get tasks linked to a specific requirement
   */
  async getByRequirement(projectId: string, requirementId: string): Promise<ApiResponse<Task[]>> {
    return api.get<ApiResponse<Task[]>>(
      `/projects/${projectId}/requirements/${requirementId}/tasks`
    )
  },
}
