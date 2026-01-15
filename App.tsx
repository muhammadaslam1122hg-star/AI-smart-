
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FeatureModal from './components/FeatureModal';
import { FeatureType, UserProfile } from './types';
import { Search, Bell, Share2, Github, LogIn, ShieldCheck, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeSidebarId, setActiveSidebarId] = useState('home');
  const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDeepThinking, setIsDeepThinking] = useState(false);

  // Credit & Auth Synchronization Logic
  useEffect(() => {
    const savedUser = localStorage.getItem('smart_platform_user');
    if (savedUser) {
      const parsedUser: UserProfile = JSON.parse(savedUser);
      
      // Check for 24h Credit Reset
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (now - parsedUser.lastReset > twentyFourHours) {
        parsedUser.credits = 100;
        parsedUser.lastReset = now;
        localStorage.setItem('smart_platform_user', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    }
  }, []);

  const handleGoogleLogin = () => {
    // Simulate Google Authentication
    const newUser: UserProfile = {
      uid: 'google_' + Math.random().toString(36).substr(2, 9),
      email: 'user@gmail.com',
      displayName: 'Smart User',
      photoURL: 'https://ui-avatars.com/api/?name=Smart+User&background=6366f1&color=fff',
      credits: 100,
      lastReset: Date.now(),
      plan: 'Free'
    };
    setUser(newUser);
    localStorage.setItem('smart_platform_user', JSON.stringify(newUser));
  };

  const deductCredits = (amount: number) => {
    if (!user) return false;
    if (user.credits < amount) {
      alert("Insufficient Credits. Please wait 24h for a reset.");
      return false;
    }
    const updatedUser = { ...user, credits: user.credits - amount };
    setUser(updatedUser);
    localStorage.setItem('smart_platform_user', JSON.stringify(updatedUser));
    return true;
  };

  const handleFeatureClick = (type: FeatureType) => {
    if (!user) {
      alert("Please Sign in with Google to use Smart Platform features.");
      return;
    }
    setActiveFeature(type);
  };

  const handleSidebarSelect = (id: string) => {
    setActiveSidebarId(id);
    const idMap: Record<string, FeatureType> = {
      'website': FeatureType.WEBSITE_BUILDER,
      'webapp': FeatureType.WEB_APP_BUILDER,
      'mobile': FeatureType.MOBILE_APP_BUILDER,
      'agent': FeatureType.AI_AGENT_CREATOR,
      'text-image': FeatureType.TEXT_TO_IMAGE,
      'photo-edit': FeatureType.PHOTO_EDITING,
      'designer': FeatureType.DESIGNER_TOOL,
      'tool-creator': FeatureType.TOOL_CREATOR,
      'text-video': FeatureType.TEXT_TO_VIDEO,
      'text-voice': FeatureType.TEXT_TO_VOICE,
      'json-prompt': FeatureType.JSON_PROMPT_GENERATOR,
      'edusolve': FeatureType.SMART_QUESTION
    };

    if (idMap[id]) {
      handleFeatureClick(idMap[id]);
      setActiveSidebarId('home');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#05070a] text-slate-200 overflow-hidden font-sans">
      <Sidebar 
        onSelect={handleSidebarSelect} 
        activeId={activeSidebarId} 
        user={user} 
        onLogin={handleGoogleLogin} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#05070a]/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <ShieldCheck size={18} className="text-white" />
              </div>
              <div className="text-sm font-black tracking-tight text-white uppercase italic">Smart Platform</div>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Neural Engine Live
              </div>
              {user && (
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400">
                  {user.credits} CREDITS REMAINING
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {!user ? (
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-xl text-xs font-black transition-all hover:bg-slate-200 shadow-xl"
              >
                <LogIn size={16} /> Continue with Google
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-900/40 px-3 py-1.5 rounded-full border border-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deep Logic</span>
                  <button 
                    onClick={() => setIsDeepThinking(!isDeepThinking)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${isDeepThinking ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDeepThinking ? 'left-4.5' : 'left-0.5'}`}></div>
                  </button>
                </div>
                <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-xl border border-white/10 shadow-lg" />
              </div>
            )}
          </div>
        </header>

        {/* Workspace Area */}
        {activeSidebarId === 'home' ? (
          <Dashboard onFeatureClick={handleFeatureClick} user={user} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#05070a] relative overflow-hidden">
             <div className="z-10 text-center px-8">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] border border-white/5 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                   <Zap size={32} className="text-indigo-500 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{activeSidebarId.toUpperCase()} MODULE</h2>
                <p className="text-slate-500 max-w-sm mx-auto">Please access the primary dashboard for feature initialization.</p>
                <button 
                  onClick={() => setActiveSidebarId('home')}
                  className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/20"
                >
                  Return to Dashboard
                </button>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px]"></div>
          </div>
        )}

        {/* AdSense Compliant Footer */}
        <footer className="mt-auto border-t border-white/5 bg-[#05070a] p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              <a href="#" className="hover:text-indigo-400 transition-colors">Home</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">About Us</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Disclaimer</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">DMCA</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a>
            </div>
            <p className="text-[10px] text-slate-700 font-mono">© 2025 SMART PLATFORM • SECURE NEURAL ARCHITECTURE</p>
          </div>
        </footer>
      </div>

      {/* Feature Production Modal */}
      {activeFeature && (
        <FeatureModal 
          type={activeFeature} 
          onClose={() => setActiveFeature(null)} 
          isThinking={isDeepThinking}
          onSuccess={() => deductCredits(10)} // Only for limited features (logic in modal)
        />
      )}
    </div>
  );
};

export default App;
