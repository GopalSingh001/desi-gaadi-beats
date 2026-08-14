import React from 'react';
import { Search, Globe, Sliders, Volume2, Plus, Sparkles, Menu } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const Header = ({ onToggleMobileMenu }) => {
  const {
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    setIsSoundboardOpen,
    setIsEqualizerOpen,
    setIsCustomPlaylistModalOpen,
    setActiveTab
  } = useAudio();

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xl">
      
      {/* Mobile Menu Button & Brand Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveTab('home')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d0f17] rounded-[14px] flex items-center justify-center text-xl">
              🛺
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight font-desi text-white">
                {language === 'hi' ? 'देसी गाड़ी बीट्स' : 'DESI GAADI BEATS'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-amber-400/80 font-medium font-mono">
              {language === 'hi' ? 'हाईवे & ड्राइवर प्लेलिस्ट्स' : 'Highway & Driver Audio Network'}
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-lg mx-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'गाना, ऑटो, ट्रक या रोडवेज खोजें...'
                : 'Search auto, truck, roadways, or chai playlists...'
            }
            className="w-full pl-10 pr-8 py-2.5 rounded-full bg-slate-900/90 border border-white/10 text-white placeholder-slate-400 text-xs md:text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Action Controls: Soundboard, Equalizer, Language & Create Playlist */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        
        {/* Soundboard Button */}
        <button
          onClick={() => setIsSoundboardOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300 text-xs font-bold transition shadow-sm"
          title="Desi Horn Soundboard"
        >
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span className="hidden lg:inline">
            {language === 'hi' ? 'हॉर्न बजाओ' : 'Horns [1-6]'}
          </span>
        </button>

        {/* Equalizer / Jhankar */}
        <button
          onClick={() => setIsEqualizerOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 hover:text-amber-300 text-xs font-bold transition shadow-sm"
          title="Equalizer & Jhankar Tuner"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden lg:inline">
            {language === 'hi' ? 'झंकार & बास' : 'Jhankar EQ'}
          </span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:bg-white/15 text-xs font-bold transition"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
        </button>

        {/* Create Playlist Button */}
        <button
          onClick={() => setIsCustomPlaylistModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition shadow-md shadow-amber-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? 'नई लिस्ट' : 'New Playlist'}</span>
        </button>

      </div>
    </header>
  );
};
