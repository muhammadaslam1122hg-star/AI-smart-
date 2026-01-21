import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FeatureModal from './components/FeatureModal';
import { FeatureType, UserProfile } from './types';
import { ShieldCheck, Zap, LogIn, Activity, Cpu } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, Auth } from 'firebase/auth';
import { geminiService } from './services/gemini';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID
};

const App: React.FC = () => {
  const [activeSidebarId, setActiveSidebarId] = useState('home');
  const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);

  useEffect(() => {
    let auth: Auth;
    try {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      setAuthInstance(auth);
    } catch (error) {
      console.error("Firebase Auth Init Failed:", error);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('smart_token', token);
          
          const status = await geminiService.getUserStatus();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Neural Architect',
            photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=6366f1&color=fff`,
            credits: status?.credits ?? 0,
            lastReset: status?.last_reset ?? Date.now(),
            plan: 'Free'
          });
        } catch (err) {
          console.error("Profile sync failed:", err);
        }
      } else {
        setUser(null);
        localStorage.removeItem('smart_token');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    if (!authInstance) {
      alert("System security module initializing. Please wait.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(authInstance, provider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Authentication error. Please verify your connection.");
    }
  };

  const handleFeatureClick = (type: FeatureType) => {
    if (!user) {
      handleGoogleLogin();
      return;
    }
    setActiveFeature(type);
  };

  const refreshCredits = async () => {
    const status = await geminiService.getUserStatus();
    if (status && user) {
      setUser({ ...user, credits: status.credits });
    }
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

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#030407] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
                <ShieldCheck className="text-indigo-500" size={32} />
             </div>
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Neural Core</p>
            <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Initialising Secure Protocol</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#030407] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar 
        onSelect={handleSidebarSelect} 
        activeId={activeSidebarId} 
        user={user} 
        onLogin={handleGoogleLogin} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/[0.03] flex items-center justify-between px-10 bg-[#030407]/40 backdrop-blur-2xl sticky top-0 z-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <Cpu size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-black tracking-tighter text-white uppercase italic leading-none">Smart Studio</div>
                <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mt-1">v2.5 Enterprise</div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <div className="h-6 w-px bg-white/[0.05]"></div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Active</span>
              </div>
              {user && (
                <div className="group flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full cursor-pointer hover:bg-indigo-500/20 transition-all">
                  <Activity size={12} className="text-indigo-400 group-hover:rotate-45 transition-transform" />
                  <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">{user.credits} CR</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {!user ? (
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black transition-all hover:bg-indigo-50 hover:scale-[1.02] shadow-xl active:scale-95"
              >
                <LogIn size={14} /> SIGN IN
              </button>
            ) : (
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-3 bg-slate-900/40 px-4 py-2 rounded-2xl border border-white/[0.03]">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Deep Logic</span>
                  <button 
                    onClick={() => setIsDeepThinking(!isDeepThinking)}
                    className={`w-9 h-5 rounded-full relative transition-all duration-500 ${isDeepThinking ? 'bg-indigo-600' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-500 ${isDeepThinking ? 'left-5' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="p-1 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-lg object-cover" />
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {activeSidebarId === 'home' ? (
            <Dashboard onFeatureClick={handleFeatureClick} user={user} />
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center bg-[#030407] relative overflow-hidden h-full">
                <div className="z-10 text-center px-8">
                    <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <Zap size={32} className="text-indigo-500 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 italic tracking-tighter uppercase">{activeSidebarId.replace('-', ' ')}</h2>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm">This module is being initialized through the neural dashboard interface.</p>
                    <button 
                      onClick={() => setActiveSidebarId('home')}
                      className="mt-10 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/20 active:scale-95 tracking-widest uppercase"
                    >
                      Return to Dashboard
                    </button>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px]"></div>
             </div>
          )}
        </main>

        <footer className="mt-auto border-t border-white/5 bg-[#030407] p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center gap-8 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-indigo-400 transition-colors">Platform</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Manifesto</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            </div>
            <p className="text-[9px] text-slate-700 font-mono font-bold tracking-widest">© 2025 MANIFEST AI • SECURE NEURAL ARCHITECTURE</p>
          </div>
        </footer>
      </div>

      {activeFeature && (
        <FeatureModal 
          type={activeFeature} 
          onClose={() => setActiveFeature(null)} 
          isThinking={isDeepThinking}
          onSuccess={refreshCredits}
        />
      )}
    </div>
  );
};

export default App;