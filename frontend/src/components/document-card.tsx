import { FileText, Trash2, RotateCcw, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"
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

  const getStatusIcon = () => {
    switch (document.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = () => {
    switch (document.status) {
      case "completed":
        return <Badge variant="success">Processed</Badge>
      case "processing":
        return <Badge variant="info">Processing</Badge>
      case "pending":
        return <Badge variant="warning">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  const getFileIcon = () => {
    const iconClass = "h-10 w-10"
    switch (document.fileType) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />
      case "docx":
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
              <span>{formatFileSize(document.fileSize)}</span>
              <span>•</span>
              <span>{document.fileType.toUpperCase()}</span>
              <span>•</span>
              <span>{formatDate(document.createdAt)}</span>
            </div>
            {document.status === "failed" && document.errorMessage && (
              <p className="mt-2 text-sm text-destructive">{document.errorMessage}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {document.status === "failed" && onReprocess && (
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
