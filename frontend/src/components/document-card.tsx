import { FileText, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Document } from "@/types"

interface DocumentCardProps {
  document: Document
  onDelete: (id: string) => void
  onReprocess?: (id: string) => void
}

export function DocumentCard({ document, onDelete, onReprocess }: DocumentCardProps) {
  // Debug logging
  console.log('📄 DocumentCard received:', document)
  
  // Normalize status for display (backend uses PENDING/PROCESSED/FAILED)
  const getDisplayStatus = () => {
    const status = (document.status || 'PENDING').toUpperCase()
    switch (status) {
      case 'PROCESSED': return 'completed'
      case 'FAILED': return 'failed'
      case 'PENDING': return 'pending'
      default: return 'pending'
    }
  }
  const displayStatus = getDisplayStatus()
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = () => {
    switch (displayStatus) {
      case "completed":
        return <Badge variant="success">Processed</Badge>
      case "pending":
        return <Badge variant="warning">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{displayStatus}</Badge>
    }
  }

  // Get file extension from MIME type or filename
  const getFileExtension = (): string => {
    const fileType = document.fileType || ''
    if (fileType.includes('pdf')) return 'pdf'
    if (fileType.includes('word') || fileType.includes('docx')) return 'docx'
    if (fileType.includes('text') || fileType.includes('txt')) return 'txt'
    // Try to get from filename
    const ext = document.fileName?.split('.').pop()?.toLowerCase()
    return ext || 'unknown'
  }

  const getFileIcon = () => {
    const iconClass = "h-10 w-10"
    const ext = getFileExtension()
    switch (ext) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />
      case "docx":
      case "doc":
        return <FileText className={`${iconClass} text-blue-500`} />
      case "txt":
        return <FileText className={`${iconClass} text-gray-500`} />
      default:
        return <FileText className={`${iconClass} text-muted-foreground`} />
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* File icon */}
          <div className="flex-shrink-0">{getFileIcon()}</div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{document.fileName}</h3>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>{formatFileSize(document.fileSize || 0)}</span>
              <span>•</span>
              <span>{getFileExtension().toUpperCase()}</span>
              <span>•</span>
              <span>{document.createdAt ? formatDate(document.createdAt) : 'N/A'}</span>
            </div>
            {displayStatus === "failed" && (document as { errorMessage?: string }).errorMessage && (
              <p className="mt-2 text-sm text-destructive">{(document as { errorMessage?: string }).errorMessage}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {displayStatus === "failed" && onReprocess && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReprocess(document.id)}
                title="Reprocess"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(document.id)}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
