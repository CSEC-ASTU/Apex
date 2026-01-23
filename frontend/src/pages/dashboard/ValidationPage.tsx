import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Loader2,
  Lightbulb,
} from "lucide-react"
import { useValidationStore, useProjectStore } from "@/stores"

export default function ValidationPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { currentProject, fetchProject } = useProjectStore()
  const { result, isLoading, isValidating, fetchLatest, runValidation } = useValidationStore()

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
      fetchLatest(projectId)
    }
  }, [projectId, fetchProject, fetchLatest])

  const handleValidate = async () => {
    if (projectId) {
      await runValidation(projectId)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "warnings":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case "failed":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge variant="success">All Requirements Met</Badge>
      case "warnings":
        return <Badge variant="warning">Gaps Found</Badge>
      case "failed":
        return <Badge variant="destructive">Validation Failed</Badge>
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "missing":
        return <Badge variant="destructive">Missing</Badge>
      case "partial":
        return <Badge variant="warning">Partial</Badge>
      case "unclear":
        return <Badge variant="secondary">Unclear</Badge>
      default:
        return null
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: currentProject?.title || "Project", href: `/dashboard/projects/${projectId}/documents` },
        { label: "Validation" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Validation Check</h1>
            <p className="text-muted-foreground">
              Verify that all requirements are implemented.
            </p>
          </div>
          <Button onClick={handleValidate} disabled={isValidating}>
            {isValidating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isValidating ? "Validating..." : "Run Validation"}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : result ? (
          <>
            {/* Validation Result Card */}
            <Card
              className={`border-2 ${
                result.status === "passed"
                  ? "border-green-500"
                  : result.status === "warnings"
                  ? "border-yellow-500"
                  : "border-red-500"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <CardTitle>Validation Result</CardTitle>
                      <CardDescription>
                        Last run: {new Date(result.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Implemented</p>
                    <p className="text-2xl font-bold text-green-600">
                      {result.implementedCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Requirements</p>
                    <p className="text-2xl font-bold">{result.totalCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gaps Found</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {result.gaps.length}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Implementation Progress</span>
                    <span>{result.progressPercentage}%</span>
                  </div>
                  <Progress value={result.progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Gaps */}
            {result.gaps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Gaps Detected ({result.gaps.length})
                  </CardTitle>
                  <CardDescription>
                    Requirements that are missing or incomplete.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.gaps.map((gap, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium">{gap.requirementTitle}</h4>
                          {getSeverityBadge(gap.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {gap.requirementContent}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <XCircle className="h-4 w-4" />
                          {gap.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Validation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  About Validation
                </CardTitle>
                <CardDescription>
                  How the validation agent works.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">1. Requirement Check</h4>
                    <p className="text-sm text-muted-foreground">
                      Compares extracted requirements against completed tasks.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">2. Gap Detection</h4>
                    <p className="text-sm text-muted-foreground">
                      Identifies missing features or incomplete requirements.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">3. Report Generation</h4>
                    <p className="text-sm text-muted-foreground">
                      Provides a detailed report of any gaps before completion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empty State */}
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-muted p-4">
                    <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Ready to validate</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    When you believe your project is complete, run validation 
                    to check if all requirements have been implemented.
                  </p>
                  <Button className="mt-4" onClick={handleValidate} disabled={isValidating}>
                    <Play className="mr-2 h-4 w-4" />
                    Start Validation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
