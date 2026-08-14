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
    setIsFullScreenPlayerOpen,
    setPlayerMode,
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
    <div className="fixed bottom-0 left-0 right-0 z-40 h-20 md:h-24 bg-[#0a0c14]/95 border-t border-white/10 backdrop-blur-2xl px-4 md:px-8 flex items-center justify-between shadow-2xl">
      
      {/* Left Section: Song Thumbnail & Meta */}
      <div className="flex items-center gap-3 w-1/4 min-w-[150px] max-w-[320px]">
        <div
          onClick={() => openPlayerInMode('modern')}
          className="relative group cursor-pointer w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-md"
        >
          <img
            src={currentSong.coverArt}
            alt={currentSong.title}
            className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''} transition-transform duration-500`}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
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
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            <span>{currentSong.artist}</span>
          </div>
        </div>

        <button
          onClick={() => toggleLikeSong(currentSong.id)}
          className="hidden sm:block p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition ml-1 shrink-0"
          title={liked ? "Remove from Liked" : "Like Track"}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Middle Section: Playback Controls & Progress Bar */}
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

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 transition transform hover:scale-105 active:scale-95"
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

        {/* Progress Bar & Time */}
        <div className="w-full flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="w-8 text-right font-bold">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full"
          />
          <span className="w-8 font-bold">{formatTime(duration)}</span>
        </div>

      </div>

      {/* Right Section: Visualizer, Modes & Volume */}
      <div className="flex items-center justify-end gap-2 md:gap-3 w-1/4 min-w-[130px]">
        
        {/* Live Audio Visualizer Mini Preview */}
        <div
          onClick={() => openPlayerInMode('modern')}
          className="hidden xl:block cursor-pointer"
          title="Open Fullscreen Visualizer"
        >
          <AudioVisualizer barCount={16} height={28} width={75} color={currentPlaylist?.accentColor || '#f59e0b'} />
        </div>

        {/* 90s Cassette Mode Button */}
        <button
          onClick={() => openPlayerInMode('cassette')}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 hover:text-amber-200 transition border border-white/10"
          title="90s Cassette Deck Mode"
        >
          <Radio className="w-4 h-4" />
        </button>

        {/* Highway Dashcam Mode Button */}
        <button
          onClick={() => openPlayerInMode('highway')}
          className="hidden sm:flex p-2 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-300 hover:text-emerald-200 transition border border-white/10"
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
