import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  Sliders,
  Sparkles,
  Radio,
  Disc,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { AudioVisualizer } from './AudioVisualizer';
import confetti from 'canvas-confetti';

export const FullScreenPlayer = () => {
  const {
    isFullScreenPlayerOpen,
    setIsFullScreenPlayerOpen,
    playerMode,
    setPlayerMode,
    currentSong,
    currentPlaylist,
    isPlaying,
    togglePlay,
    handleNextSong,
    handlePrevSong,
    currentTime,
    duration,
    handleSeek,
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
    triggerSoundEffect,
    language
  } = useAudio();

  const [isPencilRewinding, setIsPencilRewinding] = useState(false);

  if (!isFullScreenPlayerOpen || !currentSong) return null;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const liked = isSongLiked(currentSong.id);

  // Pencil Rewind Easter Egg
  const handlePencilRewind = () => {
    setIsPencilRewinding(true);
    triggerSoundEffect('playAutoMeterClick');
    handleSeek(Math.max(0, currentTime - 15));
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setIsPencilRewinding(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090b11] text-white flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      
      {/* Dynamic Background Ambient Blur */}
      <div
        style={{
          background: `radial-gradient(circle at center, ${currentPlaylist?.accentColor || '#f59e0b'}33 0%, #090b11 75%)`
        }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Top Bar: Mode Switcher & Close */}
      <div className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-white/10 glass-panel">
        
        {/* Mode Tabs */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setPlayerMode('modern')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              playerMode === 'modern' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Disc className="w-4 h-4" />
            <span>Modern Studio</span>
          </button>

          <button
            onClick={() => setPlayerMode('cassette')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              playerMode === 'cassette' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>90s Cassette Deck</span>
          </button>

          <button
            onClick={() => setPlayerMode('highway')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              playerMode === 'highway' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Highway Night Drive</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsFullScreenPlayerOpen(false)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main View Body */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        
        {/* ======================================================== */}
        {/* 1. MODERN VINYL & VISUALIZER MODE */}
        {/* ======================================================== */}
        {playerMode === 'modern' && (
          <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 animate-in zoom-in-95 duration-300">
            
            {/* Vinyl Record */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-black border-4 border-slate-800 shadow-2xl flex items-center justify-center ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}>
                {/* Vinyl Grooves */}
                <div className="absolute inset-4 rounded-full border border-slate-700/50" />
                <div className="absolute inset-8 rounded-full border border-slate-700/40" />
                <div className="absolute inset-14 rounded-full border border-slate-700/30" />
                <div className="absolute inset-20 rounded-full border border-slate-700/20" />

                {/* Center Label Art */}
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-amber-500 shadow-inner relative">
                  <img
                    src={currentSong.coverArt}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-900 border-2 border-white" />
                </div>
              </div>

              {/* Tonearm graphic overlay */}
              <div className="hidden md:block absolute -top-4 -right-4 w-12 h-28 border-r-4 border-t-4 border-amber-500/80 rounded-tr-3xl pointer-events-none transform rotate-12" />
            </div>

            {/* Song Meta, Lyrics & Visualizer */}
            <div className="flex-1 max-w-md text-center lg:text-left space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                {currentSong.playlistIcon} {currentSong.tag}
              </span>

              <h2 className="text-3xl md:text-4xl font-black font-desi text-white leading-tight">
                {language === 'hi' ? currentSong.hindiTitle : currentSong.title}
              </h2>

              <p className="text-base text-slate-300 font-semibold">
                {currentSong.artist} • <span className="text-amber-400">{currentSong.album}</span>
              </p>

              {/* Audio Visualizer Canvas */}
              <div className="flex justify-center lg:justify-start py-2">
                <AudioVisualizer barCount={32} height={60} width={280} color={currentPlaylist?.accentColor || '#f59e0b'} />
              </div>

              {/* Lyrics / Story Snippet */}
              {currentSong.lyricsSnippet && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs md:text-sm text-amber-200/90 font-hindi italic text-left">
                  "{currentSong.lyricsSnippet}"
                </div>
              )}

              {/* Trivia */}
              {currentSong.trivia && (
                <div className="text-xs text-slate-400 flex items-start gap-2 text-left">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentSong.trivia}</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 2. 90s RETRO CASSETTE DECK MODE */}
        {/* ======================================================== */}
        {playerMode === 'cassette' && (
          <div className="w-full max-w-xl flex flex-col items-center animate-in zoom-in-95 duration-300">
            
            {/* Realistic 90s Cassette Tape */}
            <div className="w-full cassette-body p-6 md:p-8 rounded-3xl relative overflow-hidden border-4 border-slate-700 shadow-2xl">
              
              {/* Cassette Top Header Label */}
              <div className="cassette-label p-4 rounded-2xl text-slate-950 font-bold mb-5 flex items-center justify-between shadow-inner">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-slate-900">
                    SUPER DESI STEREO CASSETTE
                  </div>
                  <div className="text-lg md:text-xl font-black font-desi leading-none mt-0.5">
                    {language === 'hi' ? currentSong.hindiTitle : currentSong.title}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-black text-amber-400">
                    SIDE A
                  </span>
                  <div className="text-[10px] text-slate-900 mt-1 font-mono">
                    TYPE I • NORMAL BIAS
                  </div>
                </div>
              </div>

              {/* Cassette Tape Spools Window */}
              <div className="w-full h-28 md:h-36 bg-[#0a0c13] rounded-2xl border-2 border-slate-600 p-4 flex items-center justify-around relative">
                
                {/* Left Spool */}
                <div className={`cassette-spool ${isPlaying ? 'animate-spin-slow' : ''} ${isPencilRewinding ? 'animate-spin-fast' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-slate-900" />
                </div>

                {/* Center Tape Window with magnetic tape & counter */}
                <div className="w-36 h-12 bg-black/80 rounded-lg border border-slate-700 flex flex-col items-center justify-center p-1.5">
                  <div className="w-full h-1.5 bg-amber-900/60 rounded-full mb-1" />
                  <span className="font-mono text-xs text-amber-400 font-bold tracking-widest">
                    {Math.floor(currentTime * 2.5).toString().padStart(4, '0')}
                  </span>
                </div>

                {/* Right Spool */}
                <div className={`cassette-spool ${isPlaying ? 'animate-spin-slow' : ''} ${isPencilRewinding ? 'animate-spin-fast' : ''}`}>
                  <div className="w-3 h-3 rounded-full bg-slate-900" />
                </div>
              </div>

              {/* Screws on Corners */}
              <div className="absolute top-2 left-2 text-slate-500 text-xs">⊕</div>
              <div className="absolute top-2 right-2 text-slate-500 text-xs">⊕</div>
              <div className="absolute bottom-2 left-2 text-slate-500 text-xs">⊕</div>
              <div className="absolute bottom-2 right-2 text-slate-500 text-xs">⊕</div>

            </div>

            {/* Pencil Rewind Easter Egg Button */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handlePencilRewind}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition transform hover:scale-105"
                title="Natraj Pencil Tape Rewind"
              >
                <RotateCcw className={`w-4 h-4 ${isPencilRewinding ? 'animate-spin' : ''}`} />
                <span>✏️ {language === 'hi' ? 'पेंसिल से कैसेट रिवाइंड करें' : 'Pencil Rewind (-15s)'}</span>
              </button>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 3. HIGHWAY NIGHT DRIVE DASHCAM MODE */}
        {/* ======================================================== */}
        {playerMode === 'highway' && (
          <div className="w-full max-w-4xl h-[420px] rounded-3xl relative overflow-hidden border-4 border-slate-700 shadow-2xl highway-road-bg flex flex-col justify-between p-6 animate-in zoom-in-95 duration-300">
            
            {/* Animated Rain Streaks */}
            <div className="rain-streak left-1/4" style={{ animationDelay: '0.1s' }} />
            <div className="rain-streak left-1/2" style={{ animationDelay: '0.4s' }} />
            <div className="rain-streak left-3/4" style={{ animationDelay: '0.2s' }} />

            {/* Dashcam HUD Header */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-emerald-400 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>REC • NH-44 GT ROAD EXPRESSWAY</span>
              </div>
              <div className="flex items-center gap-4">
                <span>SPEED: 120 KMPH</span>
                <span>RPM: 2400</span>
              </div>
            </div>

            {/* Center Night Windshield View Info */}
            <div className="relative z-10 text-center my-auto">
              <div className="inline-block p-4 rounded-3xl bg-black/70 backdrop-blur-md border border-white/10">
                <h3 className="text-2xl md:text-3xl font-black font-desi text-amber-400">
                  {language === 'hi' ? currentSong.hindiTitle : currentSong.title}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  {currentSong.artist}
                </p>
                <div className="mt-3 flex justify-center">
                  <AudioVisualizer barCount={20} height={35} width={200} color="#10b981" />
                </div>
              </div>
            </div>

            {/* Steering Horn Trigger */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="px-4 py-2 rounded-2xl bg-black/70 text-xs font-mono text-slate-300 border border-white/10">
                🌧️ RAIN AMBIANCE: ON
              </div>

              <button
                onClick={() => triggerSoundEffect('playPressureHorn')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/40 transform hover:scale-105 active:scale-95 transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>BLOW ROADWAYS HORN 🔊</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Full Player Controls */}
      <div className="relative z-10 p-6 md:p-8 bg-black/90 border-t border-white/10 glass-panel">
        <div className="max-w-2xl mx-auto space-y-4">
          
          {/* Progress Slider */}
          <div className="w-full flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full"
            />
            <span className="w-10">{formatTime(duration)}</span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            
            {/* Extra Sound Boost Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleBassBoost}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                  isBassBoost
                    ? 'bg-emerald-500 text-black border-emerald-500'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <Zap className="w-3.5 h-3.5 inline mr-1" />
                Bass 200%
              </button>

              <button
                onClick={toggleJhankar}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                  isJhankar
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                Jhankar
              </button>
            </div>

            {/* Play/Pause & Nav */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsShuffle(s => !s)}
                className={`p-2 rounded-full transition ${
                  isShuffle ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrevSong}
                className="p-2 text-slate-300 hover:text-white transition"
              >
                <SkipBack className="w-6 h-6 fill-slate-300" />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 transform hover:scale-105 active:scale-95 transition"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-slate-950" />
                ) : (
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                )}
              </button>

              <button
                onClick={handleNextSong}
                className="p-2 text-slate-300 hover:text-white transition"
              >
                <SkipForward className="w-6 h-6 fill-slate-300" />
              </button>

              <button
                onClick={() => toggleLikeSong(currentSong.id)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition"
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Horn Blast button */}
            <button
              onClick={() => triggerSoundEffect('playHornOkPlease')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>Peep Horn</span>
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};
