import { createBrowserRouter } from 'react-router-dom'

// Public pages
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

// Dashboard pages
import {
  DashboardPage,
  ProjectsPage,
  CreateProjectPage,
  DocumentsPage,
  RequirementsPage,
  TasksPage,
  ProgressPage,
  ChatPage,
  ValidationPage,
} from './pages/dashboard'

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },

  // Dashboard routes (auth protection is handled inside DashboardLayout)
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/projects',
    element: <ProjectsPage />,
  },
  {
    path: '/dashboard/projects/new',
    element: <CreateProjectPage />,
  },
  {
    path: '/dashboard/projects/:projectId/documents',
    element: <DocumentsPage />,
  },
  {
    path: '/dashboard/projects/:projectId/requirements',
    element: <RequirementsPage />,
  },
  {
    path: '/dashboard/projects/:projectId/tasks',
    element: <TasksPage />,
  },
  {
    path: '/dashboard/projects/:projectId/progress',
    element: <ProgressPage />,
  },
  {
    path: '/dashboard/projects/:projectId/chat',
    element: <ChatPage />,
  },
  {
    path: '/dashboard/projects/:projectId/validation',
    element: <ValidationPage />,
  },
])
