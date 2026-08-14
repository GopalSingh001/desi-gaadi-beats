import React from 'react';
import { playlists, allSongs } from '../data/playlistsData';
import { CockpitWindshield } from './CockpitWindshield';
import { AudioUploader } from './AudioUploader';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Heart, Sparkles, Flame, Volume2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HomeSimplified = () => {
  const {
    currentPlaylist,
    setCurrentPlaylist,
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    toggleLikeSong,
    isSongLiked,
    language
  } = useAudio();

  const handleVehicleSelect = (playlist) => {
    setCurrentPlaylist(playlist);
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0], playlist);
    }
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const currentTracks = currentPlaylist?.songs || playlists[0].songs;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      
      {/* 1. VEHICLE SELECTOR STRIP (1-CLICK COCKPIT SWITCHER) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-bold font-desi text-white flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <span>{language === 'hi' ? 'अपनी गाड़ी चुनें और कॉकपिट में बैठें (Choose Your Vehicle):' : 'Select Vehicle Cockpit & Playlist:'}</span>
          </h2>
          <span className="text-xs text-amber-400 font-mono font-bold hidden sm:inline">
            1-CLICK 3D RIDE
          </span>
        </div>

        {/* Scrollable Vehicle Pills / Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {playlists.map((p) => {
            const isSelected = currentPlaylist?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleVehicleSelect(p)}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border transform active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400/20 border-amber-400 shadow-lg shadow-amber-400/20 scale-105'
                    : 'bg-[#0f121e] border-white/8 hover:border-white/20 hover:bg-[#151928]'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1 drop-shadow">{p.icon}</span>
                <span className="text-xs font-bold text-white truncate w-full">
                  {language === 'hi' ? p.hindiTitle.split('-')[0] : p.vehicleType}
                </span>
                <span className="text-[10px] text-amber-400 font-mono mt-0.5">
                  {p.songs.length} Tracks
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THE 3D ANIMATED VEHICLE WINDSHIELD COCKPIT */}
      <div>
        <CockpitWindshield />
      </div>

      {/* 3. REAL MP3 UPLOADER BOX */}
      <div>
        <AudioUploader />
      </div>

      {/* 4. CLEAN & INTUITIVE PLAYLIST TRACKS (SIMPLE 1-CLICK LIST) */}
      <div className="rounded-3xl bg-[#0c0e18] border border-white/8 p-5 sm:p-7 shadow-xl space-y-4">
        
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentPlaylist?.icon || '🛺'}</span>
              <h3 className="text-lg sm:text-xl font-bold font-desi text-white">
                {language === 'hi' ? currentPlaylist?.hindiTitle || 'ऑटो रिक्शा प्लेलिस्ट' : currentPlaylist?.title || 'Auto Rickshaw Playlist'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentPlaylist?.description || 'Iconic driver collection'}
            </p>
          </div>

          <button
            onClick={() => {
              if (currentTracks.length > 0) playSong(currentTracks[0], currentPlaylist);
            }}
            className="px-6 py-2.5 rounded-full btn-primary text-xs font-black flex items-center gap-2 shadow-md"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{language === 'hi' ? 'सारे गाने चलाएं' : 'Play All'}</span>
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-2">
          {currentTracks.map((song, idx) => {
            const isSongActive = currentSong?.id === song.id;
            const liked = isSongLiked(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playSong(song, currentPlaylist)}
                className={`group cursor-pointer p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                  isSongActive
                    ? 'bg-amber-400/15 border-amber-400/50 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Left: Index / Play Icon + Cover + Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  
                  <div className="w-8 flex items-center justify-center font-mono text-xs font-bold text-slate-400 shrink-0">
                    {isSongActive && isPlaying ? (
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce" />
                        <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow"
                  />

                  <div className="min-w-0">
                    <div className={`text-sm font-bold truncate ${isSongActive ? 'text-amber-400' : 'text-white'}`}>
                      {language === 'hi' ? song.hindiTitle : song.title}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {song.artist} • <span className="text-amber-400/90">{song.tag}</span>
                    </div>
                    {song.lyricsSnippet && (
                      <div className="text-[11px] text-slate-400 italic truncate hidden md:block">
                        "{song.lyricsSnippet}"
                      </div>
                    )}
                  </div>

                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeSong(song.id);
                    }}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <span className="text-xs font-mono text-slate-400 w-10 text-right">
                    {song.duration}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSongActive) {
                        togglePlay();
                      } else {
                        playSong(song, currentPlaylist);
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center transition shadow"
                  >
                    {isSongActive && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
