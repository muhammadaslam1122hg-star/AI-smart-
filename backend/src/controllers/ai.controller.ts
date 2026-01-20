
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GoogleGenAI } from '@google/genai';
import { db } from '../config/firebase.config';
import * as admin from 'firebase-admin';

export const generateContent = async (req: AuthRequest, res: Response) => {
  // Use casting to bypass property access errors on Request extension
  const request = req as any;
  const { featureType, prompt, systemInstruction, imageUri } = request.body;
  const uid = request.user.uid;
  const cost = request.creditCost;

  // Initialize GenAI with the mandatory process.env.API_KEY naming
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let result: any;

    // Feature Orchestration following @google/genai mandatory guidelines
    if (featureType === 'TEXT_TO_IMAGE' || featureType === 'PHOTO_EDITING') {
      // Use gemini-2.5-flash-image for standard image generation/editing
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            ...(imageUri ? [{ 
              inlineData: { 
                data: imageUri.includes('base64,') ? imageUri.split('base64,')[1] : imageUri, 
                mimeType: 'image/png' 
              } 
            }] : []),
            { text: prompt || "Generate a high quality visual asset based on provided context." }
          ]
        }
      });
      
      // Iterate through candidates and parts to find the image part (as per guidelines)
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          result = `data:image/png;base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          result = part.text;
        }
      }
    } else {
      // Basic Text Tasks: Use gemini-3-flash-preview
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      // Correctly access generated text as a property, not a method
      result = response.text;
    }

    // Transactional Deduction
    await db.runTransaction(async (t) => {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await t.get(userRef);
      const currentCredits = userDoc.data()?.credits || 0;
      
      t.update(userRef, { credits: Math.max(0, currentCredits - cost) });
      t.set(db.collection('usage_logs').doc(), {
        uid,
        featureType,
        credits_used: cost,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    const userStatus = await db.collection('users').doc(uid).get();
    res.json({ result, remainingCredits: userStatus.data()?.credits });
  } catch (error: any) {
    res.status(500).json({ error: 'Neural generation failed: ' + error.message });
  }
};
