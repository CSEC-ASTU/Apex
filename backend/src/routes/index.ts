import { Router } from 'express'

const router = Router()

// API version info
router.get('/', (_req, res) => {
  res.json({
    message: 'Apex API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      api: 'GET /api',
    },
  })
})

// Add your route imports here
// import userRoutes from './user.routes.js'
// router.use('/users', userRoutes)

export default router
