import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListChecks, FileText } from "lucide-react"
import { Link } from "react-router-dom"

export default function RequirementsPage() {
  const { projectId } = useParams()

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: `Project ${projectId}`, href: `/dashboard/projects/${projectId}/documents` },
        { label: "Requirements" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requirements</h1>
          <p className="text-muted-foreground">
            AI-extracted requirements from your project documents.
          </p>
        </div>

        {/* Requirements List */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-500" />
                Functional Requirements
              </CardTitle>
              <CardDescription>
                Features and functionalities the system must provide.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No requirements extracted yet.
                </p>
                <Button variant="link" asChild className="mt-2">
                  <Link to={`/dashboard/projects/${projectId}/documents`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Upload a document first
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-purple-500" />
                Non-Functional Requirements
              </CardTitle>
              <CardDescription>
                Quality attributes and constraints for the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No requirements extracted yet.
                </p>
                <Button variant="link" asChild className="mt-2">
                  <Link to={`/dashboard/projects/${projectId}/documents`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Upload a document first
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
