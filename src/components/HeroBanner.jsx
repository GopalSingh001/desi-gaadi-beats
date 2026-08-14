import React, { useState, useEffect } from 'react';
import { Play, Flame, Volume2, ArrowRight } from 'lucide-react';
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
  const featured = [playlists[0], playlists[1], playlists[2], playlists[3]];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % featured.length);
    }, 8000);
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

  const heroCover = current.coverImage || current.songs?.[0]?.coverArt;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-10 border border-white/8 shadow-2xl bg-[#0c0e18]">
      
      {/* Background Subtle Gradient */}
      <div
        style={{
          background: `radial-gradient(circle at 80% 50%, ${current.accentColor}18 0%, transparent 60%), linear-gradient(135deg, #111422 0%, #090a12 100%)`
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Column: Info & Action */}
        <div className="flex-1 max-w-2xl space-y-4 text-left">
          
          {/* Top Tag & Carousel Dots */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {language === 'hi' ? 'ट्रेंडिंग नंबर 1' : 'FEATURED PLAYLIST'}
            </span>

            <span className="px-3 py-1 rounded-full bg-white/8 text-white/90 text-xs font-semibold border border-white/10">
              {current.badge}
            </span>

            {/* Slide Dots */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
              {featured.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeSlide === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Vehicle Subtitle */}
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
            <span className="text-xl">{current.icon}</span>
            <span>{current.vehicleType}</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-3xl md:text-5xl font-black font-desi text-white tracking-tight leading-tight">
            {language === 'hi' ? current.hindiTitle : current.title}
          </h1>

          {/* Description */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-2 max-w-lg">
            {current.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={handlePlayFeatured}
              className="flex items-center gap-2 px-7 py-3 rounded-full btn-primary text-xs md:text-sm font-black transition transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{language === 'hi' ? 'अभी बजाएं (Play Now)' : 'Listen Now'}</span>
            </button>

            <button
              onClick={handleExplore}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/8 hover:bg-white/15 text-white font-bold text-xs md:text-sm border border-white/12 transition"
            >
              <span>{language === 'hi' ? 'ट्रैक्स देखें' : 'View Tracks'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSoundboardOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/8 hover:bg-white/15 text-slate-200 hover:text-white font-bold text-xs border border-white/12 transition"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'हॉर्न बजाओ' : 'Horns [1-6]'}</span>
            </button>
          </div>

          {/* Stats Footer Row */}
          <div className="pt-2 flex items-center gap-5 text-xs text-slate-400 font-mono">
            <span className="text-slate-300 font-semibold">🎵 {current.stats.tracksCount} Tracks ({current.stats.totalDuration})</span>
            <span className="text-amber-400 font-bold">🔊 {current.stats.bassLevel}</span>
          </div>

        </div>

        {/* Right Column: 3D Artwork Vinyl Display */}
        <div className="relative group shrink-0 hidden md:flex items-center justify-center">
          
          {/* Vinyl Disc Behind */}
          <div className="absolute -right-8 w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#05060a] border-4 border-slate-800 shadow-2xl flex items-center justify-center animate-spin-slow">
            <div className="w-20 h-20 rounded-full border-2 border-slate-700 bg-[#0c0e18] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-amber-400" />
            </div>
          </div>

          {/* Front Album Card */}
          <div
            onClick={handleExplore}
            className="cursor-pointer relative z-10 w-52 h-52 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black group-hover:scale-105 transition-transform duration-300 bg-slate-900"
          >
            <img
              src={heroCover}
              alt={current.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                {current.badge}
              </span>
              <span className="text-sm font-bold text-white truncate">
                {language === 'hi' ? current.hindiTitle : current.title}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
