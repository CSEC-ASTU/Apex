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
export default router
