
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { db } from '../config/firebase.config';

export const checkCredits = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const uid = req.user?.uid;
  // Cast to any to bypass property access errors for 'body'
  const { featureType } = (req as any).body;

  // Free features (defined in prompt)
  const freeFeatures = ['SMART_QUESTION', 'JSON_PROMPT_GENERATOR'];
  const cost = freeFeatures.includes(featureType) ? 0 : 10;

  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    let userData = userDoc.data();

    if (!userData) {
      // Initialize new user
      const initialData = {
        credits: 100,
        last_reset: Date.now(),
        uid,
        email: req.user.email
      };
      await userRef.set(initialData);
      userData = initialData;
    }

    // Daily Reset Logic
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (now - (userData.last_reset || 0) > twentyFourHours) {
      await userRef.update({ credits: 100, last_reset: now });
      userData.credits = 100;
    }

    if (userData.credits < cost) {
      return res.status(402).json({ error: 'Insufficient credits. Wait for 24h reset.' });
    }

    // Attach cost to request for final deduction
    (req as any).creditCost = cost;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Credit system offline' });
  }
};
