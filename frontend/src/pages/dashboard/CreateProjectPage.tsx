import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { useProjectStore } from "@/stores"

export default function CreateProjectPage() {
  const navigate = useNavigate()
  const { createProject, isCreating, error } = useProjectStore()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const project = await createProject({ name, description })
    if (project) {
      // Navigate to the new project's documents page
      navigate(`/dashboard/projects/${project.id}/documents`)
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/dashboard/projects" },
        { label: "New Project" },
      ]}
    >
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">
            Set up a new project to start tracking your requirements and progress.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Enter the basic information for your project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Project Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="My Awesome Project"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <FieldDescription>
                  Choose a descriptive name for your project.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                  id="description"
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe your project and its goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <FieldDescription>
                  A brief overview of what this project aims to achieve.
                </FieldDescription>
              </Field>

              <div className="flex gap-4">
                <Button type="submit" disabled={!name || isCreating}>
                  {isCreating ? "Creating..." : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/projects")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
