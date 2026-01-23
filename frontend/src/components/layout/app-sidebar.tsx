import { useLocation, Link } from "react-router-dom"
import {
  LayoutDashboard,
  FolderKanban,
  FolderPlus,
  FileText,
  ListChecks,
  CheckSquare,
  BarChart3,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "New Project",
    url: "/dashboard/projects/new",
    icon: FolderPlus,
  },
]

const projectNavItems = [
  {
    title: "Documents",
    url: "documents",
    icon: FileText,
  },
  {
    title: "Requirements",
    url: "requirements",
    icon: ListChecks,
  },
  {
    title: "Tasks",
    url: "tasks",
    icon: CheckSquare,
  },
  {
    title: "Progress",
    url: "progress",
    icon: BarChart3,
  },
  {
    title: "Q&A Chat",
    url: "chat",
    icon: MessageSquare,
  },
  {
    title: "Validation",
    url: "validation",
    icon: ShieldCheck,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  
  // Check if we're inside a project (URL contains /projects/:id/)
  const projectMatch = location.pathname.match(/\/dashboard\/projects\/([^/]+)\//)
  const currentProjectId = projectMatch ? projectMatch[1] : null
  const isInProject = currentProjectId && currentProjectId !== "new"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            Apex
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Project Navigation - only show when inside a project */}
        {isInProject && (
          <SidebarGroup>
            <SidebarGroupLabel>Current Project</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectNavItems.map((item) => {
                  const fullUrl = `/dashboard/projects/${currentProjectId}/${item.url}`
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === fullUrl}
                        tooltip={item.title}
                      >
                        <Link to={fullUrl}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
