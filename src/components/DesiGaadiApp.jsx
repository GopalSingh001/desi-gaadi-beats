import React, { useState, useEffect, useRef } from 'react';
import { vehicleCategories } from '../data/playlistsData';
import {
  Search, Volume2, Globe, Play, Pause,
  Heart, Share2, Star, Clock, Music, Radio,
  Sparkles, Flame, Sun, Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DesiGaadiApp = () => {
  const [activeIdx, setActiveIdx] = useState(3); // Default Barber Shop
  const [isDarkMode, setIsDarkMode] = useState(true); // Black / White Theme
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [language, setLanguage] = useState('hi');

  const activePlaylist = vehicleCategories[activeIdx];

  const handleSelectPlaylist = (idx) => {
    setActiveIdx(idx);
    setIsPlaying(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleHorn = () => {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.7 }
    });

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(320, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activePlaylist.name,
        text: `Listen to ${activePlaylist.name} on Desi Gaadi Beats!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const filteredPlaylists = vehicleCategories.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      return p.name.toLowerCase().includes(q) ||
        p.hindiName.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#07090e] text-white' : 'bg-[#f4f6fb] text-slate-900 light-theme'}`}>
      
      {/* 1. TOP NAVBAR */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#080a10]/95 border-white/8' : 'bg-white/95 border-slate-200 shadow-sm'
      }`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 text-xl font-black shadow-md shadow-amber-500/20">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base sm:text-lg font-black tracking-tight font-desi ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                DESI GAADI BEATS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-400/20 text-amber-500 font-bold border border-amber-400/30">
                PRO
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-mono tracking-wider hidden sm:block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Highway & Driver Audio Network
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in 5 playlists..."
              className={`w-full pl-4 pr-10 py-2 rounded-full border text-xs transition-all outline-none ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/8 focus:bg-white/10 border-white/10 focus:border-amber-400/50 text-white placeholder-slate-400'
                  : 'bg-slate-100 hover:bg-slate-200/70 focus:bg-white border-slate-200 focus:border-amber-500 text-slate-900 placeholder-slate-500 shadow-inner'
              }`}
            />
            <Search className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
        </div>

        {/* Actions & Theme Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* WHITE / BLACK THEME TOGGLE BUTTON */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition transform active:scale-95 border ${
              isDarkMode
                ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/30'
                : 'bg-slate-900 text-white border-slate-800 shadow-sm'
            }`}
            title={isDarkMode ? 'Switch to White (Light) Theme' : 'Switch to Black (Dark) Theme'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>White Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                <span>Black Theme</span>
              </>
            )}
          </button>

          {/* Horn Button */}
          <button
            onClick={handleHorn}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-semibold transition transform active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">हॉर्न बजाओ</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'hi' ? 'हिंदी' : 'EN'}</span>
          </button>

        </div>

      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-12">
        
        {/* A. 5 VEHICLE STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {vehicleCategories.map((v, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <div
                key={v.id}
                onClick={() => handleSelectPlaylist(idx)}
                style={{
                  borderColor: isSelected ? v.color : undefined
                }}
                className={`group cursor-pointer p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 border-2 transform active:scale-95 ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-gradient-to-b from-amber-500/15 to-transparent shadow-lg shadow-amber-500/15 scale-105'
                      : 'bg-amber-500/15 border-amber-500 shadow-md scale-105'
                    : isDarkMode
                      ? 'bg-[#0f121e]/80 hover:bg-[#151928] border-white/8 hover:border-white/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                  {v.icon}
                </span>
                <span className={`text-xs font-bold truncate w-full ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {v.name}
                </span>
                <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-amber-500 font-bold' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {v.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* B. HERO SPOTLIGHT WITH REAL YOUTUBE PLAYER */}
        <div className={`relative rounded-3xl overflow-hidden border shadow-2xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-[#121628] via-[#0d101a] to-[#07090e] border-white/10'
            : 'bg-white border-slate-200 shadow-xl'
        }`}>
          
          {/* Ambient Glow */}
          <div
            style={{ backgroundColor: activePlaylist.color }}
            className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${isDarkMode ? 'opacity-25' : 'opacity-15'}`}
          />

          {/* Left: YouTube Video Stage Container */}
          <div className="relative w-full lg:w-[420px] aspect-video rounded-2xl overflow-hidden shrink-0 border-2 border-white/15 shadow-2xl bg-black">
            <iframe
              key={`${activePlaylist.id}-${activePlaylist.youtubeVideoId}`}
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/${activePlaylist.youtubeVideoId}?list=${activePlaylist.youtubePlaylistId}&autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&rel=0&modestbranding=1`}
              title={activePlaylist.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Right: Info & CTA Controls */}
          <div className="flex-1 space-y-4 text-left w-full">
            
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                isDarkMode
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-purple-100 text-purple-700 border-purple-300'
              }`}>
                <Sparkles className="w-3.5 h-3.5" />
                NOW PLAYING
              </span>
            </div>

            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black font-desi tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                {activePlaylist.name.toUpperCase()}
              </h1>
              <p className="text-sm font-semibold text-amber-500 font-mono mt-1">
                {activePlaylist.hindiName} • {activePlaylist.tag}
              </p>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {activePlaylist.description}
            </p>

            {/* Metadata Row */}
            <div className={`flex items-center gap-5 text-xs font-mono flex-wrap pt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className={`flex items-center gap-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <Music className="w-3.5 h-3.5 text-amber-500" />
                {activePlaylist.count}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activePlaylist.durationText}
              </span>
              <span className="flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                {activePlaylist.plays}
              </span>
              <span className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                {activePlaylist.rating}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <button
                onClick={handleTogglePlay}
                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-black text-xs sm:text-sm transition-all transform active:scale-95 shadow-xl ${
                  isPlaying
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/40 ring-4 ring-amber-400/30 scale-105'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-500/25 hover:scale-105'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950 text-slate-950 stroke-[3]" />
                    <span className="text-slate-950 font-black tracking-wide">Pause Playlist</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 text-slate-950 ml-0.5" />
                    <span className="text-slate-950 font-black tracking-wide">Play Playlist</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1.5 px-5 py-3.5 rounded-full font-bold text-xs border transition ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>Save</span>
              </button>

              <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 px-5 py-3.5 rounded-full font-bold text-xs border transition ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

          </div>

        </div>

        {/* C. 5 PLAYLISTS GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-base sm:text-lg font-black font-desi flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              <Flame className="w-5 h-5 text-amber-500" />
              <span>All 5 Playlists</span>
            </h3>
            <span className="text-xs text-amber-500 font-mono font-bold">
              5 Verified Tracks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {filteredPlaylists.map((p, idx) => {
              const isCurrentPlaying = activeIdx === idx;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlaylist(idx)}
                  className={`group relative cursor-pointer p-3.5 rounded-2xl flex flex-col justify-between transition-all duration-300 border ${
                    isCurrentPlaying
                      ? isDarkMode
                        ? 'bg-amber-500/10 border-amber-400/60 shadow-xl shadow-amber-500/15 scale-[1.02]'
                        : 'bg-amber-50 border-amber-500 shadow-md scale-[1.02]'
                      : isDarkMode
                        ? 'bg-[#0f121e]/80 hover:bg-[#151928] border-white/8 hover:border-white/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Artwork with Play/Pause Button */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-black shadow-md">
                    <img
                      src={p.coverArt}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Floating Button */}
                    <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      {isCurrentPlaying && isPlaying ? (
                        <Pause className="w-4 h-4 fill-slate-950" />
                      ) : (
                        <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h4 className={`text-xs sm:text-sm font-black truncate group-hover:text-amber-500 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {p.name.toUpperCase()}
                    </h4>
                    <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {p.hindiName}
                    </p>
                    <div className={`flex items-center justify-between text-[10px] font-mono pt-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span>{p.count}</span>
                      <span className="text-yellow-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        {p.rating}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

    </div>
  );
};
