import { config } from '@/config'
import type {
  Document,
  ApiResponse,
} from '@/types'

// ============================================
// Document API Service
// ============================================

export const documentsApi = {
  /**
   * Get all documents for a project
   */
  async getAll(projectId: string): Promise<ApiResponse<Document[]>> {
    const response = await fetch(`${config.apiBaseUrl}/projects/${projectId}/documents`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  /**
   * Upload a document (multipart/form-data)
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
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('POST', `${config.apiBaseUrl}/projects/${projectId}/documents`)
      xhr.withCredentials = true
      xhr.send(formData)
    })
  },

  /**
   * Get a single document by ID
   */
  async getById(projectId: string, documentId: string): Promise<ApiResponse<Document>> {
    const response = await fetch(
      `${config.apiBaseUrl}/projects/${projectId}/documents/${documentId}`,
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
    return response.json()
  },

  /**
   * Delete a document
   */
  async delete(projectId: string, documentId: string): Promise<ApiResponse<void>> {
    const response = await fetch(
      `${config.apiBaseUrl}/projects/${projectId}/documents/${documentId}`,
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
   */
  async reprocess(projectId: string, documentId: string): Promise<ApiResponse<Document>> {
    const response = await fetch(
      `${config.apiBaseUrl}/projects/${projectId}/documents/${documentId}/reprocess`,
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
