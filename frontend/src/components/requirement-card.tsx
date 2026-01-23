import { ListChecks, CheckCircle, Clock, Link as LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Requirement } from "@/types"

interface RequirementCardProps {
  requirement: Requirement
}

export function RequirementCard({ requirement }: RequirementCardProps) {
  const getTypeColor = () => {
    return requirement.type === "functional" ? "text-blue-500" : "text-purple-500"
  }

  const getTypeBadge = () => {
    return requirement.type === "functional" ? (
      <Badge variant="info">Functional</Badge>
    ) : (
      <Badge className="bg-purple-500 hover:bg-purple-500/80">Non-Functional</Badge>
    )
  }

  const getStatusBadge = () => {
    switch (requirement.status) {
      case "implemented":
        return <Badge variant="success">Implemented</Badge>
      case "verified":
        return <Badge className="bg-green-600 hover:bg-green-600/80">Verified</Badge>
      case "pending":
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getStatusIcon = () => {
    switch (requirement.status) {
      case "implemented":
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPriorityBadge = () => {
    if (!requirement.priority) return null
    switch (requirement.priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="warning">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <ListChecks className={`h-5 w-5 mt-0.5 ${getTypeColor()}`} />
            <CardTitle className="text-base font-medium">{requirement.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getTypeBadge()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{requirement.content}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {getPriorityBadge()}
            {requirement.linkedTaskIds.length > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <LinkIcon className="h-3 w-3" />
                <span>{requirement.linkedTaskIds.length} linked tasks</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span className="text-xs text-muted-foreground capitalize">
              {requirement.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
