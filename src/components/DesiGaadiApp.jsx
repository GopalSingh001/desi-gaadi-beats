import React, { useState, useEffect, useRef } from 'react';
import { vehicles } from '../data/playlistsData';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Upload, Sparkles, Flame, Gauge, Disc
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DesiGaadiApp = () => {
  const [vehicleIdx, setVehicleIdx] = useState(0);
  const [songIdx, setSongIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [localAudioUrl, setLocalAudioUrl] = useState(null);
  const [localTitle, setLocalTitle] = useState(null);
  const [meterFare, setMeterFare] = useState(24.50);
  const [audioFreqLevel, setAudioFreqLevel] = useState(0.5);

  const currentVehicle = vehicles[vehicleIdx];
  const currentSong = localAudioUrl
    ? {
        id: 'local',
        title: localTitle,
        hindiTitle: localTitle,
        artist: 'My Device Audio',
        album: 'Local Song',
        duration: 'Playing',
        audioUrl: localAudioUrl,
        coverArt: currentVehicle.heroImage,
        tag: 'Local MP3'
      }
    : currentVehicle.songs[songIdx];

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameRef = useRef(null);

  // Meter Fare ticking for Auto
  useEffect(() => {
    if (!isPlaying || currentVehicle.id !== 'auto') return;
    const interval = setInterval(() => {
      setMeterFare(prev => +(prev + 1.50).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, currentVehicle]);

  // Connect Web Audio API Analyser to HTML5 Audio
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const setupAudioContext = () => {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;

        try {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        } catch (e) {}
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    const handlePlay = () => {
      setupAudioContext();
      setIsPlaying(true);
    };

    audioElement.addEventListener('play', handlePlay);
    return () => audioElement.removeEventListener('play', handlePlay);
  }, []);

  // Audio frequency loop
  useEffect(() => {
    const updateFrequency = () => {
      if (analyserRef.current && isPlaying) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < 8; i++) sum += data[i];
        const avg = sum / 8;
        setAudioFreqLevel(Math.min(1.5, Math.max(0.2, avg / 100)));
      }
      animFrameRef.current = requestAnimationFrame(updateFrequency);
    };

    if (isPlaying) {
      updateFrequency();
    } else {
      setAudioFreqLevel(0.2);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Playback handlers
  const handleSelectVehicle = (idx) => {
    setVehicleIdx(idx);
    setSongIdx(0);
    setLocalAudioUrl(null);
    setCurrentTime(0);
    setIsPlaying(true);

    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const handleSelectSong = (idx) => {
    setSongIdx(idx);
    setLocalAudioUrl(null);
    setCurrentTime(0);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleNext = () => {
    if (localAudioUrl) return;
    let nextIdx = (songIdx + 1) % currentVehicle.songs.length;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * currentVehicle.songs.length);
    }
    handleSelectSong(nextIdx);
  };

  const handlePrev = () => {
    if (localAudioUrl) return;
    const prevIdx = (songIdx - 1 + currentVehicle.songs.length) % currentVehicle.songs.length;
    handleSelectSong(prevIdx);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (val) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleHorn = () => {
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.7 } });
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = currentVehicle.id === 'truck' ? 190 : currentVehicle.id === 'roadways' ? 260 : 420;
      osc2.frequency.value = currentVehicle.id === 'truck' ? 280 : currentVehicle.id === 'roadways' ? 390 : 560;
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  const handleLocalUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalAudioUrl(url);
    setLocalTitle(file.name.replace(/\.[^/.]+$/, ""));
    setCurrentTime(0);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 150);

    confetti({ particleCount: 45, spread: 80, origin: { y: 0.6 } });
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === null) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto select-none">
      
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
        autoPlay={isPlaying}
      />

      {/* 1. TOP VEHICLE CHANGER TABS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <span className="text-sm font-bold font-desi text-white">गाड़ी चुनें (Select Vehicle):</span>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold">
            100% REAL AUDIO
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {vehicles.map((v, idx) => {
            const isSelected = vehicleIdx === idx;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVehicle(idx)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all transform active:scale-95 border-2 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-xl shadow-amber-400/25 scale-105'
                    : 'bg-[#0f121e] hover:bg-[#161a29] text-white border-white/8 hover:border-white/20'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1">{v.icon}</span>
                <span className="text-xs font-bold truncate w-full">{v.name}</span>
                <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-slate-900 font-bold' : 'text-amber-400'}`}>
                  {v.songs.length} Real Tracks
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN COCKPIT & TRACKLIST DUAL VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left (5 Cols): Vehicle Cockpit Stage */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0c0e18] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-5">
          
          {/* Vehicle Artwork Frame with Glow */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black">
            <img
              src={currentSong.coverArt || currentVehicle.heroImage}
              alt={currentVehicle.name}
              className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''} transition-transform duration-700`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Top Left Vehicle Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 shadow">
              <span className="text-base">{currentVehicle.icon}</span>
              <span>{currentVehicle.name}</span>
            </div>

            {/* Top Right Meter */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-xs font-mono font-bold text-amber-300 shadow">
              {currentVehicle.id === 'auto' ? `METER: ₹ ${meterFare.toFixed(2)}` : currentVehicle.meter}
            </div>

            {/* Live Visualizer Waves on Image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-center gap-1.5 h-10">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: isPlaying ? `${Math.min(100, Math.max(15, (audioFreqLevel * 60) + Math.sin(i + Date.now() / 200) * 35))}%` : '15%',
                    transition: 'height 0.1s ease'
                  }}
                  className="w-2 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* Vehicle Info & Shayari Quote */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-desi text-white">
              {currentVehicle.hindiName}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentVehicle.tagline}
            </p>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold italic">"{currentVehicle.shayari}"</span>
              <span className="text-slate-400">{currentVehicle.speed}</span>
            </div>
          </div>

          {/* Action Buttons: Blast Horn & Upload Custom MP3 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleHorn}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition"
            >
              <Volume2 className="w-5 h-5 animate-bounce" />
              <span>हॉर्न बजाओ!</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 rounded-2xl bg-white/8 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/12 active:scale-95 transition"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>अपना गाना चलाएं</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleLocalUpload}
              className="hidden"
            />
          </div>

        </div>

        {/* Right (7 Cols): Real Song Tracklist */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0c0e18] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div>
              <h3 className="text-lg font-bold font-desi text-white flex items-center gap-2">
                <span>{currentVehicle.icon}</span>
                <span>{currentVehicle.name} - सुपरहिट गाने</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                क्लिक करें और सीधे असली आवाज़ में गाना सुनें
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {currentVehicle.songs.length} TRACKS
            </span>
          </div>

          {/* Tracks List */}
          <div className="space-y-2.5">
            {currentVehicle.songs.map((song, idx) => {
              const isSelected = !localAudioUrl && songIdx === idx;

              return (
                <div
                  key={song.id}
                  onClick={() => handleSelectSong(idx)}
                  className={`group cursor-pointer p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-lg shadow-amber-400/20'
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/6 hover:border-white/15'
                  }`}
                >
                  {/* Left: Play Icon / Num + Cover + Titles */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    
                    {/* Index or Dancing Equalizer */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isSelected ? 'bg-slate-950 text-amber-400' : 'bg-white/10 text-slate-300'
                    }`}>
                      {isSelected && isPlaying ? (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
                          <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-11 h-11 rounded-xl object-cover border border-white/10 shrink-0 shadow"
                    />

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate">
                        {song.hindiTitle || song.title}
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                        {song.artist} • <span className="font-mono">{song.album}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right: Tag & Duration */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full hidden sm:inline ${
                      isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'
                    }`}>
                      {song.tag}
                    </span>

                    <span className={`text-xs font-mono w-10 text-right ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                      {song.duration}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          handleTogglePlay();
                        } else {
                          handleSelectSong(idx);
                        }
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow ${
                        isSelected ? 'bg-slate-950 text-white' : 'bg-white/10 text-white hover:bg-amber-400 hover:text-slate-950'
                      }`}
                    >
                      {isSelected && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 3. FLOATING LUXURY MUSIC PLAYER DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-22 md:h-24 backdrop-blur-2xl bg-[#090b14]/95 border-t border-white/10 px-4 sm:px-8 flex items-center justify-between gap-3 shadow-2xl">
        
        {/* Left: Current Track Thumbnail & Name */}
        <div className="flex items-center gap-3 w-1/4 min-w-[140px] max-w-[260px]">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow bg-slate-900">
            <img
              src={currentSong.coverArt || currentVehicle.heroImage}
              alt={currentSong.title}
              className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : ''} transition-transform duration-500`}
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-white truncate">
              {currentSong.hindiTitle || currentSong.title}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {currentSong.artist}
            </div>
          </div>
        </div>

        {/* Center: Controls & Seek Bar */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl px-2">
          
          {/* Playback Buttons */}
          <div className="flex items-center gap-4 mb-1.5">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-1.5 rounded-full transition hidden sm:block ${
                isShuffle ? 'text-amber-400 bg-amber-400/15' : 'text-slate-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full text-slate-300 hover:text-white transition active:scale-95"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full btn-primary flex items-center justify-center text-slate-950 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-full text-slate-300 hover:text-white transition active:scale-95"
              title="Next"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>

            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-1.5 rounded-full transition hidden sm:block ${
                isRepeat ? 'text-amber-400 bg-amber-400/15' : 'text-slate-400 hover:text-white'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Time Seekbar */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-8 text-right shrink-0">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full cursor-pointer accent-amber-400"
            />
            <span className="w-8 text-left shrink-0">{formatTime(duration)}</span>
          </div>

        </div>

        {/* Right: Volume Controls */}
        <div className="flex items-center justify-end gap-2 w-1/4 min-w-[100px]">
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-full text-slate-400 hover:text-white transition"
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
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-16 sm:w-20 h-1 bg-white/15 rounded-full cursor-pointer accent-amber-400 hidden sm:block"
          />
        </div>

      </div>

    </div>
  );
};
