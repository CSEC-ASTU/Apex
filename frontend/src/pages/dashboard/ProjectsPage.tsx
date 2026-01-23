import { useEffect } from "react"
import { Link } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/components/project-card"
import { FolderKanban, Plus } from "lucide-react"
import { useProjectStore } from "@/stores"

export default function ProjectsPage() {
  const { projects, isLoading, fetchProjects } = useProjectStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <DashboardLayout breadcrumbs={[{ label: "Projects" }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your projects.
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                View and manage your project portfolio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create a project to start tracking your progress.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/dashboard/projects/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
