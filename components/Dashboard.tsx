
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
  MonitorPlay,
  Globe,
  Database,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { FeatureType, UserProfile } from '../types';

interface DashboardProps {
  onFeatureClick: (type: FeatureType) => void;
  user: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onFeatureClick, user }) => {
  const sections = [
    {
      title: 'Neural Foundation',
      subtitle: 'Unlimited essential tools for every creator',
      features: [
        { id: FeatureType.SMART_QUESTION, title: 'EduSolver AI', icon: <BookOpen className="text-emerald-400" />, desc: 'Cognitive reasoning for complex academic problems', free: true },
        { id: FeatureType.JSON_PROMPT_GENERATOR, title: 'Schema Architect', icon: <FileJson className="text-yellow-400" />, desc: 'Generate enterprise-grade JSON schemas and prompts', free: true },
      ]
    },
    {
      title: 'Engineering Suite',
      subtitle: 'Industrial power tools for developers and builders',
      features: [
        { id: FeatureType.WEBSITE_BUILDER, title: 'Site Forge', icon: <Layout className="text-blue-500" />, desc: 'Full-stack responsive landing pages & blogs', free: false },
        { id: FeatureType.WEB_APP_BUILDER, title: 'SaaS Builder', icon: <Code className="text-purple-500" />, desc: 'Build complex dashboards and data platforms', free: false },
        { id: FeatureType.MOBILE_APP_BUILDER, title: 'Native Flux', icon: <Smartphone className="text-pink-400" />, desc: 'Cross-platform mobile application architecture', free: false },
        { id: FeatureType.AI_AGENT_CREATOR, title: 'Neural Agents', icon: <UserCircle className="text-indigo-400" />, desc: 'Deploy autonomous task-driven AI entities', free: false },
      ]
    },
    {
      title: 'Cinematic Foundry',
      subtitle: 'High-fidelity visual and motion production',
      features: [
        { id: FeatureType.AI_VIDEO_GENERATOR, title: 'Video Pro v3', icon: <PlayCircle className="text-red-500" />, desc: 'Studio quality 1080p cinematic video generation', free: false },
        { id: FeatureType.TEXT_TO_VIDEO, title: 'Motion Script', icon: <MonitorPlay className="text-orange-500" />, desc: 'Convert text scripts into dynamic video sequences', free: false },
        { id: FeatureType.PHOTO_TO_VIDEO, title: 'Animate Pro', icon: <Camera className="text-blue-400" />, desc: 'Add realistic motion to static high-res photos', free: false },
        { id: FeatureType.TEXT_TO_IMAGE, title: 'Vision 2.5', icon: <ImageIcon className="text-green-500" />, desc: 'Ultra-photorealistic neural image generation', free: false },
      ]
    },
    {
      title: 'Design & Synthesis',
      subtitle: 'Professional utility for UI, audio and assets',
      features: [
        { id: FeatureType.PHOTO_EDITING, title: 'Neural Canvas', icon: <Palette className="text-cyan-400" />, desc: 'Advanced AI-powered image editing & correction', free: false },
        { id: FeatureType.DESIGNER_TOOL, title: 'Interface AI', icon: <PenTool className="text-fuchsia-400" />, desc: 'Generate complete Figma-ready UI components', free: false },
        { id: FeatureType.TOOL_CREATOR, title: 'Logic Forge', icon: <Cpu className="text-slate-400" />, desc: 'Build your own custom AI-powered web tools', free: false },
        { id: FeatureType.TEXT_TO_VOICE, title: 'Acoustic AI', icon: <Mic2 className="text-rose-400" />, desc: 'Hyper-realistic multi-speaker voice synthesis', free: false },
      ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-12 bg-[#030407] custom-scrollbar">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-[#0a0c14] border border-white/[0.03] p-16 mb-24">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-l from-indigo-600/20 to-transparent"></div>
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] mb-10">
            <Zap size={12} className="fill-indigo-400" /> System Uplink Established • 2.5.1
          </div>
          <h1 className="text-7xl font-black text-white mb-10 leading-[0.95] tracking-tighter">
            Architect your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-white italic">AI Future.</span>
          </h1>
          <p className="text-slate-400 text-xl mb-12 leading-relaxed max-w-2xl font-medium">
            Manifest AI Studio is a unified orchestration layer for advanced neural generation. Access 14 specialized modules to build, create, and automate.
          </p>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onFeatureClick(FeatureType.SMART_QUESTION)}
              className="bg-white hover:bg-slate-200 text-black font-black py-5 px-12 rounded-2xl transition-all hover:scale-[1.03] shadow-2xl shadow-white/5 flex items-center gap-4 text-xs tracking-widest active:scale-95"
            >
              INITIALIZE NEURAL CORE <ChevronRight size={18} />
            </button>
            <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0c14] bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-[#0a0c14] bg-indigo-600 flex items-center justify-center text-[10px] font-black">
                 +2k
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-32 pb-32">
        {sections.map((section, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="flex items-end justify-between mb-16 px-4">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-white italic uppercase italic">
                  {section.title}
                </h2>
                <div className="h-1 w-12 bg-indigo-600 rounded-full mt-3 mb-4"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">{section.subtitle}</p>
              </div>
              <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                View Documentation <ExternalLink size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.features.map((feature) => {
                const isLocked = !user && !feature.free;
                return (
                  <button
                    key={feature.id}
                    onClick={() => onFeatureClick(feature.id)}
                    className={`group relative flex flex-col p-10 bg-[#0a0c14] rounded-[2.5rem] border border-white/[0.03] transition-all hover:bg-[#11131a] hover:border-indigo-500/40 hover:-translate-y-2 shadow-xl text-left overflow-hidden ${isLocked ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      {feature.free ? <Sparkles size={14} className="text-emerald-400" /> : <ShieldCheck size={14} className="text-indigo-400" />}
                    </div>
                    
                    <div className="w-14 h-14 rounded-2xl bg-[#030407] border border-white/[0.05] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-500 shadow-inner">
                      {React.cloneElement(feature.icon as React.ReactElement, { size: 24 })}
                    </div>
                    
                    <h3 className="text-lg font-black text-white mb-3 tracking-tighter">{feature.title}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-10">{feature.desc}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className={`text-[8px] font-black uppercase tracking-[0.2em] ${feature.free ? 'text-emerald-500' : 'text-indigo-400'}`}>
                        {feature.free ? 'No-Cost Module' : 'Premium - 10 CR'}
                      </div>
                      <div className="w-8 h-8 rounded-full border border-white/[0.05] flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                        <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 z-10 transition-all duration-500 group-hover:backdrop-blur-none">
                         <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                           <Lock size={18} className="text-white/60" />
                         </div>
                         <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Sync Required</span>
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
