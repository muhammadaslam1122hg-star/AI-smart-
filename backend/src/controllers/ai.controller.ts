
import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GoogleGenAI, Modality } from '@google/genai';
import { db } from '../config/firebase.config';
import * as admin from 'firebase-admin';
// Fix: Import Buffer for Node.js environment to resolve name resolution issues
import { Buffer } from 'buffer';

export const generateContent = async (req: AuthRequest, res: Response) => {
  const request = req as any;
  const { featureType, prompt, systemInstruction, imageUri, isThinking, durationLabel } = request.body;
  const uid = request.user.uid;
  const cost = request.creditCost || 0;

  // Initialize GenAI using mandatory named parameter and directly using process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let result: any;

    // Feature Logic Orchestration
    if (featureType === 'TEXT_TO_IMAGE' || featureType === 'PHOTO_EDITING') {
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
            { text: prompt || "Generate a high fidelity creative asset." }
          ]
        }
      });
      
      // Strict part iteration to find image data as specified in guidelines
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            result = `data:image/png;base64,${part.inlineData.data}`;
            break;
          } else if (part.text) {
            result = part.text;
          }
        }
      }
    } else if (featureType === 'AI_VIDEO_GENERATOR' || featureType === 'TEXT_TO_VIDEO' || featureType === 'PHOTO_TO_VIDEO') {
      // Implement Video Generation using Veo models as per guidelines
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Cinematic sequence',
        // Optional starting frame if provided
        image: imageUri ? {
          imageBytes: imageUri.includes('base64,') ? imageUri.split('base64,')[1] : imageUri,
          mimeType: 'image/png'
        } : undefined,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      // Poll for operation completion as required for Veo models
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Fetch and return as data URI for frontend compatibility
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const arrayBuffer = await videoResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        result = `data:video/mp4;base64,${base64}`;
      }
    } else if (featureType === 'TEXT_TO_VOICE') {
      // Implement TTS using gemini-2.5-flash-preview-tts as per guidelines
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      // Extract PCM audio data
      result = `data:audio/pcm;base64,${response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data}`;
    } else {
      // Text Tasks: Selection based on complexity as per guidelines
      // SMART_QUESTION is identified as a complex reasoning task
      const isComplex = featureType === 'SMART_QUESTION' || isThinking;
      const model = isComplex ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const config: any = {};
      if (systemInstruction) config.systemInstruction = systemInstruction;
      
      // Support for thinkingBudget if requested
      if (isThinking) {
        config.thinkingConfig = { thinkingBudget: isComplex ? 32768 : 24576 };
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt || "Analyze and provide a detailed response.",
        config: config,
      });
      // Extract text output directly from property as specified in guidelines
      result = response.text;
    }

    if (!result) {
       throw new Error("Generation produced empty content");
    }

    // Atomic Transactional Deduction
    await db.runTransaction(async (t) => {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await t.get(userRef);
      const currentCredits = userDoc.data()?.credits || 0;
      
      const newCredits = Math.max(0, currentCredits - cost);
      t.update(userRef, { credits: newCredits });
      
      t.set(db.collection('usage_logs').doc(), {
        uid,
        featureType,
        credits_used: cost,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    const finalStatus = await db.collection('users').doc(uid).get();
    res.json({ result, credits: finalStatus.data()?.credits });
  } catch (error: any) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ error: 'Neural Pipeline Error: ' + (error.message || 'Unknown generation failure') });
  }
};
