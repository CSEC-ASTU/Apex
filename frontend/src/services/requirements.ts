import { api } from './api'
import type {
  Requirement,
  RequirementType,
  ApiResponse,
} from '@/types'

// ============================================
// Requirements API Service
// Backend: /api/project/:projectId/requirements/functional
// Backend: /api/project/:projectId/requirements/non-functional
// ============================================

export const requirementsApi = {
  /**
   * Get all requirements for a project (both functional and non-functional)
   */
  async getAll(
    projectId: string,
    params?: { type?: RequirementType }
  ): Promise<ApiResponse<Requirement[]>> {
    // If type is specified, fetch only that type
    if (params?.type === 'functional') {
      return this.getFunctional(projectId)
    }
    if (params?.type === 'non-functional') {
      return this.getNonFunctional(projectId)
    }
    
    // Fetch both types and combine
    const [functional, nonFunctional] = await Promise.all([
      this.getFunctional(projectId),
      this.getNonFunctional(projectId),
    ])
    
    // Add type field to each requirement
    const allRequirements = [
      ...(functional.data || []).map(r => ({ ...r, type: 'functional' as RequirementType })),
      ...(nonFunctional.data || []).map(r => ({ ...r, type: 'non-functional' as RequirementType })),
    ]
    
    return { success: true, data: allRequirements }
  },

  /**
   * Get functional requirements
   * Backend: GET /api/project/:projectId/requirements/functional
   */
  async getFunctional(projectId: string): Promise<ApiResponse<Requirement[]>> {
    return api.get<ApiResponse<Requirement[]>>(
      `/project/${projectId}/requirements/functional`
    )
  },

  /**
   * Get non-functional requirements
   * Backend: GET /api/project/:projectId/requirements/non-functional
   */
  async getNonFunctional(projectId: string): Promise<ApiResponse<Requirement[]>> {
    return api.get<ApiResponse<Requirement[]>>(
      `/project/${projectId}/requirements/non-functional`
    )
  },

  /**
   * Get a single requirement by ID
   */
  async getById(projectId: string, requirementId: string): Promise<ApiResponse<Requirement>> {
    return api.get<ApiResponse<Requirement>>(
      `/project/${projectId}/requirements/${requirementId}`
    )
  },
}
