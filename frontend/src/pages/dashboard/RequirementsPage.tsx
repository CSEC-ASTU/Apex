import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { RequirementCard } from "@/components/requirement-card"
import { ListChecks, FileText } from "lucide-react"
import { useRequirementStore, useProjectStore } from "@/stores"
import type { RequirementType } from "@/types"

export default function RequirementsPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { currentProject, fetchProject } = useProjectStore()
  const {
    requirements,
    filteredRequirements,
    filter,
    isLoading,
    fetchRequirements,
    setFilter,
  } = useRequirementStore()

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
      fetchRequirements(projectId)
    }
  }, [projectId, fetchProject, fetchRequirements])

  const functionalCount = requirements.filter((r) => r.type === "functional").length
  const nonFunctionalCount = requirements.filter((r) => r.type === "non-functional").length

  const filters: { label: string; value: RequirementType | "all" }[] = [
    { label: `All (${requirements.length})`, value: "all" },
    { label: `Functional (${functionalCount})`, value: "functional" },
    { label: `Non-Functional (${nonFunctionalCount})`, value: "non-functional" },
  ]

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: currentProject?.title || "Project", href: `/dashboard/projects/${projectId}/documents` },
        { label: "Requirements" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Requirements</h1>
            <p className="text-muted-foreground">
              AI-extracted requirements from your project documents.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requirements.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Functional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{functionalCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                Non-Functional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nonFunctionalCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Requirements List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredRequirements.length > 0 ? (
          <div className="space-y-4">
            {filteredRequirements.map((req) => (
              <RequirementCard key={req.id} requirement={req} />
            ))}
          </div>
        ) : requirements.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-4">
                  <ListChecks className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No requirements extracted yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Requirements are automatically extracted when you upload project documents.
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
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">
                  No requirements match the current filter.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
