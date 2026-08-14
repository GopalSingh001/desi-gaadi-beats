import React from 'react';
import { Play, Disc3, Sparkles, Volume2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const PlaylistCard = ({ playlist }) => {
  const {
    currentPlaylist,
    currentSong,
    isPlaying,
    playSong,
    setCurrentPlaylist,
    setActiveTab,
    language
  } = useAudio();

  const isCurrentPlaylistActive = currentPlaylist?.id === playlist.id;

  const handleCardClick = () => {
    setCurrentPlaylist(playlist);
    setActiveTab('playlist-detail');
  };

  const handleQuickPlay = (e) => {
    e.stopPropagation();
    setCurrentPlaylist(playlist);
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer rounded-3xl bg-[#131622] border border-white/5 hover:border-amber-500/40 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/80 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div
        style={{
          background: `radial-gradient(circle at top right, ${playlist.accentColor}25 0%, transparent 70%)`
        }}
        className="absolute inset-0 pointer-events-none transition-opacity group-hover:opacity-100 opacity-60"
      />

      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:border-amber-400/40 transition-transform">
            {playlist.icon}
          </div>
          
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-amber-300/90 border border-white/10 backdrop-blur-md">
            {playlist.badge || playlist.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold font-desi text-white group-hover:text-amber-400 transition-colors leading-snug">
          {language === 'hi' ? playlist.hindiTitle : playlist.title}
        </h3>

        {/* Tagline / Description */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {playlist.description}
        </p>
      </div>

      {/* Footer Info & Quick Play Button */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="text-[11px] text-slate-400 space-y-0.5">
          <div className="font-mono text-slate-300">
            {playlist.songs?.length || 0} {language === 'hi' ? 'गाने' : 'tracks'}
          </div>
          <div className="text-amber-400/80 font-medium">
            {playlist.stats?.bassLevel || playlist.vehicleType}
          </div>
        </div>

        {/* Play Floating Button */}
        <button
          onClick={handleQuickPlay}
          style={{ backgroundColor: playlist.accentColor || '#f59e0b' }}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-black/50 transform group-hover:scale-110 transition-transform active:scale-95"
          title="Play Playlist"
        >
          {isCurrentPlaylistActive && isPlaying ? (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-4 bg-slate-950 rounded-full animate-bounce" />
              <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-4 bg-slate-950 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          ) : (
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          )}
        </button>
      </div>

    </div>
  );
};
