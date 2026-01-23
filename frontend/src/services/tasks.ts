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
// Backend: /api/tasks/:projectId
// ============================================

export const tasksApi = {
  /**
   * Get all tasks for a project
   * Backend: GET /api/tasks/:projectId
   */
  async getAll(
    projectId: string,
    params?: { status?: TaskStatus; origin?: 'AGENT' | 'USER' }
  ): Promise<ApiResponse<Task[]>> {
    return api.get<ApiResponse<Task[]>>(
      `/tasks/${projectId}`,
      { params: params as Record<string, string> }
    )
  },

  /**
   * Create a new task
   * Backend: POST /api/tasks/:projectId
   */
  async create(projectId: string, data: CreateTaskInput): Promise<ApiResponse<Task>> {
    return api.post<ApiResponse<Task>>(`/tasks/${projectId}`, data)
  },

  /**
   * Update a task
   * Backend: PUT /api/tasks/:projectId/:taskId
   */
  async update(projectId: string, taskId: string, data: UpdateTaskInput): Promise<ApiResponse<Task>> {
    return api.put<ApiResponse<Task>>(`/tasks/${projectId}/${taskId}`, data)
  },

  /**
   * Delete a task
   * Backend: DELETE /api/tasks/:projectId/:taskId
   */
  async delete(projectId: string, taskId: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/tasks/${projectId}/${taskId}`)
  },

  /**
   * Update task status (convenience method)
   */
  async updateStatus(projectId: string, taskId: string, status: TaskStatus): Promise<ApiResponse<Task>> {
    return api.put<ApiResponse<Task>>(`/tasks/${projectId}/${taskId}`, { status })
  },

  /**
   * Take ownership of a task
   * Backend: PUT /api/tasks/:projectId/:taskId/own
   */
  async takeOwnership(projectId: string, taskId: string): Promise<ApiResponse<Task>> {
    return api.put<ApiResponse<Task>>(`/tasks/${projectId}/${taskId}/own`, {})
  },

  /**
   * Generate/recommend tasks from requirements using AI
   * Backend: POST /api/tasks/:projectId/recommend
   */
  async recommend(projectId: string): Promise<ApiResponse<Task[]>> {
    return api.post<ApiResponse<Task[]>>(`/tasks/${projectId}/recommend`)
  },
}
