import { Request, Response } from 'express'

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  })
}
