import { create } from 'zustand'
import type { ValidationResult } from '@/types'
import { validationApi } from '@/services/validation'

// ============================================
// Mock Data
// ============================================

const MOCK_VALIDATION: ValidationResult = {
  id: 'val-1',
  projectId: '1',
  status: 'warnings',
  implementedCount: 2,
  totalCount: 5,
  progressPercentage: 40,
  gaps: [
    {
      requirementId: 'req-2',
      requirementTitle: 'Product Catalog',
      requirementContent: 'Display products with images, descriptions, prices. Support filtering by category and search functionality.',
      reason: 'Search functionality is not yet implemented',
      severity: 'partial',
    },
    {
      requirementId: 'req-3',
      requirementTitle: 'Shopping Cart',
      requirementContent: 'Users can add/remove items from cart. Cart persists across sessions for logged-in users.',
      reason: 'No tasks found for this requirement',
      severity: 'missing',
    },
    {
      requirementId: 'req-4',
      requirementTitle: 'Performance',
      requirementContent: 'Page load time should be under 3 seconds. API response time should be under 500ms for 95th percentile.',
      reason: 'Performance testing tasks not completed',
      severity: 'unclear',
    },
  ],
  recommendations: [
    'Create tasks for the Shopping Cart requirement',
    'Complete the search functionality for Product Catalog',
    'Add performance testing and monitoring tasks',
  ],
  createdAt: new Date().toISOString(),
}

const USE_MOCK = false

// ============================================
// Store Interface
// ============================================

interface ValidationState {
  result: ValidationResult | null
  history: ValidationResult[]
  isLoading: boolean
  isValidating: boolean
  error: string | null
  
  fetchLatest: (projectId: string) => Promise<void>
  fetchHistory: (projectId: string) => Promise<void>
  runValidation: (projectId: string) => Promise<void>
  clearError: () => void
}

// ============================================
// Store Implementation
// ============================================

export const useValidationStore = create<ValidationState>((set) => ({
  result: null,
  history: [],
  isLoading: false,
  isValidating: false,
  error: null,

  fetchLatest: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set({ result: null, isLoading: false }) // No previous validation
        return
      }
      const response = await validationApi.getLatest(projectId)
      set({ result: response.data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchHistory: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set({ history: [], isLoading: false })
        return
      }
      const response = await validationApi.getHistory(projectId)
      set({ history: response.data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  runValidation: async (projectId: string) => {
    set({ isValidating: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 2500)) // Simulate validation time
        set({
          result: { ...MOCK_VALIDATION, id: `val-${Date.now()}`, projectId },
          isValidating: false,
        })
        return
      }
      const response = await validationApi.runValidation(projectId)
      set({ result: response.data, isValidating: false })
    } catch (error) {
      set({ error: (error as Error).message, isValidating: false })
    }
  },

  clearError: () => set({ error: null }),
}))
