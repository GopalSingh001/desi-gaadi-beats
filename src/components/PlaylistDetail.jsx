import React from 'react';
import { Play, Shuffle, Heart, Share2, Sparkles, ArrowLeft, Clock, Music } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const PlaylistDetail = ({ playlist, onBack }) => {
  const {
    currentSong,
    isPlaying,
    playSong,
    toggleLikeSong,
    isSongLiked,
    isShuffle,
    toggleShuffle,
    language
  } = useAudio();

  if (!playlist) return null;

  const handlePlayAll = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      if (!isShuffle) toggleShuffle();
      const randomIndex = Math.floor(Math.random() * playlist.songs.length);
      playSong(playlist.songs[randomIndex], playlist);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: playlist.title,
        text: `Listen to ${playlist.title} on Desi Gaadi Beats!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Playlist link copied to clipboard!');
    }
  };

  const coverImage = playlist.coverImage || playlist.songs?.[0]?.coverArt || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'सभी प्लेलिस्ट्स पर वापस जाएं' : 'Back to Playlists'}</span>
        </button>
      </div>

      {/* Hero Header Showcase */}
      <div className="relative rounded-3xl p-6 md:p-8 lg:p-10 bg-[#0e101a] border border-white/8 shadow-2xl overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div
          style={{ backgroundColor: playlist.accentColor || '#f59e0b' }}
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[120px] opacity-15 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 lg:gap-8">
          
          {/* Large Square Cover Art */}
          <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden shrink-0 border border-white/15 shadow-2xl shadow-black bg-slate-900">
            <img
              src={coverImage}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-xl shadow">
              {playlist.icon}
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-3">
            
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
                {playlist.vehicleType}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/8 text-white/90 text-xs font-semibold border border-white/10">
                {playlist.badge}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black font-desi text-white tracking-tight leading-tight">
              {language === 'hi' ? playlist.hindiTitle : playlist.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {playlist.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              <span>🎵 {playlist.songs?.length || 0} Tracks ({playlist.stats?.totalDuration || '25 min'})</span>
              <span className="text-amber-400 font-bold">🔊 {playlist.stats?.bassLevel}</span>
              <span className="italic text-slate-400">Curated by {playlist.curator}</span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-7 py-3 rounded-full btn-primary text-xs md:text-sm font-black transition transform active:scale-95 shadow-md shadow-amber-500/20"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{language === 'hi' ? 'सभी गाने बजाएं' : 'Play All Tracks'}</span>
              </button>

              <button
                onClick={handleShufflePlay}
                className={`flex items-center gap-2 px-4 py-3 rounded-full text-xs md:text-sm font-semibold border transition ${
                  isShuffle
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-white/8 hover:bg-white/15 text-white border-white/12'
                }`}
              >
                <Shuffle className="w-4 h-4" />
                <span>{language === 'hi' ? 'शफल' : 'Shuffle'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/8 hover:bg-white/15 text-white border border-white/12 transition"
                title="Share Playlist"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Tracklist Container */}
      <div className="rounded-3xl bg-[#0c0e18] border border-white/8 overflow-hidden shadow-xl">
        
        {/* Table Header */}
        <div className="px-6 py-3.5 bg-black/40 border-b border-white/8 grid grid-cols-12 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 md:col-span-5">{language === 'hi' ? 'गाना और विवरण' : 'Title & Details'}</div>
          <div className="col-span-3 md:col-span-4 hidden sm:block">{language === 'hi' ? 'टैग / मूड' : 'Mood / Tag'}</div>
          <div className="col-span-5 sm:col-span-2 text-right pr-2 flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 inline text-slate-500" />
            <span>{language === 'hi' ? 'समय' : 'Duration'}</span>
          </div>
        </div>

        {/* Tracks List */}
        <div className="divide-y divide-white/5">
          {playlist.songs?.map((song, idx) => {
            const isSongActive = currentSong?.id === song.id;
            const liked = isSongLiked(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playSong(song, playlist)}
                className={`group cursor-pointer px-4 md:px-6 py-4 grid grid-cols-12 items-center transition-colors ${
                  isSongActive
                    ? 'bg-amber-400/10 text-white'
                    : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                {/* Index / Playing Soundwave */}
                <div className="col-span-1 flex items-center justify-center font-mono text-xs text-slate-400">
                  {isSongActive && isPlaying ? (
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce" />
                      <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  ) : (
                    <>
                      <span className="group-hover:hidden">{idx + 1}</span>
                      <Play className="w-4 h-4 text-amber-400 hidden group-hover:block fill-amber-400" />
                    </>
                  )}
                </div>

                {/* Song Title & Artist */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-3.5 min-w-0 pr-2">
                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0 shadow"
                  />
                  <div className="min-w-0">
                    <div className={`text-xs md:text-sm font-bold truncate ${isSongActive ? 'text-amber-400' : 'text-white'}`}>
                      {language === 'hi' ? song.hindiTitle : song.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {song.artist}
                    </div>
                  </div>
                </div>

                {/* Tag & Mood */}
                <div className="col-span-3 md:col-span-4 hidden sm:flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/6 text-slate-300 text-[11px] font-mono border border-white/8 truncate">
                    {song.tag}
                  </span>
                  <span className="text-xs text-slate-400 truncate italic hidden lg:inline">
                    {song.trivia}
                  </span>
                </div>

                {/* Duration & Like */}
                <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-3 pr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeSong(song.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <span className="text-xs font-mono text-slate-400 w-10 text-right">
                    {song.duration}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
