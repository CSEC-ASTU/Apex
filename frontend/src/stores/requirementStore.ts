import { create } from 'zustand'
import type { Requirement, RequirementType } from '@/types'
import { requirementsApi } from '@/services/requirements'

// USE_MOCK = false means we use real backend
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
        set({
          requirements: [],
          filteredRequirements: [],
          isLoading: false,
        })
        return
      }
      console.log('📋 Fetching requirements for project:', projectId)
      const response = await requirementsApi.getAll(projectId)
      console.log('📋 Requirements response:', response.data)
      set({
        requirements: response.data || [],
        filteredRequirements: response.data || [],
        isLoading: false,
      })
    } catch (error) {
      console.error('📋 Error fetching requirements:', error)
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
