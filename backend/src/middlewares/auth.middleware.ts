
import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase.config';

// Use type intersection for better compatibility with Express Request in restrictive TS environments
export type AuthRequest = Request & {
  user?: any;
};

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Use casting to ensure properties like 'headers' are accessible regardless of interface extension issues
  const token = (req as any).headers?.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Unauthorized session' });
  }
};
