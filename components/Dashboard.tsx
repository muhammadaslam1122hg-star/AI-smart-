
import React from 'react';
import { 
  Layout, 
  Code, 
  UserCircle, 
  Zap, 
  Palette, 
  Layers, 
  ImageIcon, 
  Video, 
  Mic2,
  Camera,
  PlayCircle,
  BookOpen,
  Smartphone,
  PenTool,
  Sparkles,
  ArrowRight,
  FileJson,
  ShieldCheck,
  Lock,
  Wand2,
  Cpu,
  MonitorPlay
} from 'lucide-react';
import { FeatureType, UserProfile } from '../types';

interface DashboardProps {
  onFeatureClick: (type: FeatureType) => void;
  user: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onFeatureClick, user }) => {
  const sections = [
    {
      title: 'PERMANENT FREE TOOLS',
      subtitle: 'Unlimited access for all authenticated users',
      features: [
        { id: FeatureType.SMART_QUESTION, title: 'Edu Problem Solver', icon: <BookOpen className="text-emerald-400" />, desc: 'Step-by-step educational problem solver', free: true },
        { id: FeatureType.JSON_PROMPT_GENERATOR, title: 'JSON Prompt Gen', icon: <FileJson className="text-yellow-400" />, desc: 'Architect structured AI prompts', free: true },
      ]
    },
    {
      title: 'AI BUILDER SUITE',
      subtitle: 'Premium credits: 10 CR per generation',
      features: [
        { id: FeatureType.WEBSITE_BUILDER, title: 'Website Builder', icon: <Layout className="text-blue-500" />, desc: 'Landing pages, Blogs & Portfolios', free: false },
        { id: FeatureType.WEB_APP_BUILDER, title: 'Web App Builder', icon: <Code className="text-purple-500" />, desc: 'Full-stack SaaS & Dashboards', free: false },
        { id: FeatureType.MOBILE_APP_BUILDER, title: 'Mobile App Builder', icon: <Smartphone className="text-pink-400" />, desc: 'Native iOS & Android app logic', free: false },
        { id: FeatureType.AI_AGENT_CREATOR, title: 'AI Agent Creator', icon: <UserCircle className="text-indigo-400" />, desc: 'Autonomous neural agents', free: false },
      ]
    },
    {
      title: 'CREATIVE RENDERING',
      subtitle: 'High-fidelity cinematic media generation',
      features: [
        { id: FeatureType.AI_VIDEO_GENERATOR, title: 'AI Video Pro', icon: <PlayCircle className="text-red-500" />, desc: 'Cinematic 720p/1080p video generation', free: false },
        { id: FeatureType.TEXT_TO_VIDEO, title: 'Text to Video', icon: <MonitorPlay className="text-orange-500" />, desc: 'Convert scripts into dynamic clips', free: false },
        { id: FeatureType.PHOTO_TO_VIDEO, title: 'Animate Pro', icon: <Camera className="text-blue-400" />, desc: 'Transform static photos into motion', free: false },
        { id: FeatureType.TEXT_TO_IMAGE, title: 'Image Gen 2.5', icon: <ImageIcon className="text-green-500" />, desc: 'High-res photorealistic art', free: false },
      ]
    },
    {
      title: 'UTILITY & DESIGN',
      subtitle: 'Professional design and development tools',
      features: [
        { id: FeatureType.PHOTO_EDITING, title: 'AI Photo Editor', icon: <Palette className="text-cyan-400" />, desc: 'Object removal & color grading', free: false },
        { id: FeatureType.DESIGNER_TOOL, title: 'UI Designer Pro', icon: <PenTool className="text-fuchsia-400" />, desc: 'Figma-style UI/UX generation', free: false },
        { id: FeatureType.TOOL_CREATOR, title: 'Tool Creator', icon: <Cpu className="text-slate-400" />, desc: 'Build custom AI-powered utilities', free: false },
        { id: FeatureType.TEXT_TO_VOICE, title: 'Neural Voice AI', icon: <Mic2 className="text-rose-400" />, desc: 'Human-like TTS synthesis', free: false },
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#05070a] custom-scrollbar">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 p-16 mb-20 border border-white/5 shadow-[0_0_100px_rgba(79,70,229,0.15)]">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-8">
            <ShieldCheck size={14} /> SMART PLATFORM • ALL 14 NEURAL MODULES ACTIVE
          </div>
          <h1 className="text-7xl font-black text-white mb-8 leading-[1.05] tracking-tighter">
            The Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 italic">AI SaaS Powerhouse.</span>
          </h1>
          <p className="text-slate-400 text-xl mb-12 leading-relaxed max-w-2xl font-medium">
            Access 14 high-performance AI tools in one unified interface. From web development to cinematic video production, Smart Platform handles the complexity for you.
          </p>
          <div className="flex gap-6">
            <button 
              onClick={() => onFeatureClick(FeatureType.SMART_QUESTION)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 px-12 rounded-[1.5rem] transition-all hover:scale-105 shadow-2xl shadow-indigo-900/40 flex items-center gap-3"
            >
              <Sparkles size={20} /> Start Solving Now
            </button>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"></div>
      </div>

      {/* AdSense Placement */}
      <div className="mb-20 h-32 bg-slate-900/20 border border-white/5 rounded-3xl flex items-center justify-center text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] italic">
        Smart Ads • Compliance Optimized Slot
      </div>

      {/* Feature Grid */}
      <div className="space-y-24 pb-20">
        {sections.map((section, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="flex items-end justify-between mb-12 px-2 border-l-4 border-indigo-600 pl-8">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                  {section.title}
                </h2>
                <p className="text-slate-500 mt-2 font-black uppercase tracking-widest text-[10px]">{section.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.features.map((feature) => {
                const isLocked = !user && !feature.free;
                return (
                  <button
                    key={feature.id}
                    onClick={() => onFeatureClick(feature.id)}
                    className={`group relative flex flex-col p-10 bg-slate-900/40 rounded-[2.5rem] border border-white/5 transition-all hover:bg-slate-900 hover:border-indigo-500/50 hover:-translate-y-3 shadow-2xl text-left overflow-hidden ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      {feature.free ? <Sparkles size={16} className="text-emerald-400" /> : <ShieldCheck size={16} className="text-indigo-400" />}
                    </div>
                    
                    <div className="p-5 bg-[#05070a] rounded-3xl mb-8 w-fit shadow-2xl border border-white/5 group-hover:scale-110 transition-transform group-hover:border-indigo-500/30">
                      {React.cloneElement(feature.icon as React.ReactElement, { size: 32 })}
                    </div>
                    
                    <h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">{feature.desc}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className={`text-[10px] font-black uppercase tracking-widest ${feature.free ? 'text-emerald-400' : 'text-indigo-400'}`}>
                        {feature.free ? 'FREE ACCESS' : '10 CREDITS'}
                      </div>
                      <ArrowRight size={18} className="text-slate-700 group-hover:text-white transition-colors" />
                    </div>

                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                         <Lock size={24} className="text-white/40" />
                         <span className="text-[10px] font-black text-white/40 uppercase">Google Sign-In Required</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
