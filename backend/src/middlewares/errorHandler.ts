import { Request, Response, NextFunction } from 'express'
import { config } from '../config/index.js'

export interface AppError extends Error {
  statusCode?: number
  status?: string
  isOperational?: boolean
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const status = err.status || 'error'

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('Error:', err)
  }

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  })
}

export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'
  error.isOperational = true
  return error
}
