import React from 'react';
import { Play } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const PlaylistCard = ({ playlist }) => {
  const {
    currentPlaylist,
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

  const coverImage = playlist.coverImage || playlist.songs?.[0]?.coverArt || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80";

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer rounded-2xl glass-card p-3.5 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Square Cover Art Media Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 bg-slate-900 shadow-md">
        <img
          src={coverImage}
          alt={playlist.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient Dark Gradient on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Left Vehicle Avatar */}
        <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-lg shadow">
          {playlist.icon}
        </div>

        {/* Top Right Tag */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-amber-300 font-mono">
          {playlist.vehicleType}
        </div>

        {/* Bottom Tag inside Cover */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <span className="text-[11px] font-bold text-white drop-shadow-md truncate block">
            {playlist.badge}
          </span>
        </div>

        {/* Hover Floating Play Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={handleQuickPlay}
            style={{ backgroundColor: playlist.accentColor || '#f59e0b' }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-slate-950 shadow-2xl shadow-black transform scale-90 group-hover:scale-100 transition-transform duration-200 hover:scale-110 active:scale-95"
            title="Play Playlist"
          >
            {isCurrentPlaylistActive && isPlaying ? (
              <div className="flex items-center gap-1">
                <span className="w-1 h-3.5 bg-slate-950 rounded-full animate-bounce" />
                <span className="w-1 h-2.5 bg-slate-950 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1 h-3.5 bg-slate-950 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-1">
        <h3 className="text-sm md:text-base font-bold font-desi text-white group-hover:text-amber-400 transition-colors truncate">
          {language === 'hi' ? playlist.hindiTitle : playlist.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-8">
          {playlist.description}
        </p>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>{playlist.songs?.length || 0} Tracks</span>
          <span className="text-amber-400 font-bold truncate max-w-[120px]">
            {playlist.stats?.bassLevel || playlist.category}
          </span>
        </div>
      </div>

    </div>
  );
};
