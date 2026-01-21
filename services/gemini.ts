
// Frontend Service Bridge to Backend
const BACKEND_URL = (import.meta as any).env?.VITE_API_URL || ''; 

// Device ID Helper (Simple fingerprint)
const getDeviceId = () => {
  let id = localStorage.getItem('smart_device_id');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('smart_device_id', id);
  }
  return id;
};

const getHeaders = async () => {
  const token = localStorage.getItem('smart_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const geminiService = {
  async generateText(prompt: string, systemInstruction?: string, attachments?: any[], isThinking: boolean = false) {
    const res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ 
        featureType: 'GENERIC_TEXT', 
        prompt, 
        systemInstruction, 
        attachments,
        isThinking,
        deviceId: getDeviceId()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data.result;
  },

  async generateImage(prompt: string) {
    const res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ 
        featureType: 'TEXT_TO_IMAGE', 
        prompt,
        deviceId: getDeviceId()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data.result;
  },

  async editImage(imageUri: string, prompt: string) {
    const res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ 
        featureType: 'PHOTO_EDITING', 
        imageUri, 
        prompt,
        deviceId: getDeviceId()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data.result;
  },

  async generateVideo(prompt: string, durationLabel: string, initialImage?: string) {
    const res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ 
        featureType: 'AI_VIDEO_GENERATOR', 
        prompt, 
        durationLabel, 
        initialImage,
        deviceId: getDeviceId()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data.result;
  },

  async textToSpeech(text: string) {
    const res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ 
        featureType: 'TEXT_TO_VOICE', 
        prompt: text,
        deviceId: getDeviceId()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data.result;
  },

  async getUserStatus() {
    const res = await fetch(`${BACKEND_URL}/api/v1/user/status`, {
      method: 'GET',
      headers: await getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  }
};
