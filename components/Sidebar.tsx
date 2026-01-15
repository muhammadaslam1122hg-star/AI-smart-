
import React from 'react';
import { 
  Home, 
  Layout, 
  Code, 
  Smartphone, 
  UserCircle, 
  Zap, 
  Image as ImageIcon, 
  Palette, 
  PenTool, 
  Layers, 
  FileJson,
  BookOpen,
  LogIn,
  ShieldCheck,
  CreditCard,
  MonitorPlay,
  PlayCircle,
  Mic2,
  Cpu
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  onSelect: (id: string) => void;
  activeId: string;
  user: UserProfile | null;
  onLogin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, activeId, user, onLogin }) => {
  const sections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'home', label: 'Dashboard', icon: <Home size={18} /> },
      ]
    },
    {
      title: 'FREE UNLIMITED',
      items: [
        { id: 'edusolve', label: 'Edu Problem Solver', icon: <BookOpen size={18} className="text-emerald-400" /> },
        { id: 'json-prompt', label: 'JSON Generator', icon: <FileJson size={18} className="text-emerald-400" /> },
      ]
    },
    {
      title: 'BUILDER STUDIO',
      items: [
        { id: 'website', label: 'Website Builder', icon: <Layout size={18} /> },
        { id: 'webapp', label: 'Web App Builder', icon: <Code size={18} /> },
        { id: 'mobile', label: 'Mobile App Builder', icon: <Smartphone size={18} /> },
        { id: 'agent', label: 'AI Agent Creator', icon: <UserCircle size={18} /> },
      ]
    },
    {
      title: 'CREATIVE & UTILITY',
      items: [
        { id: 'text-image', label: 'Text to Image', icon: <ImageIcon size={18} /> },
        { id: 'photo-edit', label: 'Photo Editing', icon: <Palette size={18} /> },
        { id: 'designer', label: 'UI Designer Pro', icon: <PenTool size={18} /> },
        { id: 'tool-creator', label: 'Tool Creator', icon: <Cpu size={18} /> },
        { id: 'text-video', label: 'Text to Video', icon: <MonitorPlay size={18} /> },
        { id: 'text-voice', label: 'Voice AI', icon: <Mic2 size={18} /> },
      ]
    }
  ];

  return (
    <div className="w-72 h-full bg-[#05070a] border-r border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
      <div className="px-8 mb-12 flex items-center gap-4">
        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-900/20">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <div>
          <h1 className="font-black text-lg leading-tight tracking-tighter text-white uppercase italic">SMART PLATFORM</h1>
          <p className="text-[9px] text-slate-600 font-black tracking-[0.2em] uppercase">Enterprise AI SaaS</p>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="mb-2">
            <h2 className="px-8 mb-4 text-[10px] font-black text-slate-700 tracking-[0.15em] uppercase">
              {section.title}
            </h2>
            <nav className="px-4">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeId === item.id 
                      ? 'bg-indigo-600/10 text-indigo-400 shadow-inner' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-white/5 p-8 bg-slate-950/40">
        {!user ? (
          <button 
            onClick={onLogin}
            className="w-full bg-white text-black font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl"
          >
            <LogIn size={16} /> SIGN IN WITH GOOGLE
          </button>
        ) : (
          <div className="p-5 bg-indigo-600/5 rounded-2xl border border-indigo-500/10 shadow-inner">
              <div className="flex items-center gap-3 mb-3">
                  <CreditCard size={14} className="text-indigo-400" />
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Balance</h3>
              </div>
              <div className="text-3xl font-black text-white">{user.credits} CR</div>
              <div className="text-[9px] text-slate-600 font-bold mt-2">AUTO-RESET ACTIVE</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
