
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { db } from '../config/firebase.config';

export const verifyDevice = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Cast to any to bypass property access errors for 'body'
  const { deviceId } = (req as any).body;
  const uid = req.user?.uid;

  if (!deviceId || !uid) {
    return res.status(400).json({ error: 'Device identity required' });
  }

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (userData && userData.device_id && userData.device_id !== deviceId) {
      return res.status(403).json({ 
        error: 'Multi-device access blocked. This account is locked to another device.' 
      });
    }

    // If first time, link device
    if (!userData?.device_id) {
      await db.collection('users').doc(uid).set({ device_id: deviceId }, { merge: true });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Security validation failed' });
  }
};
