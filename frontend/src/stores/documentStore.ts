import { create } from 'zustand'
import type { Document } from '@/types'
import { documentsApi } from '@/services/documents'

// ============================================
// Mock Data
// ============================================

const MOCK_DOCUMENTS: Record<string, Document[]> = {
  '1': [
    {
      id: 'doc-1',
      projectId: '1',
      fileName: 'requirements.pdf',
      fileType: 'pdf',
      fileSize: 2458000,
      status: 'completed',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'doc-2',
      projectId: '1',
      fileName: 'technical-spec.docx',
      fileType: 'docx',
      fileSize: 1850000,
      status: 'completed',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'doc-3',
      projectId: '1',
      fileName: 'api-design.txt',
      fileType: 'txt',
      fileSize: 45000,
      status: 'processing',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ],
  '2': [
    {
      id: 'doc-4',
      projectId: '2',
      fileName: 'prd.pdf',
      fileType: 'pdf',
      fileSize: 3200000,
      status: 'completed',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

const USE_MOCK = false

// ============================================
// Store Interface
// ============================================

interface DocumentState {
  documents: Document[]
  isLoading: boolean
  isUploading: boolean
  uploadProgress: number
  error: string | null
  
  fetchDocuments: (projectId: string) => Promise<void>
  uploadDocument: (projectId: string, file: File) => Promise<Document | null>
  deleteDocument: (projectId: string, documentId: string) => Promise<void>
  reprocessDocument: (projectId: string, documentId: string) => Promise<void>
  clearError: () => void
}

// ============================================
// Store Implementation
// ============================================

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,

  fetchDocuments: async (projectId: string) => {
    set({ isLoading: true, error: null })
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        set({ documents: MOCK_DOCUMENTS[projectId] || [], isLoading: false })
        return
      }
      console.log('📄 Fetching documents for project:', projectId)
      const response = await documentsApi.getAll(projectId)
      console.log('📄 Raw API response:', response)
      console.log('📄 Documents data:', response.data)
      if (response.data && response.data.length > 0) {
        console.log('📄 First document structure:', JSON.stringify(response.data[0], null, 2))
      }
      set({ documents: response.data || [], isLoading: false })
    } catch (error) {
      console.error('📄 Error fetching documents:', error)
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  uploadDocument: async (projectId: string, file: File) => {
    set({ isUploading: true, uploadProgress: 0, error: null })
    try {
      if (USE_MOCK) {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((r) => setTimeout(r, 100))
          set({ uploadProgress: i })
        }
        const newDoc: Document = {
          id: `doc-${Date.now()}`,
          projectId,
          fileName: file.name,
          fileType: file.name.split('.').pop() as 'pdf' | 'docx' | 'txt',
          fileSize: file.size,
          status: 'processing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          documents: [...state.documents, newDoc],
          isUploading: false,
          uploadProgress: 0,
        }))
        
        // Simulate processing completion after 3 seconds
        setTimeout(() => {
          set((state) => ({
            documents: state.documents.map((d) =>
              d.id === newDoc.id ? { ...d, status: 'completed' as const } : d
            ),
          }))
        }, 3000)
        
        return newDoc
      }
      
      const response = await documentsApi.upload(projectId, file, (progress) => {
        set({ uploadProgress: progress })
      })
      set((state) => ({
        documents: [...state.documents, response.data],
        isUploading: false,
        uploadProgress: 0,
      }))
      return response.data
    } catch (error) {
      set({ error: (error as Error).message, isUploading: false, uploadProgress: 0 })
      return null
    }
  },

  deleteDocument: async (projectId: string, documentId: string) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300))
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== documentId),
        }))
        return
      }
      await documentsApi.delete(projectId, documentId)
      set((state) => ({
        documents: state.documents.filter((d) => d.id !== documentId),
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  reprocessDocument: async (projectId: string, documentId: string) => {
    try {
      if (USE_MOCK) {
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === documentId ? { ...d, status: 'processing' as const } : d
          ),
        }))
        await new Promise((r) => setTimeout(r, 2000))
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === documentId ? { ...d, status: 'completed' as const } : d
          ),
        }))
        return
      }
      await documentsApi.reprocess(projectId, documentId)
      // Refetch to get updated status
      await get().fetchDocuments(projectId)
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  clearError: () => set({ error: null }),
}))
