import { Request, Response, NextFunction } from 'express'
import { createError } from './errorHandler.js'

type ValidationSchema<T> = {
  [K in keyof T]: (value: unknown) => boolean
}

export function validate<T>(schema: ValidationSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = []

    for (const [field, validator] of Object.entries(schema)) {
      const value = req.body[field]
      const isValid = (validator as (value: unknown) => boolean)(value)
      
      if (!isValid) {
        errors.push(`Invalid value for field: ${field}`)
      }
    }

    if (errors.length > 0) {
      next(createError(errors.join(', '), 400))
      return
    }

    next()
  }
}

// Common validators
export const validators = {
  isString: (value: unknown): boolean => typeof value === 'string',
  isNumber: (value: unknown): boolean => typeof value === 'number',
  isEmail: (value: unknown): boolean => {
    if (typeof value !== 'string') return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  isRequired: (value: unknown): boolean => value !== undefined && value !== null && value !== '',
  isOptional: (_value: unknown): boolean => true,
}
