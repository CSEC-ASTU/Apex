import { useState } from "react"
import { useParams } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, CheckCircle, AlertTriangle, XCircle, Play } from "lucide-react"

export default function ValidationPage() {
  const { projectId } = useParams()
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<null | {
    status: "success" | "warning" | "error"
    message: string
    details: string[]
  }>(null)

  async function handleValidate() {
    setIsValidating(true)

    // TODO: Call validation API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate validation result
    setValidationResult({
      status: "warning",
      message: "Validation complete with warnings",
      details: [
        "No documents uploaded yet",
        "No requirements extracted",
        "No tasks created",
      ],
    })
    setIsValidating(false)
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: `Project ${projectId}`, href: `/dashboard/projects/${projectId}/documents` },
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
            <Play className="mr-2 h-4 w-4" />
            {isValidating ? "Validating..." : "Run Validation"}
          </Button>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <Card
            className={`border-2 ${
              validationResult.status === "success"
                ? "border-green-500"
                : validationResult.status === "warning"
                ? "border-yellow-500"
                : "border-red-500"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validationResult.status === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {validationResult.status === "warning" && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                {validationResult.status === "error" && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {validationResult.message}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {validationResult.details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {detail}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

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
        {!validationResult && (
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
        )}
      </div>
    </DashboardLayout>
  )
}
