import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckSquare, Calendar } from "lucide-react"
import type { Project } from "@/types"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progressColor =
    project.progress >= 75
      ? "bg-green-500"
      : project.progress >= 50
      ? "bg-yellow-500"
      : project.progress >= 25
      ? "bg-blue-500"
      : "bg-gray-300"

  const formattedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link to={`/dashboard/projects/${project.id}/documents`}>
      <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
            <Badge variant={project.progress === 100 ? "success" : "secondary"}>
              {project.progress}%
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {project.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${progressColor} transition-all`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{project.documentCount} docs</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckSquare className="h-4 w-4" />
              <span>{project.taskCount} tasks</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Updated {formattedDate}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
