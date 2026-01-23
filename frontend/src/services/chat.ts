import { config } from '@/config'
import type {
  ChatMessage,
  SendMessageInput,
  ApiResponse,
} from '@/types'

// ============================================
// Chat/Q&A API Service
// Matches backend routes: /api/assistant/:projectId/...
// ============================================

export const chatApi = {
  /**
   * Get chat history for a project
   * Note: Backend doesn't have this endpoint yet - returns empty array
   */
  async getHistory(projectId: string): Promise<ApiResponse<ChatMessage[]>> {
    // TODO: Implement when backend adds chat history endpoint
    return { success: true, data: [] }
  },

  /**
   * Send a message and get AI response (RAG-based)
   * Backend: POST /api/assistant/:projectId/ask-function
   * Returns Server-Sent Events (streaming)
   */
  async sendMessage(projectId: string, data: SendMessageInput): Promise<ApiResponse<ChatMessage>> {
    const response = await fetch(
      `${config.apiBaseUrl}/assistant/${projectId}/ask-function`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: data.message }),
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // Handle SSE response - return the response for streaming
    const text = await response.text()
    return { 
      success: true, 
      data: { 
        id: Date.now().toString(),
        role: 'assistant',
        content: text,
        projectId,
        createdAt: new Date().toISOString(),
      } as ChatMessage 
    }
  },

  /**
   * Send a message with SSE streaming support
   * Backend: POST /api/assistant/:projectId/ask-function
   */
  async sendMessageStream(
    projectId: string, 
    query: string,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/assistant/${projectId}/ask-function`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
          },
          body: JSON.stringify({ query }),
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        onChunk(chunk)
      }
      
      onComplete?.()
    } catch (error) {
      onError?.(error as Error)
    }
  },

  /**
   * Clear chat history for a project
   * Note: Backend doesn't have this endpoint yet
   */
  async clearHistory(projectId: string): Promise<ApiResponse<void>> {
    // TODO: Implement when backend adds clear history endpoint
    return { success: true, data: undefined }
  },
}
