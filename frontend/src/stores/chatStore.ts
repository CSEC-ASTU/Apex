import { create } from 'zustand'
import type { ChatMessage, SendMessageInput } from '@/types'
import { chatApi } from '@/services/chat'

// ============================================
// Mock Data
// ============================================

const MOCK_RESPONSES: Record<string, string> = {
  default: "Based on your project documents, I can help answer questions about your requirements. What would you like to know?",
  auth: "According to the requirements document, user authentication should support email/password signup and signin, as well as OAuth providers like Google and GitHub. The security requirements also specify that passwords must be hashed using bcrypt.",
  product: "The product catalog requirements specify that you need to display products with images, descriptions, and prices. It should also support filtering by category and search functionality.",
  cart: "The shopping cart feature should allow users to add and remove items. For logged-in users, the cart should persist across sessions.",
  performance: "The non-functional requirements state that page load time should be under 3 seconds, and API response time should be under 500ms for the 95th percentile.",
}

const USE_MOCK = false

// ============================================
// Store Interface
// ============================================

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isSending: boolean
  error: string | null
  
  fetchHistory: (projectId: string) => Promise<void>
  sendMessage: (projectId: string, content: string) => Promise<void>
  clearHistory: (projectId: string) => Promise<void>
  clearError: () => void
}

// ============================================
// Helper: Get mock response based on keywords
// ============================================

function getMockResponse(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('auth') || q.includes('login') || q.includes('signup') || q.includes('password')) {
    return MOCK_RESPONSES.auth
  }
  if (q.includes('product') || q.includes('catalog') || q.includes('listing')) {
    return MOCK_RESPONSES.product
  }
  if (q.includes('cart') || q.includes('shopping')) {
    return MOCK_RESPONSES.cart
  }
  if (q.includes('performance') || q.includes('speed') || q.includes('load time')) {
    return MOCK_RESPONSES.performance
  }
  return MOCK_RESPONSES.default
}

// ============================================
// Store Implementation
// ============================================

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,

  fetchHistory: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300))
        set({ messages: [], isLoading: false })
        return
      }
      const response = await chatApi.getHistory(projectId)
      set({ messages: response.data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  sendMessage: async (projectId: string, content: string) => {
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      messages: [...state.messages, userMessage],
      isSending: true,
      error: null,
    }))

    try {
      if (USE_MOCK) {
        // Simulate AI thinking
        await new Promise((r) => setTimeout(r, 1500))
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          projectId,
          role: 'assistant',
          content: getMockResponse(content),
          sources: [
            {
              documentId: 'doc-1',
              documentName: 'requirements.pdf',
              chunk: 'Relevant section from the requirements document...',
              relevanceScore: 0.92,
            },
          ],
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isSending: false,
        }))
        return
      }

      const response = await chatApi.sendMessage(projectId, { content })
      set((state) => ({
        messages: [...state.messages, response.data],
        isSending: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isSending: false })
    }
  },

  clearHistory: async (projectId: string) => {
    try {
      if (USE_MOCK) {
        set({ messages: [] })
        return
      }
      await chatApi.clearHistory(projectId)
      set({ messages: [] })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  clearError: () => set({ error: null }),
}))
