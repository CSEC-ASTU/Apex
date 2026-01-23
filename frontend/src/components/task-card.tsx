import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, User, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Task, TaskStatus } from "@/types"

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const isCompleted = task.status === "completed"

  const handleCheckChange = (checked: boolean) => {
    onStatusChange(task.id, checked ? "completed" : "todo")
  }

  const getStatusBadge = () => {
    switch (task.status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>
      case "todo":
      default:
        return <Badge variant="secondary">To Do</Badge>
    }
  }

  const getSourceBadge = () => {
    if (task.source === "agent") {
      return (
        <Badge variant="info" className="gap-1">
          <Sparkles className="h-3 w-3" />
          AI Generated
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="gap-1">
        <User className="h-3 w-3" />
        Manual
      </Badge>
    )
  }

  return (
    <Card className={isCompleted ? "opacity-60" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleCheckChange}
            className="mt-1"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`font-medium ${
                  isCompleted ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusBadge()}
                {getSourceBadge()}
              </div>
            </div>
            
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Weight: {task.weight}</span>
                {task.requirementId && (
                  <span>Linked to requirement</span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, "todo")}>
                    Mark as To Do
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, "in_progress")}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
