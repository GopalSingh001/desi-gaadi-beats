import React, { useState, useEffect } from 'react';
import { Play, Flame, Sparkles, Volume2, ArrowRight } from 'lucide-react';
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
  const featured = [playlists[0], playlists[1], playlists[2]];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % featured.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const current = featured[activeSlide];

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

  const heroImage = current.songs?.[0]?.coverArt || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl bg-[#0b0e17]">
      
      {/* Background Image with Cinematic Dark Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={current.title}
          className="w-full h-full object-cover object-center filter brightness-[0.35] scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent" />
      </div>

      {/* Ambient Color Glow */}
      <div
        style={{ backgroundColor: current.accentColor || '#f59e0b' }}
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[120px] opacity-25 pointer-events-none"
      />

      {/* Content Body */}
      <div className="relative z-10 p-6 md:p-10 lg:p-12 min-h-[320px] md:min-h-[360px] flex flex-col justify-between">
        
        {/* Top Badges & Carousel Dots */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-xs font-bold text-amber-300 font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {language === 'hi' ? 'ट्रेंडिंग हाईवे चार्ट #1' : '#1 SPOTLIGHT'}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white/90">
              {current.badge}
            </span>
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Center Title & Info */}
        <div className="my-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">{current.icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 font-mono">
              {current.vehicleType}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white font-desi leading-tight drop-shadow-lg">
            {language === 'hi' ? current.hindiTitle : current.title}
          </h1>

          <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-2 max-w-xl">
            {current.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3.5 mt-6 flex-wrap">
            <button
              onClick={handlePlayFeatured}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm transition-all transform hover:scale-105 shadow-xl shadow-amber-500/25 active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{language === 'hi' ? 'अभी बजाएं (Play Now)' : 'Listen Now'}</span>
            </button>

            <button
              onClick={handleExplore}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/15 transition"
            >
              <span>{language === 'hi' ? 'ट्रैक्स देखें' : 'View Tracks'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSoundboardOpen(true)}
              className="flex items-center gap-2 px-4 py-3.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/30 transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'हॉर्न बजाओ' : 'Blast Horn'}</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">🎵 {current.stats.tracksCount} Tracks ({current.stats.totalDuration})</span>
            <span className="text-amber-400 font-bold">🔊 {current.stats.bassLevel}</span>
          </div>
          <span className="italic text-slate-400">
            Curated by {current.curator}
          </span>
        </div>

      </div>

    </div>
  );
};
