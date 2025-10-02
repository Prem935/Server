import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string }
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const secret = process.env.JWT_SECRET || ''
    if (!secret) return res.status(500).json({ message: 'Server config error' })
    const payload = jwt.verify(token, secret) as { id: string, iat: number, exp: number }
    req.user = { id: payload.id }
    next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}



