import { api } from './api'
import type {
  Requirement,
  RequirementType,
  ApiResponse,
} from '@/types'

// ============================================
// Requirements API Service
// ============================================

export const requirementsApi = {
  /**
   * Get all requirements for a project
   */
  async getAll(
    projectId: string,
    params?: { type?: RequirementType }
  ): Promise<ApiResponse<Requirement[]>> {
    return api.get<ApiResponse<Requirement[]>>(
      `/projects/${projectId}/requirements`,
      { params: params as Record<string, string> }
    )
  },

  /**
   * Get a single requirement by ID
   */
  async getById(projectId: string, requirementId: string): Promise<ApiResponse<Requirement>> {
    return api.get<ApiResponse<Requirement>>(
      `/projects/${projectId}/requirements/${requirementId}`
    )
  },

  /**
   * Get requirements linked to a specific document
   */
  async getByDocument(projectId: string, documentId: string): Promise<ApiResponse<Requirement[]>> {
    return api.get<ApiResponse<Requirement[]>>(
      `/projects/${projectId}/documents/${documentId}/requirements`
    )
  },

  /**
   * Trigger re-extraction of requirements from documents
   */
  async reextract(projectId: string): Promise<ApiResponse<{ message: string }>> {
    return api.post<ApiResponse<{ message: string }>>(
      `/projects/${projectId}/requirements/reextract`
    )
  },
}
