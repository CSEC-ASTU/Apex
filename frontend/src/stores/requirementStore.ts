import { create } from 'zustand'
import type { Requirement, RequirementType } from '@/types'
import { requirementsApi } from '@/services/requirements'

// ============================================
// Mock Data
// ============================================

const MOCK_REQUIREMENTS: Record<string, Requirement[]> = {
  '1': [
    {
      id: 'req-1',
      projectId: '1',
      documentId: 'doc-1',
      type: 'functional',
      title: 'User Authentication',
      content: 'Users must be able to sign up and sign in using email/password. Support for OAuth providers (Google, GitHub) should be included.',
      priority: 'high',
      status: 'implemented',
      linkedTaskIds: ['task-1', 'task-2'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-2',
      projectId: '1',
      documentId: 'doc-1',
      type: 'functional',
      title: 'Product Catalog',
      content: 'Display products with images, descriptions, prices. Support filtering by category and search functionality.',
      priority: 'high',
      status: 'pending',
      linkedTaskIds: ['task-3'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-3',
      projectId: '1',
      documentId: 'doc-1',
      type: 'functional',
      title: 'Shopping Cart',
      content: 'Users can add/remove items from cart. Cart persists across sessions for logged-in users.',
      priority: 'high',
      status: 'pending',
      linkedTaskIds: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-4',
      projectId: '1',
      documentId: 'doc-2',
      type: 'non-functional',
      title: 'Performance',
      content: 'Page load time should be under 3 seconds. API response time should be under 500ms for 95th percentile.',
      priority: 'medium',
      status: 'pending',
      linkedTaskIds: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-5',
      projectId: '1',
      documentId: 'doc-2',
      type: 'non-functional',
      title: 'Security',
      content: 'All data must be encrypted in transit (HTTPS). Passwords must be hashed using bcrypt. Implement rate limiting.',
      priority: 'high',
      status: 'implemented',
      linkedTaskIds: ['task-4'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  '2': [
    {
      id: 'req-6',
      projectId: '2',
      documentId: 'doc-4',
      type: 'functional',
      title: 'Task CRUD',
      content: 'Users can create, read, update, and delete tasks. Tasks have title, description, status, and due date.',
      priority: 'high',
      status: 'implemented',
      linkedTaskIds: [],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

const USE_MOCK = false

// ============================================
// Store Interface
// ============================================

interface RequirementState {
  requirements: Requirement[]
  filteredRequirements: Requirement[]
  filter: RequirementType | 'all'
  isLoading: boolean
  error: string | null
  
  fetchRequirements: (projectId: string) => Promise<void>
  setFilter: (filter: RequirementType | 'all') => void
  clearError: () => void
}

// ============================================
// Store Implementation
// ============================================

export const useRequirementStore = create<RequirementState>((set, get) => ({
  requirements: [],
  filteredRequirements: [],
  filter: 'all',
  isLoading: false,
  error: null,

  fetchRequirements: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        const reqs = MOCK_REQUIREMENTS[projectId] || []
        set({
          requirements: reqs,
          filteredRequirements: reqs,
          isLoading: false,
        })
        return
      }
      const response = await requirementsApi.getAll(projectId)
      set({
        requirements: response.data,
        filteredRequirements: response.data,
        isLoading: false,
      })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  setFilter: (filter: RequirementType | 'all') => {
    const { requirements } = get()
    const filtered =
      filter === 'all'
        ? requirements
        : requirements.filter((r) => r.type === filter)
    set({ filter, filteredRequirements: filtered })
  },

  clearError: () => set({ error: null }),
}))
