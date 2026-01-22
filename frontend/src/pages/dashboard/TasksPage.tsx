import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Plus, Sparkles } from "lucide-react"

export default function TasksPage() {
  const { projectId } = useParams()

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: `Project ${projectId}`, href: `/dashboard/projects/${projectId}/documents` },
        { label: "Tasks" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage tasks generated from requirements.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Tasks
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              Tasks are tagged as AI-recommended or user-created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <CheckSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Tasks will be automatically generated from your requirements, 
                or you can create them manually.
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate from Requirements
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
