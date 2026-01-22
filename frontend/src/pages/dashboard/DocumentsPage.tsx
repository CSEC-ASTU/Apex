import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

export default function DocumentsPage() {
  const { projectId } = useParams()

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: `Project ${projectId}`, href: `/dashboard/projects/${projectId}/documents` },
        { label: "Documents" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              Upload and manage project documentation.
            </p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Project Documents</CardTitle>
            <CardDescription>
              Upload PRDs, specifications, and other project documents.
              The AI will extract requirements and generate tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No documents uploaded</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Upload your project requirements document (PDF, DOCX, or TXT) 
                to get started with AI-powered analysis.
              </p>
              <Button className="mt-4">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
