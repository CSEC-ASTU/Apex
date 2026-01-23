import { api } from './api'
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
} from '@/types'

// ============================================
// Project API Service
// ============================================

export const projectsApi = {
  /**
   * Get all projects for the current user
   */
  async getAll(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Project>> {
    return api.get<PaginatedResponse<Project>>('/projects', { params: params as Record<string, string> })
  },

  /**
   * Get a single project by ID
   */
  async getById(projectId: string): Promise<ApiResponse<Project>> {
    return api.get<ApiResponse<Project>>(`/projects/${projectId}`)
  },

  /**
   * Create a new project
   */
  async create(data: CreateProjectInput): Promise<ApiResponse<Project>> {
    return api.post<ApiResponse<Project>>('/projects', data)
  },

  /**
   * Update a project
   */
  async update(projectId: string, data: UpdateProjectInput): Promise<ApiResponse<Project>> {
    return api.patch<ApiResponse<Project>>(`/projects/${projectId}`, data)
  },

  /**
   * Delete a project
   */
  async delete(projectId: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/projects/${projectId}`)
  },

  /**
   * Get dashboard stats
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
  },
}
