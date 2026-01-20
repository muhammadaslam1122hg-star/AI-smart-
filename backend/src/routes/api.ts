
import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { verifyDevice } from '../middlewares/device.middleware';
import { checkCredits } from '../middlewares/credit.middleware';
import { generateContent } from '../controllers/ai.controller';
import { db } from '../config/firebase.config';

const router = Router();

router.post('/generate', verifyToken, verifyDevice, checkCredits, generateContent);

router.get('/user/status', verifyToken, async (req: any, res) => {
  const userDoc = await db.collection('users').doc(req.user.uid).get();
  res.json(userDoc.data() || { credits: 0 });
});

router.get('/legal/:page', (req, res) => {
  const { page } = req.params;
  // Serve static compliant content
  res.json({ title: page.toUpperCase(), content: `Full ${page} text for Smart Platform compliance.` });
});

export default router;
