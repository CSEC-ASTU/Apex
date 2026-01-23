import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileUploader } from "@/components/file-uploader"
import { DocumentCard } from "@/components/document-card"
import { FileText } from "lucide-react"
import { useDocumentStore, useProjectStore } from "@/stores"

export default function DocumentsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { currentProject, fetchProject } = useProjectStore()
  const {
    documents,
    isLoading,
    isUploading,
    uploadProgress,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    reprocessDocument,
  } = useDocumentStore()

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
      fetchDocuments(projectId)
    }
  }, [projectId, fetchProject, fetchDocuments])

  const handleUpload = async (file: File) => {
    if (projectId) {
      await uploadDocument(projectId, file)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (projectId && confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(projectId, documentId)
    }
  }

  const handleReprocess = async (documentId: string) => {
    if (projectId) {
      await reprocessDocument(projectId, documentId)
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: currentProject?.name || `Project`, href: `/dashboard/projects/${projectId}/documents` },
        { label: "Documents" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage project documentation. The AI will extract requirements automatically.
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Upload PRDs, specifications, or any project documentation (PDF, DOCX, TXT).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader
              onUpload={handleUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Project Documents</CardTitle>
            <CardDescription>
              {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onDelete={handleDelete}
                    onReprocess={handleReprocess}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No documents uploaded</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Upload your project requirements document to get started with AI-powered analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
