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

router.use("/auth",authRoute)
router.use("/projects",authMiddleware,projectRoute)
router.use("/project",authMiddleware,fileRoute)
router.use("/assistant",assistant)

export default router
