import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { BarChart3, CheckSquare, Clock, AlertCircle, Sparkles, User } from "lucide-react"
import { useTaskStore, useProjectStore } from "@/stores"

export default function ProgressPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { currentProject, fetchProject } = useProjectStore()
  const { tasks, isLoading, fetchTasks, getProgress } = useTaskStore()

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
      fetchTasks(projectId)
    }
  }, [projectId, fetchProject, fetchTasks])

  const progress = getProgress()

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress")
  const completedTasks = tasks.filter((t) => t.status === "completed")

  const agentTasks = tasks.filter((t) => t.source === "agent")
  const userTasks = tasks.filter((t) => t.source === "user")

  const agentCompleted = agentTasks.filter((t) => t.status === "completed").length
  const userCompleted = userTasks.filter((t) => t.status === "completed").length

  const progressColor =
    progress.percentage >= 75
      ? "bg-green-500"
      : progress.percentage >= 50
      ? "bg-yellow-500"
      : progress.percentage >= 25
      ? "bg-blue-500"
      : "bg-gray-300"

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: currentProject?.title || "Project", href: `/dashboard/projects/${projectId}/documents` },
        { label: "Progress" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress Overview</h1>
          <p className="text-muted-foreground">
            Track your project completion in real-time.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Main Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>
                  Based on completed task weights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-bold">{progress.percentage}%</span>
                  <span className="text-muted-foreground">
                    {progress.completed} of {progress.total} tasks completed
                  </span>
                </div>
                <div className="h-4 w-full rounded-full bg-muted">
                  <div
                    className={`h-4 rounded-full ${progressColor} transition-all duration-500`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckSquare className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{inProgressTasks.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{todoTasks.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Breakdown by Source */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    AI Generated Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span>{agentCompleted} / {agentTasks.length}</span>
                  </div>
                  <Progress
                    value={agentTasks.length > 0 ? (agentCompleted / agentTasks.length) * 100 : 0}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-purple-500" />
                    Manual Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span>{userCompleted} / {userTasks.length}</span>
                  </div>
                  <Progress
                    value={userTasks.length > 0 ? (userCompleted / userTasks.length) * 100 : 0}
                    className="h-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-muted p-4">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No progress data</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      Progress will be calculated automatically as you complete tasks.
                      Start by adding tasks to your project.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
