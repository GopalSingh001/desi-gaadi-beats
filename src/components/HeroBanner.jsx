import React, { useState, useEffect } from 'react';
import { Play, Flame, Sparkles, Volume2, ArrowRight, Radio, Disc3 } from 'lucide-react';
import { playlists } from '../data/playlistsData';
import { useAudio } from '../context/AudioContext';

export const HeroBanner = () => {
  const {
    playSong,
    setCurrentPlaylist,
    setActiveTab,
    setIsSoundboardOpen,
    language
  } = useAudio();

  const [activeSlide, setActiveSlide] = useState(0);
  const featuredPlaylists = [playlists[0], playlists[1], playlists[2]];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % featuredPlaylists.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredPlaylists.length]);

  const current = featuredPlaylists[activeSlide];

  const handlePlayFeatured = () => {
    setCurrentPlaylist(current);
    if (current.songs && current.songs.length > 0) {
      playSong(current.songs[0], current);
    }
  };

  const handleExplore = () => {
    setCurrentPlaylist(current);
    setActiveTab('playlist-detail');
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
      
      {/* Background Graphic & Glow */}
      <div
        style={{
          background: current.bgPattern || 'linear-gradient(135deg, #1f1406 0%, #3d2309 100%)'
        }}
        className="relative p-6 md:p-10 lg:p-12 transition-all duration-700 min-h-[300px] md:min-h-[340px] flex flex-col justify-between"
      >
        {/* Ambient Glow Orbs */}
        <div
          style={{ backgroundColor: current.accentColor }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-30 pointer-events-none"
        />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-400">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              {language === 'hi' ? 'ट्रेंडिंग हाईवे चार्ट' : 'HOT HIGHWAY SPOTLIGHT'}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-white/90">
              {current.badge}
            </span>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {featuredPlaylists.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 my-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl md:text-5xl">{current.icon}</span>
            <span className="text-sm font-bold tracking-widest uppercase text-amber-300 font-mono">
              {current.vehicleType}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white font-desi tracking-wide leading-tight drop-shadow-md">
            {language === 'hi' ? current.hindiTitle : current.title}
          </h1>

          <p className="mt-2 md:mt-3 text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-2 max-w-xl">
            {current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3.5 mt-6 flex-wrap">
            <button
              onClick={handlePlayFeatured}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all transform hover:scale-105 shadow-xl shadow-amber-500/25"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{language === 'hi' ? 'अभी बजाएं (Play All)' : 'Play Album'}</span>
            </button>

            <button
              onClick={handleExplore}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/10 transition"
            >
              <span>{language === 'hi' ? 'ट्रैक्स देखें' : 'View Tracks'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSoundboardOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/30 transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'प्रेशर हॉर्न' : 'Blow Horn'}</span>
            </button>
          </div>
        </div>

        {/* Footer info stats */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="font-mono">
              🎵 {current.stats.tracksCount} Tracks ({current.stats.totalDuration})
            </span>
            <span className="font-mono text-amber-300">
              🔊 {current.stats.bassLevel}
            </span>
          </div>
          <span className="italic text-slate-400">
            Curated by {current.curator}
          </span>
        </div>

      </div>
    </div>
  );
};
