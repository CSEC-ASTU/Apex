import { config } from '@/config'
import type {
  Document,
  DocumentStatus,
  ApiResponse,
} from '@/types'

// Helper to map backend status to frontend status
function mapStatus(backendStatus: string | undefined): DocumentStatus {
  const status = (backendStatus || 'pending').toUpperCase()
  switch (status) {
    case 'PROCESSED':
      return 'completed'
    case 'PENDING':
      return 'pending'
    case 'FAILED':
      return 'failed'
    default:
      return 'pending'
  }
}

// ============================================
// Document API Service
// Matches backend routes: /api/project/:projectId/...
// ============================================

export const documentsApi = {
  /**
   * Get all documents for a project
   * Fetches from project details endpoint which includes documents
   */
  async getAll(projectId: string): Promise<ApiResponse<Document[]>> {
    const response = await fetch(`${config.apiBaseUrl}/projects/${projectId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    console.log('📄 Raw project response for documents:', result.data?.documents)
    
    // Extract and map documents from project response
    const rawDocs = result.data?.documents || []
    const mappedDocs: Document[] = rawDocs.map((doc: any) => ({
      id: doc.id,
      projectId: doc.projectId || projectId,
      fileName: doc.fileName,
      fileType: doc.fileType || 'unknown',
      fileSize: doc.fileSize || 0,
      // Map backend status (PENDING/PROCESSED/FAILED) to frontend (pending/completed/failed)
      status: mapStatus(doc.status),
      errorMessage: doc.errorMessage,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    }))
    
    return { success: true, data: mappedDocs }
  },

  /**
   * Upload a document (multipart/form-data)
   * Backend: POST /api/project/:projectId/upload
   * Returns: { success, data: { document, analysis, vectorized } }
   */
  async upload(
    projectId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<Document>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100)
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText)
          console.log('📤 Upload response:', response)
          
          // Backend returns { success, data: { document, analysis, vectorized } }
          // Extract the document and add file size from the uploaded file
          const doc = response.data?.document || response.data
          const documentWithSize: Document = {
            id: doc.id,
            projectId: doc.projectId || projectId,
            fileName: doc.fileName,
            fileType: doc.fileType || file.name.split('.').pop() || 'unknown',
            fileSize: file.size, // Get size from the uploaded file
            status: (doc.status || 'pending').toLowerCase() as 'pending' | 'processing' | 'completed' | 'failed',
            createdAt: doc.createdAt || new Date().toISOString(),
            updatedAt: doc.updatedAt || new Date().toISOString(),
          }
          
          // Map PROCESSED -> completed, PENDING -> pending, FAILED -> failed
          if (documentWithSize.status === 'processed') {
            documentWithSize.status = 'completed'
          }
          
          resolve({ success: true, data: documentWithSize })
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('POST', `${config.apiBaseUrl}/project/${projectId}/upload`)
      xhr.withCredentials = true
      xhr.send(formData)
    })
  },

  /**
   * Add text data to a project
   * Backend: POST /api/project/:projectId/addTextData
   */
  async addTextData(projectId: string, text: string): Promise<ApiResponse<Document>> {
    const response = await fetch(
      `${config.apiBaseUrl}/project/${projectId}/addTextData`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  /**
   * Add missing data to a project
   * Backend: POST /api/project/:projectId/add-missing-data
   */
  async addMissingData(
    projectId: string, 
    data: { text: string; missingdataId?: string }
  ): Promise<ApiResponse<{ chunksStored: number }>> {
    const response = await fetch(
      `${config.apiBaseUrl}/project/${projectId}/add-missing-data`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  /**
   * Get a single document by ID
   * Note: Backend doesn't have dedicated endpoint - use project details
   */
  async getById(projectId: string, documentId: string): Promise<ApiResponse<Document>> {
    const response = await fetch(
      `${config.apiBaseUrl}/projects/${projectId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    const document = result.data?.documents?.find((d: Document) => d.id === documentId)
    if (!document) {
      throw new Error('Document not found')
    }
    return { success: true, data: document }
  },

  /**
   * Delete a document
   * Note: Backend endpoint not yet implemented
   */
  async delete(projectId: string, documentId: string): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${config.apiBaseUrl}/project/${projectId}/documents/${documentId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  /**
   * Reprocess a failed document
   * Note: Backend endpoint not yet implemented
   */
  async reprocess(projectId: string, documentId: string): Promise<ApiResponse<Document>> {
    const response = await fetch(
      `${config.apiBaseUrl}/project/${projectId}/documents/${documentId}/reprocess`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
}
