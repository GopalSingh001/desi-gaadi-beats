import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Maximize2,
  Radio,
  Sliders,
  Sparkles,
  Zap,
  Disc
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { AudioVisualizer } from './AudioVisualizer';

export const PlayerBar = () => {
  const {
    currentSong,
    currentPlaylist,
    isPlaying,
    togglePlay,
    handleNextSong,
    handlePrevSong,
    currentTime,
    duration,
    handleSeek,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isShuffle,
    setIsShuffle,
    repeatMode,
    setRepeatMode,
    toggleLikeSong,
    isSongLiked,
    isBassBoost,
    toggleBassBoost,
    isJhankar,
    toggleJhankar,
    setIsFullScreenPlayerOpen,
    setPlayerMode,
    setIsSoundboardOpen,
    language
  } = useAudio();

  if (!currentSong) return null;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRepeatToggle = () => {
    if (repeatMode === 'all') setRepeatMode('one');
    else if (repeatMode === 'one') setRepeatMode('off');
    else setRepeatMode('all');
  };

  const liked = isSongLiked(currentSong.id);

  const openPlayerInMode = (mode) => {
    setPlayerMode(mode);
    setIsFullScreenPlayerOpen(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-20 md:h-24 bg-[#0c0e17]/95 border-t border-white/10 backdrop-blur-2xl px-3 md:px-6 flex items-center justify-between shadow-2xl">
      
      {/* 1. Left Section: Song Thumbnail & Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[140px] max-w-[280px]">
        <div
          onClick={() => openPlayerInMode('modern')}
          className="relative group cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-md"
        >
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''} transition-transform duration-500`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="min-w-0">
          <div
            onClick={() => openPlayerInMode('modern')}
            className="cursor-pointer hover:underline text-xs md:text-sm font-bold text-white truncate"
          >
            {language === 'hi' ? currentSong.hindiTitle : currentSong.title}
          </div>
          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
            <span>{currentSong.artist}</span>
          </div>
        </div>

        <button
          onClick={() => toggleLikeSong(currentSong.id)}
          className="hidden sm:block p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition ml-1"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* 2. Middle Section: Playback Controls & Progress Bar */}
      <div className="flex-1 max-w-xl mx-2 md:mx-6 flex flex-col items-center justify-center">
        
        {/* Buttons Row */}
        <div className="flex items-center gap-3 md:gap-5 mb-1.5">
          
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffle(s => !s)}
            className={`p-1.5 rounded-full transition ${
              isShuffle ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            onClick={handlePrevSong}
            className="p-1.5 text-slate-300 hover:text-white transition"
            title="Previous Track"
          >
            <SkipBack className="w-5 h-5 fill-slate-300" />
          </button>

          {/* Play/Pause Main Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition transform hover:scale-105 active:scale-95"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={handleNextSong}
            className="p-1.5 text-slate-300 hover:text-white transition"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-slate-300" />
          </button>

          {/* Repeat */}
          <button
            onClick={handleRepeatToggle}
            className={`p-1.5 rounded-full transition ${
              repeatMode !== 'off' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Seek Progress Bar */}
        <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full"
          />
          <span className="w-8">{formatTime(duration)}</span>
        </div>

      </div>

      {/* 3. Right Section: Equalizer status, Soundboard, Expander Modes & Volume */}
      <div className="flex items-center justify-end gap-2 md:gap-3 w-1/4 min-w-[120px]">
        
        {/* Live Audio Visualizer Mini Preview */}
        <div
          onClick={() => openPlayerInMode('modern')}
          className="hidden xl:block cursor-pointer"
          title="Open Fullscreen Visualizer"
        >
          <AudioVisualizer barCount={14} height={28} width={70} color="#f59e0b" />
        </div>

        {/* Cassette Mode Button */}
        <button
          onClick={() => openPlayerInMode('cassette')}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 hover:text-amber-200 transition border border-white/5"
          title="90s Cassette Deck Mode"
        >
          <Radio className="w-4 h-4" />
        </button>

        {/* Highway Dashcam Mode Button */}
        <button
          onClick={() => openPlayerInMode('highway')}
          className="hidden sm:flex p-2 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-300 hover:text-emerald-200 transition border border-white/5"
          title="Highway Night Drive Mode"
        >
          <Disc className="w-4 h-4 animate-spin-slow" />
        </button>

        {/* Volume Slider */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setIsMuted(m => !m)}
            className="text-slate-400 hover:text-white transition"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setIsMuted(false);
              setVolume(Number(e.target.value));
            }}
            className="w-16"
          />
        </div>

        {/* Fullscreen Player Expander */}
        <button
          onClick={() => openPlayerInMode('modern')}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition"
          title="Fullscreen Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
