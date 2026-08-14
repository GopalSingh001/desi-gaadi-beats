import React, { useState } from 'react';
import { Play, Shuffle, Heart, Share2, Sparkles, ArrowLeft, Disc3, Info, Clock, Music } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const PlaylistDetail = ({ onBack }) => {
  const {
    currentPlaylist,
    currentSong,
    isPlaying,
    playSong,
    isShuffle,
    setIsShuffle,
    toggleLikeSong,
    isSongLiked,
    showToast,
    language
  } = useAudio();

  const [expandedTriviaId, setExpandedTriviaId] = useState(null);

  if (!currentPlaylist) return null;

  const handlePlayAll = () => {
    if (currentPlaylist.songs && currentPlaylist.songs.length > 0) {
      playSong(currentPlaylist.songs[0], currentPlaylist);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(language === 'hi' ? 'प्लेलिस्ट लिंक कॉपी हो गया! 📋' : 'Playlist link copied! 📋', 'success');
    }
  };

  const toggleTrivia = (id) => {
    setExpandedTriviaId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस प्लेलिस्ट्स पर जाएं' : 'Back to Playlists'}</span>
        </button>
      </div>

      {/* Playlist Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#111422] to-black border border-white/10 shadow-2xl p-6 md:p-10">
        
        {/* Ambient Color Glow */}
        <div
          style={{ backgroundColor: currentPlaylist.accentColor || '#f59e0b' }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 lg:gap-8">
          
          {/* Large Vehicle Avatar */}
          <div className="relative group shrink-0">
            <div
              style={{
                background: `linear-gradient(135deg, ${currentPlaylist.accentColor}33 0%, rgba(0,0,0,0.6) 100%)`,
                borderColor: `${currentPlaylist.accentColor}66`
              }}
              className="w-32 h-32 md:w-44 md:h-44 rounded-3xl border-2 flex items-center justify-center text-6xl md:text-7xl shadow-2xl shadow-black/80"
            >
              {currentPlaylist.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-bold text-amber-400 font-mono">
              {currentPlaylist.vehicleType}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            
            {/* Badges */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentPlaylist.category}
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10">
                {currentPlaylist.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black font-desi text-white tracking-wide leading-tight">
              {language === 'hi' ? currentPlaylist.hindiTitle : currentPlaylist.title}
            </h1>

            {/* Description */}
            <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {currentPlaylist.description}
            </p>

            {/* Curator & Stats Info Row */}
            <div className="mt-4 flex items-center gap-4 md:gap-6 text-xs text-slate-300 font-mono flex-wrap">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span>👤</span> {currentPlaylist.curator}
              </span>
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-slate-400" />
                {currentPlaylist.songs?.length || 0} {language === 'hi' ? 'गाने' : 'Tracks'} ({currentPlaylist.stats?.totalDuration})
              </span>
              {currentPlaylist.stats?.bassLevel && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span>🔊</span> {currentPlaylist.stats.bassLevel}
                </span>
              )}
            </div>

          </div>

        </div>

        {/* Play Controls Bar */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            
            {/* Play All Button */}
            <button
              onClick={handlePlayAll}
              style={{ backgroundColor: currentPlaylist.accentColor || '#f59e0b' }}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-slate-950 font-black text-sm transition-all transform hover:scale-105 shadow-xl shadow-black/60 active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{language === 'hi' ? 'सारे गाने बजाएं' : 'Play All Tracks'}</span>
            </button>

            {/* Shuffle Button */}
            <button
              onClick={() => setIsShuffle(s => !s)}
              className={`p-3.5 rounded-full border transition ${
                isShuffle
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title="Toggle Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-3.5 rounded-full bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition"
              title="Share Playlist"
            >
              <Share2 className="w-5 h-5" />
            </button>

          </div>
        </div>

      </div>

      {/* Tracklist Table */}
      <div className="rounded-3xl bg-[#111422] border border-white/10 overflow-hidden shadow-xl">
        
        {/* Table Header */}
        <div className="px-6 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <div className="w-10 text-center">#</div>
          <div className="flex-1 px-4">{language === 'hi' ? 'गाना और कलाकार' : 'Title & Artist'}</div>
          <div className="hidden md:block w-48 text-center">{language === 'hi' ? 'टैग / मूड' : 'Mood / Tag'}</div>
          <div className="w-32 text-right pr-2 flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 inline text-slate-500" />
            <span>{language === 'hi' ? 'समय' : 'Duration'}</span>
          </div>
        </div>

        {/* Tracks List */}
        <div className="divide-y divide-white/5">
          {currentPlaylist.songs?.map((song, idx) => {
            const isSongActive = currentSong?.id === song.id;
            const liked = isSongLiked(song.id);
            const isTriviaOpen = expandedTriviaId === song.id;

            return (
              <div key={song.id} className="group">
                <div
                  onClick={() => playSong(song, currentPlaylist)}
                  className={`cursor-pointer px-4 md:px-6 py-4 flex items-center justify-between gap-3 transition-colors ${
                    isSongActive
                      ? 'bg-amber-500/15 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  {/* Track Number / Equalizer */}
                  <div className="w-10 flex items-center justify-center font-mono text-xs text-slate-400 shrink-0">
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

                  {/* Title & Artist */}
                  <div className="flex-1 min-w-0 flex items-center gap-3.5 px-4">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
                    />
                    <div className="min-w-0">
                      <div className={`text-sm font-bold truncate ${isSongActive ? 'text-amber-400' : 'text-white'}`}>
                        {language === 'hi' ? song.hindiTitle : song.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {song.artist} • <span className="text-slate-400">{song.album}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mood Tag */}
                  <div className="hidden md:flex items-center justify-center w-48 shrink-0">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 font-medium">
                      {song.tag}
                    </span>
                  </div>

                  {/* Actions & Duration */}
                  <div className="w-32 flex items-center justify-end gap-3 shrink-0 pr-2">
                    
                    {/* Trivia Button */}
                    {song.trivia && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrivia(song.id);
                        }}
                        className={`p-1.5 rounded-full hover:bg-white/10 transition ${
                          isTriviaOpen ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Desi Story / Trivia"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}

                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeSong(song.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition"
                      title={liked ? "Remove from Liked" : "Like Song"}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Duration */}
                    <span className="text-xs font-mono text-slate-400 w-10 text-right">
                      {song.duration}
                    </span>
                  </div>
                </div>

                {/* Expanded Trivia Story Snippet */}
                {isTriviaOpen && (
                  <div className="px-6 py-3.5 bg-black/60 border-t border-b border-amber-500/20 text-xs text-amber-200/95 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400">
                        {language === 'hi' ? 'हाईवे किस्सा: ' : 'Highway Story: '}
                      </span>
                      {song.trivia}
                      {song.lyricsSnippet && (
                        <div className="mt-1 font-hindi text-slate-300 italic">
                          "{song.lyricsSnippet}"
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
