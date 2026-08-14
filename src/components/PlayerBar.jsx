import React from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, VolumeX, Maximize2, Radio, Sliders, Heart, Disc, CassetteTape
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const PlayerBar = ({ onOpenFullScreen, onOpenCassette }) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    isSongLiked,
    toggleLikeSong,
    isBassBoost,
    isJhankar,
    language
  } = useAudio();

  if (!currentSong) return null;

  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec === null) return '0:00';
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isSongLiked(currentSong.id);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-22 md:h-24 backdrop-blur-2xl bg-[#090b14]/95 border-t border-white/8 px-3 md:px-6 flex items-center justify-between gap-2 md:gap-6 shadow-2xl transition-all">
      
      {/* 1. Left Track Information */}
      <div className="flex items-center gap-3 w-1/4 min-w-[150px] max-w-[280px]">
        
        {/* Track Thumbnail with Spinning Disc on Play */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg bg-slate-900">
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''} transition-transform duration-500`}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
          )}
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1">
          <div className="text-xs md:text-sm font-bold text-white truncate hover:text-amber-400 transition-colors">
            {language === 'hi' ? currentSong.hindiTitle : currentSong.title}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            {currentSong.artist}
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={() => toggleLikeSong(currentSong.id)}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-500 transition hidden sm:block shrink-0"
          title="Save to Favorites"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

      </div>

      {/* 2. Center Player Controls & Seekbar */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-xl px-2">
        
        {/* Button Controls Row */}
        <div className="flex items-center gap-3 md:gap-5 mb-1.5">
          
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition hidden sm:block ${
              isShuffle ? 'text-amber-400 bg-amber-400/15' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={playPrev}
            className="p-1.5 rounded-full text-slate-300 hover:text-white transition transform active:scale-95"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full btn-primary flex items-center justify-center text-slate-950 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-1.5 rounded-full text-slate-300 hover:text-white transition transform active:scale-95"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full transition hidden sm:block ${
              isRepeat ? 'text-amber-400 bg-amber-400/15' : 'text-slate-400 hover:text-white'
            }`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>

        </div>

        {/* Seekbar Row */}
        <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
          <span className="w-8 text-right shrink-0">{formatTime(currentTime)}</span>
          
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full h-1 bg-white/10 group-hover:bg-white/20 rounded-full appearance-none cursor-pointer outline-none"
            />
          </div>

          <span className="w-8 text-left shrink-0">{formatTime(duration)}</span>
        </div>

      </div>

      {/* 3. Right Volume & View Modes */}
      <div className="flex items-center justify-end gap-2 md:gap-3 w-1/4 min-w-[120px]">
        
        {/* Equalizer Indicator Pill */}
        {(isBassBoost || isJhankar) && (
          <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
            JHANKAR ACTIVE
          </span>
        )}

        {/* Volume Slider */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 rounded-full text-slate-400 hover:text-white transition"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-300" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolumeLevel(Number(e.target.value))}
            className="w-16 md:w-20 h-1 bg-white/15 rounded-full cursor-pointer"
          />
        </div>

        {/* 90s Cassette Deck Mode */}
        <button
          onClick={onOpenCassette}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition border border-white/8 hidden sm:flex items-center justify-center"
          title="90s Cassette Mode"
        >
          <Disc className="w-4 h-4" />
        </button>

        {/* Highway Dashcam / Fullscreen Mode */}
        <button
          onClick={onOpenFullScreen}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 transition border border-white/8 flex items-center justify-center"
          title="Fullscreen Highway Dashcam"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

      </div>

    </footer>
  );
};
