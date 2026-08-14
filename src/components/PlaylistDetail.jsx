import React, { useState } from 'react';
import { Play, Shuffle, Heart, Share2, Plus, Info, ArrowLeft, Disc3, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const PlaylistDetail = ({ onBack }) => {
  const {
    currentPlaylist,
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    isShuffle,
    setIsShuffle,
    toggleLikeSong,
    isSongLiked,
    customPlaylists,
    addSongToCustomPlaylist,
    showToast,
    language
  } = useAudio();

  const [expandedTriviaId, setExpandedTriviaId] = useState(null);
  const [playlistMenuSongId, setPlaylistMenuSongId] = useState(null);

  if (!currentPlaylist) return null;

  const handlePlayAll = () => {
    if (currentPlaylist.songs && currentPlaylist.songs.length > 0) {
      playSong(currentPlaylist.songs[0], currentPlaylist);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(language === 'hi' ? 'प्लेलिस्ट लिंक कॉपी हो गया!' : 'Playlist link copied to clipboard!', 'success');
  };

  const toggleTrivia = (id) => {
    setExpandedTriviaId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition border border-white/5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'hi' ? 'वापस जाएं' : 'Back to Playlists'}</span>
      </button>

      {/* Playlist Hero Header */}
      <div
        style={{
          background: currentPlaylist.bgPattern || 'linear-gradient(135deg, #181d2e 0%, #0d0f18 100%)'
        }}
        className="relative rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Glow */}
        <div
          style={{ backgroundColor: currentPlaylist.accentColor }}
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[90px] opacity-25 pointer-events-none"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
          
          {/* Large Playlist Vehicle Cover Art */}
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl bg-black/40 border border-white/15 flex items-center justify-center text-6xl md:text-7xl shadow-2xl shrink-0">
            {currentPlaylist.icon}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10 font-mono">
                {currentPlaylist.category}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 text-slate-300 border border-white/10">
                {currentPlaylist.badge}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black font-desi text-white drop-shadow-md leading-tight">
              {language === 'hi' ? currentPlaylist.hindiTitle : currentPlaylist.title}
            </h1>

            <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentPlaylist.description}
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-mono flex-wrap">
              <span>👤 {currentPlaylist.curator || 'Desi Gaadi Beats'}</span>
              <span>🎵 {currentPlaylist.songs?.length || 0} {language === 'hi' ? 'गाने' : 'Tracks'}</span>
              {currentPlaylist.stats && (
                <span className="text-amber-400 font-bold">🔊 {currentPlaylist.stats.bassLevel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              style={{ backgroundColor: currentPlaylist.accentColor || '#f59e0b' }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full text-slate-950 font-black text-sm transition-all transform hover:scale-105 shadow-xl shadow-black/60"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{language === 'hi' ? 'सभी गाने बजाएं' : 'Play All Tracks'}</span>
            </button>

            <button
              onClick={() => setIsShuffle(s => !s)}
              className={`p-3.5 rounded-full border transition ${
                isShuffle
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
              title="Toggle Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

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
      <div className="rounded-3xl bg-[#121522] border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <div className="w-8">#</div>
          <div className="flex-1">{language === 'hi' ? 'गाना और कलाकार' : 'Title & Artist'}</div>
          <div className="hidden md:block w-36 text-center">{language === 'hi' ? 'टैग' : 'Mood / Tag'}</div>
          <div className="w-28 text-right">{language === 'hi' ? 'समय' : 'Duration'}</div>
        </div>

        <div className="divide-y divide-white/5">
          {currentPlaylist.songs?.map((song, idx) => {
            const isSongActive = currentSong?.id === song.id;
            const liked = isSongLiked(song.id);
            const isTriviaOpen = expandedTriviaId === song.id;

            return (
              <div key={song.id} className="group">
                <div
                  onClick={() => playSong(song, currentPlaylist)}
                  className={`cursor-pointer px-4 md:px-6 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                    isSongActive
                      ? 'bg-amber-500/10 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  {/* Track Number / Equalizer */}
                  <div className="w-8 flex items-center justify-center font-mono text-xs text-slate-400">
                    {isSongActive && isPlaying ? (
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce" />
                        <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                    ) : (
                      <span className="group-hover:hidden">{idx + 1}</span>
                    )}
                    <Play className="w-4 h-4 text-amber-400 hidden group-hover:block fill-amber-400" />
                  </div>

                  {/* Title & Artist */}
                  <div className="flex-1 min-w-0 flex items-center gap-3.5">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className={`text-sm font-bold truncate ${isSongActive ? 'text-amber-400' : 'text-white'}`}>
                        {language === 'hi' ? song.hindiTitle : song.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {song.artist}
                      </div>
                    </div>
                  </div>

                  {/* Mood Tag */}
                  <div className="hidden md:flex items-center justify-center w-36">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300 font-medium">
                      {song.tag}
                    </span>
                  </div>

                  {/* Actions & Duration */}
                  <div className="w-28 flex items-center justify-end gap-2 shrink-0">
                    
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
                        title="Desi Trivia"
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
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Duration */}
                    <span className="text-xs font-mono text-slate-400 ml-1">
                      {song.duration}
                    </span>
                  </div>
                </div>

                {/* Expanded Trivia & Desi Story Card */}
                {isTriviaOpen && (
                  <div className="px-6 py-3 bg-black/40 border-t border-b border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400">
                        {language === 'hi' ? 'देसी किस्सा: ' : 'Highway Story: '}
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
