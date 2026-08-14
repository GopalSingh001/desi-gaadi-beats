import React from 'react';
import { Heart, Play, Music, ArrowLeft, Clock } from 'lucide-react';
import { allSongs } from '../data/playlistsData';
import { useAudio } from '../context/AudioContext';

export const LikedSongsView = ({ onBack }) => {
  const {
    likedSongIds,
    toggleLikeSong,
    playSong,
    currentSong,
    isPlaying,
    language
  } = useAudio();

  const likedTracks = allSongs.filter(s => likedSongIds.includes(s.id));

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playSong(likedTracks[0], {
        id: 'liked-playlist',
        title: 'Liked Songs',
        hindiTitle: 'पसंदीदा गाने',
        icon: '❤️',
        songs: likedTracks
      }, likedTracks);
    }
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
          <span>{language === 'hi' ? 'वापस जाएं' : 'Back'}</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl p-6 md:p-10 bg-gradient-to-br from-rose-950/80 via-[#18101a] to-black border border-rose-500/30 shadow-2xl flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-5xl md:text-6xl shadow-2xl shadow-rose-600/40 shrink-0">
            ❤️
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-300 font-mono">
              {language === 'hi' ? 'पर्सनल कलेक्शन' : 'FAVORITES COLLECTION'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-desi text-white mt-1 leading-tight">
              {language === 'hi' ? 'मेरे पसंदीदा गाने' : 'Liked Songs'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-2">
              {likedTracks.length} {language === 'hi' ? 'गाने सेव किए गए' : 'tracks saved in your personal garage'}
            </p>
          </div>
        </div>

        {likedTracks.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-black text-sm transition transform hover:scale-105 shadow-xl shadow-rose-500/30 active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{language === 'hi' ? 'सारे पसंदीदा बजाएं' : 'Play All Liked'}</span>
          </button>
        )}
      </div>

      {/* Tracks Table */}
      <div className="rounded-3xl bg-[#111422] border border-white/10 overflow-hidden shadow-xl">
        
        {/* Table Header */}
        <div className="px-6 py-3.5 bg-black/40 border-b border-white/10 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          <div className="w-10 text-center">#</div>
          <div className="flex-1 px-4">{language === 'hi' ? 'गाना और कलाकार' : 'Title & Artist'}</div>
          <div className="w-32 text-right pr-2 flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 inline text-slate-500" />
            <span>{language === 'hi' ? 'समय' : 'Duration'}</span>
          </div>
        </div>

        {likedTracks.length > 0 ? (
          <div className="divide-y divide-white/5">
            {likedTracks.map((song, idx) => {
              const isSongActive = currentSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, null, likedTracks)}
                  className={`group cursor-pointer px-4 md:px-6 py-4 flex items-center justify-between gap-3 transition-colors ${
                    isSongActive
                      ? 'bg-rose-500/15 text-white'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="w-10 flex items-center justify-center font-mono text-xs text-slate-400 shrink-0">
                    <span className="group-hover:hidden">{idx + 1}</span>
                    <Play className="w-4 h-4 text-rose-400 hidden group-hover:block fill-rose-400" />
                  </div>

                  <div className="flex-1 min-w-0 flex items-center gap-3.5 px-4">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow"
                    />
                    <div className="min-w-0">
                      <div className={`text-sm font-bold truncate ${isSongActive ? 'text-rose-400' : 'text-white'}`}>
                        {language === 'hi' ? song.hindiTitle : song.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {song.artist} • <span className="text-slate-400">{song.playlistIcon} {song.tag}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-32 flex items-center justify-end gap-3 shrink-0 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeSong(song.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-white/10 text-rose-500 transition"
                      title="Remove from Liked"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>

                    <span className="text-xs font-mono text-slate-400 w-10 text-right">
                      {song.duration}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center">
            <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              {language === 'hi' ? 'कोई पसंदीदा गाना नहीं है' : 'No Liked Songs Yet'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'किसी भी गाने पर ❤️ दबाकर उसे यहाँ जोड़ें!'
                : 'Click ❤️ on any track to save it here for quick listening!'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
