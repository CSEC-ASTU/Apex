import { api } from './api'
import type {
  ValidationResult,
  ApiResponse,
} from '@/types'

// ============================================
// Validation API Service
// ============================================

export const validationApi = {
  /**
   * Run validation check on a project
   * Compares implemented tasks against extracted requirements
   */
  async runValidation(projectId: string): Promise<ApiResponse<ValidationResult>> {
    return api.post<ApiResponse<ValidationResult>>(`/projects/${projectId}/validate`)
  },

  /**
   * Get the latest validation result for a project
   */
  async getLatest(projectId: string): Promise<ApiResponse<ValidationResult | null>> {
    return api.get<ApiResponse<ValidationResult | null>>(`/projects/${projectId}/validation`)
  },

  /**
   * Get validation history for a project
   */
  async getHistory(projectId: string): Promise<ApiResponse<ValidationResult[]>> {
    return api.get<ApiResponse<ValidationResult[]>>(`/projects/${projectId}/validation/history`)
  },
}
