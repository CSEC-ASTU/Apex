import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { TaskCard } from "@/components/task-card"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { CheckSquare, Plus, Sparkles, Loader2 } from "lucide-react"
import { useTaskStore, useProjectStore } from "@/stores"
import type { TaskStatus } from "@/types"

export default function TasksPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { currentProject, fetchProject } = useProjectStore()
  const {
    tasks,
    isLoading,
    isCreating,
    isGenerating,
    fetchTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    generateTasks,
    getProgress,
  } = useTaskStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (projectId) {
      await updateTaskStatus(projectId, taskId, status)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (projectId && confirm("Are you sure you want to delete this task?")) {
      await deleteTask(projectId, taskId)
    }
  }

  const handleCreateTask = async (data: { title: string; description?: string; weight?: number }) => {
    if (projectId) {
      await createTask(projectId, data)
      setIsDialogOpen(false)
    }
  }

  const handleGenerate = async () => {
    if (projectId) {
      await generateTasks(projectId)
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: currentProject?.name || "Project", href: `/dashboard/projects/${projectId}/documents` },
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
            <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? "Generating..." : "Generate Tasks"}
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {progress.completed} of {progress.total} tasks completed
                </span>
                <span className="font-medium">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Task Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-6">
            {/* In Progress */}
            {inProgressTasks.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">In Progress</h2>
                <div className="space-y-3">
                  {inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* To Do */}
            {todoTasks.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">To Do</h2>
                <div className="space-y-3">
                  {todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-muted-foreground">Completed</h2>
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-muted p-4">
                  <CheckSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Generate tasks from your requirements or create them manually.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate from Requirements
                  </Button>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateTask}
        isLoading={isCreating}
      />
    </DashboardLayout>
  )
}
