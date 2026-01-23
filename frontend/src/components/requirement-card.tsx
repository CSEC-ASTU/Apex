import { ListChecks } from "lucide-react"
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

  // Format code (e.g., "FR-01" or "NFR-01")
  const getCodeBadge = () => {
    if (!requirement.code) return null
    const isFunctional = requirement.code.startsWith('FR')
    return (
      <Badge variant={isFunctional ? "info" : "secondary"} className="font-mono">
        {requirement.code}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <ListChecks className={`h-5 w-5 mt-0.5 ${getTypeColor()}`} />
            <CardTitle className="text-base font-medium">
              {requirement.code || 'Requirement'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getTypeBadge()}
            {getCodeBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{requirement.description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {requirement.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
