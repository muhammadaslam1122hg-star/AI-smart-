
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Image as ImageIcon, Video, Mic, Wand2, Download, 
  Upload, Clock, Type, Users, Music, Map, CheckCircle2, 
  Sparkles, Paperclip, Camera, Code2, Layers, RefreshCcw,
  BookOpen, Search, HelpCircle, FileText, Scan, Copy, Check,
  ListFilter, Target, Zap, FileJson, MicOff, Globe, Languages,
  ShieldCheck, MonitorPlay, Palette, PenTool, Cpu, Mic2
} from 'lucide-react';
import { FeatureType } from '../types';
import { geminiService } from '../services/gemini';
import { categoriesData } from '../data/categories';
import { languagesData } from '../data/languages';

interface FeatureModalProps {
  type: FeatureType;
  onClose: () => void;
  isThinking: boolean;
  onSuccess: () => void;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ type, onClose, isThinking, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [mainCategory, setMainCategory] = useState(categoriesData[0].name);
  const [subCategory, setSubCategory] = useState(categoriesData[0].sub[0]);
  const [availableSubCats, setAvailableSubCats] = useState(categoriesData[0].sub);
  const [selectedLanguage, setSelectedLanguage] = useState(languagesData.find(l => l.country === "Pakistan") || languagesData[0]);

  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<{data: string, mimeType: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const [videoDuration, setVideoDuration] = useState('15s');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    const selected = categoriesData.find(c => c.name === mainCategory);
    if (selected) {
      setAvailableSubCats(selected.sub);
      setSubCategory(selected.sub[0]);
    }
  }, [mainCategory]);

  const isFree = [FeatureType.SMART_QUESTION, FeatureType.JSON_PROMPT_GENERATOR].includes(type);

  const handleAction = async () => {
    setLoading(true);
    setResult(null);
    try {
      let response;
      const langContext = `IMPORTANT: Provide ALL output in ${selectedLanguage.language} language. `;
      const categoryContext = `Context: ${mainCategory} > ${subCategory}. `;
      const userPrompt = input || "Generate high-quality production assets.";

      // Feature Specific Routing
      switch (type) {
        case FeatureType.TEXT_TO_IMAGE:
          response = await geminiService.generateImage(`${langContext} ${userPrompt}`);
          break;
        
        case FeatureType.PHOTO_EDITING:
          if (!uploadedImage) throw new Error("Please upload an image to edit.");
          response = await geminiService.editImage(uploadedImage, `${langContext} ${userPrompt}`);
          break;

        case FeatureType.AI_VIDEO_GENERATOR:
        case FeatureType.TEXT_TO_VIDEO:
        case FeatureType.PHOTO_TO_VIDEO:
          response = await geminiService.generateVideo(
            `${categoryContext} ${userPrompt}. Audio style: ${selectedLanguage.language}`, 
            videoDuration, 
            uploadedImage || undefined
          );
          break;

        case FeatureType.TEXT_TO_VOICE:
          await geminiService.textToSpeech(userPrompt);
          response = "Voice Synthesis Complete. Audio playing in neural buffer.";
          break;

        case FeatureType.SMART_QUESTION:
          response = await geminiService.generateText(userPrompt, `You are an Elite Educator. Solve the user's problem step-by-step. Language: ${selectedLanguage.language}`, attachments);
          break;

        case FeatureType.JSON_PROMPT_GENERATOR:
          response = await geminiService.generateText(userPrompt, `Generate a complex JSON structure for ${mainCategory}. Metadata in ${selectedLanguage.language}. RAW JSON ONLY.`, attachments);
          break;

        case FeatureType.DESIGNER_TOOL:
          response = await geminiService.generateText(userPrompt, `You are a Lead UI/UX Designer. Create a detailed design spec and wireframe description in ${selectedLanguage.language}.`, attachments);
          break;

        case FeatureType.TOOL_CREATOR:
          response = await geminiService.generateText(userPrompt, `Create a complete logic and code for a functional AI utility tool. Documentation in ${selectedLanguage.language}.`, attachments);
          break;

        default:
          // Builders (Website, WebApp, MobileApp, Agent)
          const systemMsg = `You are a Senior SaaS Architect. Generate full project structures, code snippets, and deployment logic for a ${type.replace(/_/g, ' ')}. Use ${selectedLanguage.language} for descriptions.`;
          response = await geminiService.generateText(userPrompt, systemMsg, attachments);
      }

      setResult(response);
      if (!isFree) onSuccess();
    } catch (error: any) {
      console.error(error);
      alert("System Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => { setInput(prev => prev + " " + event.results[0][0].transcript); setIsListening(false); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isAttachment: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        if (isAttachment) setAttachments(prev => [...prev, { data, mimeType: file.type }]);
        else setUploadedImage(data);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="bg-[#0f172a] border border-white/5 w-full max-w-7xl rounded-[3rem] overflow-hidden shadow-[0_0_150px_rgba(79,70,229,0.2)] flex flex-col md:flex-row h-[94vh]">
        
        {/* Left Side: Controls */}
        <div className="w-full md:w-[460px] bg-slate-950/40 border-r border-white/5 p-8 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                 <Zap className="text-indigo-400" size={20} />
              </div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">{type.replace(/_/g, ' ')}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all"><X size={24} /></button>
          </div>

          <div className="space-y-8 flex-1">
            {/* Language Architecture */}
            <div className="p-6 bg-slate-900/30 rounded-3xl border border-white/5 space-y-4 shadow-xl">
               <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} /> GLOBAL ENGINE
               </label>
               <select 
                  value={`${selectedLanguage.country}|${selectedLanguage.language}`}
                  onChange={(e) => { const [c, l] = e.target.value.split('|'); setSelectedLanguage({ country:c, language:l }); }}
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
               >
                 {languagesData.map((l, i) => <option key={i} value={`${l.country}|${l.language}`}>{l.country} ({l.language})</option>)}
               </select>
            </div>

            {/* Category Selector */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Domain Context</label>
                <select 
                  value={mainCategory} onChange={(e) => setMainCategory(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-slate-300 focus:outline-none"
                >
                  {categoriesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Media Upload */}
            {(type === FeatureType.PHOTO_EDITING || type === FeatureType.PHOTO_TO_VIDEO) && (
              <div onClick={() => fileInputRef.current?.click()} className="h-44 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all overflow-hidden bg-slate-900/40 relative group">
                {uploadedImage ? <img src={uploadedImage} className="w-full h-full object-cover" /> : <div className="text-center space-y-2"><Upload className="mx-auto text-slate-600" /><span className="text-[10px] font-black text-slate-600 uppercase">Upload Reference</span></div>}
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFileUpload(e, false)} accept="image/*" />
              </div>
            )}

            {/* Script Node */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Script</label>
                <button onClick={handleMicToggle} className={`p-2 rounded-xl border ${isListening ? 'bg-red-600 border-red-500' : 'bg-slate-800 border-white/5'}`}><Mic size={14} /></button>
              </div>
              <textarea 
                value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={`Detailed requirements in ${selectedLanguage.language}...`} 
                className="w-full bg-slate-900/40 border border-white/5 rounded-3xl px-6 py-6 text-sm focus:outline-none focus:border-indigo-500 min-h-[160px] resize-none text-slate-200" 
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button onClick={() => attachmentInputRef.current?.click()} className="p-4 bg-slate-900 rounded-2xl border border-white/5"><Paperclip size={20} /></button>
            <input ref={attachmentInputRef} type="file" className="hidden" multiple onChange={(e) => handleFileUpload(e, true)} />
            <button disabled={loading} onClick={handleAction} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3">
              {loading ? <RefreshCcw className="animate-spin" /> : <Sparkles />}
              {loading ? 'RENDERING...' : isFree ? 'INITIATE FREE' : 'GENERATE (10 CR)'}
            </button>
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="flex-1 p-8 flex flex-col bg-slate-950/80">
          <div className="flex items-center justify-between mb-8">
            <div className="px-4 py-1.5 bg-slate-900 rounded-full border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Projection</div>
            {result && <button onClick={() => {navigator.clipboard.writeText(result || ""); setIsCopied(true); setTimeout(()=>setIsCopied(false),2000)}} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/5">{isCopied ? <Check className="text-emerald-500" /> : <Copy size={20}/>}</button>}
          </div>

          <div className="flex-1 bg-slate-950 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
            {loading && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 text-center p-16">
                 <div className="relative w-40 h-40">
                    <div className="absolute inset-0 border-4 border-indigo-600/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Sparkles size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-black text-white italic uppercase">Rendering Asset</h3>
                    <p className="text-[9px] text-slate-600 font-mono tracking-[0.4em]">{selectedLanguage.language.toUpperCase()} ENGINE ACTIVE</p>
                 </div>
              </div>
            )}

            {!result && !loading && (
              <div className="text-center p-16 space-y-6 opacity-30 grayscale">
                <ShieldCheck size={64} className="mx-auto text-slate-600" />
                <div className="space-y-2">
                  <p className="text-sm font-black text-white italic uppercase tracking-widest">System Ready</p>
                  <p className="text-xs text-slate-500">Configure your parameters to begin neural synthesis.</p>
                </div>
              </div>
            )}

            {result && (
              <div className="w-full h-full animate-in fade-in duration-700 bg-[#05070a]">
                {result.startsWith('blob:') || result.startsWith('http') ? (
                  <video src={result} controls autoPlay className="w-full h-full object-contain" />
                ) : result.startsWith('data:image') ? (
                  <img src={result} className="w-full h-full object-contain" />
                ) : (
                  <div className="p-10 w-full h-full overflow-y-auto text-sm text-slate-300 font-medium custom-scrollbar">
                    <pre className="whitespace-pre-wrap font-sans">{result}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureModal;
