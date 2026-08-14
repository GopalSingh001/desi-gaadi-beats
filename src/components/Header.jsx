import React from 'react';
import { Search, Volume2, Sliders, Globe, Plus, Menu, Radio, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const Header = ({ onToggleMobileSidebar }) => {
  const {
    searchQuery,
    setSearchQuery,
    language,
    toggleLanguage,
    setIsCustomPlaylistModalOpen,
    setIsSoundboardOpen,
    setIsEqualizerOpen,
    isBassBoost,
    isJhankar
  } = useAudio();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#08090e]/85 border-b border-white/8 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      
      {/* Left: Mobile Menu & Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-lg">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white font-desi">DESI GAADI BEATS</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                PRO
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-wider">
              INDIAN HIGHWAY & DRIVER AUDIO
            </span>
          </div>
        </div>
      </div>

      {/* Center: Clean Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'गाना, ऑटो, ट्रक, या कलाकार खोजें...' : 'Search songs, auto, truck, or roadways...'}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 hover:bg-white/8 focus:bg-white/10 border border-white/10 focus:border-amber-400/50 text-xs text-white placeholder-slate-400 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2.5">
        
        {/* Soundboard Pill */}
        <button
          onClick={() => setIsSoundboardOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition"
          title="Pressure Horns (Keys 1-6)"
        >
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'hi' ? 'हॉर्न [1-6]' : 'Horns [1-6]'}</span>
        </button>

        {/* Equalizer Pill */}
        <button
          onClick={() => setIsEqualizerOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            isBassBoost || isJhankar
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border-white/10'
          }`}
          title="Jhankar & Bass Equalizer"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{language === 'hi' ? 'झंकार EQ' : 'Jhankar EQ'}</span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
        </button>

        {/* New Playlist CTA */}
        <button
          onClick={() => setIsCustomPlaylistModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full btn-primary text-xs font-bold transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'hi' ? 'नई प्लेलिस्ट' : 'New Playlist'}</span>
        </button>

      </div>

    </header>
  );
};
