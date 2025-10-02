import { Request, Response, NextFunction } from 'express'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ message: 'Not Found' })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (res.headersSent) return
  res.status(500).json({ message: 'Server Error' })
}



