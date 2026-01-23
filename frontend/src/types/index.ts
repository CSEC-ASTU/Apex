// ============================================
// Common Types
// ============================================

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// ============================================
// Project Types
// ============================================

export interface Project {
  id: string
  title: string
  description?: string
  status: 'ACTIVE' | 'COMPLETED'
  userId: string
  progress: number // 0-100 percentage
  documentCount?: number
  taskCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProjectInput {
  title: string
  description?: string
}

export interface UpdateProjectInput {
  title?: string
  description?: string
  status?: 'ACTIVE' | 'COMPLETED'
}

// ============================================
// Document Types
// ============================================

// Backend uses uppercase: PENDING, PROCESSED, FAILED
export type DocumentStatus = 'PENDING' | 'PROCESSED' | 'FAILED'

export interface Document {
  id: string
  projectId: string
  fileName: string
  fileType: string // e.g., "application/pdf"
  status: DocumentStatus
  createdAt: string
  // Optional fields for UI
  fileSize?: number
  updatedAt?: string
}

export interface UploadDocumentInput {
  file: File
}

// ============================================
// Requirement Types
// ============================================

export type RequirementType = 'functional' | 'non-functional'

export interface Requirement {
  id: string
  code: string // e.g., "FR-01", "NFR-01"
  description: string
  projectId: string
  createdAt: string
  // Frontend-added fields for display
  type?: RequirementType
}

// ============================================
// Task Types
// ============================================

// Backend uses uppercase: TODO, IN_PROGRESS, DONE
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
// Backend uses uppercase: AGENT, USER
export type TaskOrigin = 'AGENT' | 'USER'

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  origin: TaskOrigin
  weight: number
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  weight?: number
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  weight?: number
}

// ============================================
// Chat/Q&A Types
// ============================================

export type ChatRole = 'user' | 'assistant'

export interface ChatSource {
  documentId: string
  documentName: string
  chunk: string
  relevanceScore: number
}

export interface ChatMessage {
  id: string
  projectId: string
  role: ChatRole
  content: string
  sources?: ChatSource[]
  createdAt: string
}

export interface SendMessageInput {
  content: string
}

// ============================================
// Validation Types
// ============================================

export type ValidationStatus = 'passed' | 'failed' | 'warnings'

export interface ValidationGap {
  requirementId: string
  requirementTitle: string
  requirementContent: string
  reason: string
  severity: 'missing' | 'partial' | 'unclear'
}

export interface ValidationResult {
  id: string
  projectId: string
  status: ValidationStatus
  implementedCount: number
  totalCount: number
  progressPercentage: number
  gaps: ValidationGap[]
  recommendations: string[]
  createdAt: string
}

// ============================================
// Dashboard Stats Types
// ============================================

export interface DashboardStats {
  totalProjects: number
  totalDocuments: number
  totalTasks: number
  completedTasks: number
  averageProgress: number
  recentProjects: Project[]
}
