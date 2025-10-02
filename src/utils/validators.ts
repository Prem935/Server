import { body, param, query } from 'express-validator'
import xss from 'xss'

const sanitize = (value: string) => xss(value)

export const registerValidator = [
  body('username').isString().isLength({ min: 3 }).trim().escape().customSanitizer(sanitize),
  body('email').isEmail().normalizeEmail().customSanitizer(sanitize),
  body('password').isString().isLength({ min: 6 })
]

export const loginValidator = [
  body('email').isEmail().normalizeEmail().customSanitizer(sanitize),
  body('password').isString().isLength({ min: 6 })
]

export const profileUpdateValidator = [
  body('username').optional().isString().isLength({ min: 3 }).trim().escape().customSanitizer(sanitize),
  body('email').optional().isEmail().normalizeEmail().customSanitizer(sanitize)
]

export const taskCreateValidator = [
  body('title').isString().isLength({ min: 1 }).trim().escape().customSanitizer(sanitize),
  body('description').optional().isString().trim().customSanitizer(sanitize),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
]

export const taskUpdateValidator = [
  param('id').isMongoId(),
  body('title').optional().isString().isLength({ min: 1 }).trim().escape().customSanitizer(sanitize),
  body('description').optional().isString().trim().customSanitizer(sanitize),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
]

export const taskQueryValidator = [
  query('q').optional().isString().trim().customSanitizer(sanitize),
  query('status').optional().isIn(['todo', 'in-progress', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high'])
]



