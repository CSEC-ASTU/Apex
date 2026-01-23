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
  name: string
  description?: string
  userId: string
  progress: number // 0-100 percentage
  documentCount: number
  taskCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateProjectInput {
  name: string
  description?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
}

// ============================================
// Document Types
// ============================================

export type DocumentFileType = 'pdf' | 'docx' | 'txt'
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Document {
  id: string
  projectId: string
  fileName: string
  fileType: DocumentFileType
  fileSize: number // in bytes
  status: DocumentStatus
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface UploadDocumentInput {
  file: File
}

// ============================================
// Requirement Types
// ============================================

export type RequirementType = 'functional' | 'non-functional'
export type RequirementStatus = 'pending' | 'implemented' | 'verified'

export interface Requirement {
  id: string
  projectId: string
  documentId: string
  type: RequirementType
  title: string
  content: string
  priority?: 'low' | 'medium' | 'high'
  status: RequirementStatus
  linkedTaskIds: string[]
  createdAt: string
  updatedAt: string
}

// ============================================
// Task Types
// ============================================

export type TaskStatus = 'todo' | 'in_progress' | 'completed'
export type TaskSource = 'agent' | 'user'

export interface Task {
  id: string
  projectId: string
  requirementId?: string
  title: string
  description?: string
  status: TaskStatus
  source: TaskSource
  weight: number // For progress calculation (1-10)
  createdAt: string
  updatedAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  requirementId?: string
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
