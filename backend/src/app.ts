import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'
import routes from './routes/index.js'

const app = express()

// Security middleware
app.use(helmet())

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}))

// Request logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api', routes)

// 404 handler
app.use(notFound)

// Error handler
app.use(errorHandler)

export default app
