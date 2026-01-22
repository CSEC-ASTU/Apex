import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  // Add more routes here
  // {
  //   path: '/about',
  //   element: <AboutPage />,
  // },
])
