import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  // Add more routes here
  // {
  //   path: '/about',
  //   element: <AboutPage />,
  // },
])
