import { config } from '@/config'
import type {
  Document,
  ApiResponse,
} from '@/types'

// ============================================
// Document API Service
// Backend: /api/project/:projectId/documents
// ============================================

export const documentsApi = {
  /**
   * Get all documents for a project
   * Backend: GET /api/project/:projectId/documents
   */
  async getAll(projectId: string): Promise<ApiResponse<Document[]>> {
    const response = await fetch(`${config.apiBaseUrl}/project/${projectId}/documents`, {
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
    console.log('📄 Documents response:', result)
    
    return { success: true, data: result.data || [] }
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
          const doc = response.data?.document || response.data
          const document: Document = {
            id: doc.id,
            projectId: doc.projectId || projectId,
            fileName: doc.fileName,
            fileType: doc.fileType || file.type || 'unknown',
            status: doc.status || 'PENDING',
            createdAt: doc.createdAt || new Date().toISOString(),
            fileSize: file.size,
          }
          
          resolve({ success: true, data: document })
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
