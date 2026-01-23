import { api } from './api'
import type {
  ChatMessage,
  SendMessageInput,
  ApiResponse,
} from '@/types'

// ============================================
// Chat/Q&A API Service
// ============================================

export const chatApi = {
  /**
   * Get chat history for a project
   */
  async getHistory(projectId: string): Promise<ApiResponse<ChatMessage[]>> {
    return api.get<ApiResponse<ChatMessage[]>>(`/projects/${projectId}/chat`)
  },

  /**
   * Send a message and get AI response (RAG-based)
   */
  async sendMessage(projectId: string, data: SendMessageInput): Promise<ApiResponse<ChatMessage>> {
    return api.post<ApiResponse<ChatMessage>>(`/projects/${projectId}/chat`, data)
  },

  /**
   * Clear chat history for a project
   */
  async clearHistory(projectId: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/projects/${projectId}/chat`)
  },
}
