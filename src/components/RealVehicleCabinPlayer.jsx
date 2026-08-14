import React, { useState, useEffect, useRef } from 'react';
import { vehicles } from '../data/playlistsData';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Sparkles, Upload, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RealVehicleCabinPlayer = () => {
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [activeSongIndex, setActiveSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [localAudioUrl, setLocalAudioUrl] = useState(null);
  const [localSongTitle, setLocalSongTitle] = useState(null);
  const [fare, setFare] = useState(24.50);
  const [isHornActive, setIsHornActive] = useState(false);

  const currentVehicle = vehicles[activeVehicleIndex];
  const currentSong = localAudioUrl
    ? { title: localSongTitle, artist: "Local MP3 Audio", duration: "Playing", youtubeId: null }
    : currentVehicle.songs[activeSongIndex];

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto Fare ticking
  useEffect(() => {
    if (!isPlaying || currentVehicle.id !== 'auto') return;
    const interval = setInterval(() => {
      setFare(prev => +(prev + 1.25).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, currentVehicle]);

  const handleSelectVehicle = (idx) => {
    setActiveVehicleIndex(idx);
    setActiveSongIndex(0);
    setLocalAudioUrl(null);
    setIsPlaying(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  };

  const handleSelectSong = (idx) => {
    setActiveSongIndex(idx);
    setLocalAudioUrl(null);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (localAudioUrl) return;
    setActiveSongIndex((activeSongIndex + 1) % currentVehicle.songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (localAudioUrl) return;
    setActiveSongIndex((activeSongIndex - 1 + currentVehicle.songs.length) % currentVehicle.songs.length);
    setIsPlaying(true);
  };

  const handleHorn = () => {
    setIsHornActive(true);
    setTimeout(() => setIsHornActive(false), 500);

    // Play horn sound synthesis or audio
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.frequency.value = currentVehicle.id === 'truck' ? 180 : currentVehicle.id === 'auto' ? 440 : 320;
      osc2.frequency.value = currentVehicle.id === 'truck' ? 240 : currentVehicle.id === 'auto' ? 580 : 480;
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.5);
      osc2.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}

    confetti({ particleCount: 20, spread: 50, origin: { y: 0.7 } });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalAudioUrl(url);
    setLocalSongTitle(file.name.replace(/\.[^/.]+$/, ""));
    setIsPlaying(true);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* 1. TOP VEHICLE SELECTOR BUTTONS */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black font-desi text-white flex items-center justify-center gap-2 drop-shadow-md">
          <span>{currentVehicle.icon}</span>
          <span>{currentVehicle.hindiName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-mono">
          {currentVehicle.tagline}
        </p>

        {/* 5 Big Clean Vehicle Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {vehicles.map((v, idx) => {
            const isSelected = activeVehicleIndex === idx;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVehicle(idx)}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all transform active:scale-95 border-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-xl shadow-amber-500/30 scale-105'
                    : 'bg-[#0f121e] hover:bg-[#151928] text-slate-200 border-white/10 hover:border-white/25'
                }`}
              >
                <span className="text-3xl mb-1">{v.icon}</span>
                <span className="text-xs font-bold truncate w-full">{v.name}</span>
                <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-slate-900 font-bold' : 'text-amber-400'}`}>
                  {v.songs.length} Real Songs
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. REALISTIC VEHICLE CABIN FRAME */}
      <div className={`relative rounded-3xl overflow-hidden border-4 ${isHornActive ? 'scale-[1.02] border-red-500' : 'border-white/15'} bg-[#06080e] shadow-2xl transition-all duration-150`}>
        
        {/* Top Windshield Banner */}
        <div className="px-6 py-2.5 bg-black/80 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">{currentVehicle.name.toUpperCase()} COCKPIT</span>
          </div>
          <div className="text-amber-400 font-bold">
            {currentVehicle.id === 'auto' ? `FARECAB: ₹ ${fare.toFixed(2)}` : currentVehicle.meter}
          </div>
        </div>

        {/* Real YouTube Video / Audio Embed Screen */}
        <div className="relative w-full aspect-video sm:h-80 md:h-96 bg-black flex items-center justify-center overflow-hidden">
          
          {localAudioUrl ? (
            /* Local MP3 Player View */
            <div className="text-center p-8 space-y-3">
              <audio
                ref={audioRef}
                src={localAudioUrl}
                autoPlay={isPlaying}
                loop
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <span className="text-5xl block animate-bounce">🎧</span>
              <h3 className="text-xl font-bold text-white">{localSongTitle}</h3>
              <p className="text-xs text-emerald-400 font-mono font-bold">PLAYING REAL LOCAL AUDIO</p>
            </div>
          ) : (
            /* Real YouTube Song Embed */
            currentSong.youtubeId ? (
              <iframe
                key={`${currentVehicle.id}-${activeSongIndex}-${isPlaying}`}
                className="w-full h-full object-cover"
                src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&rel=0&controls=1&modestbranding=1`}
                title={currentSong.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-slate-400 text-sm font-mono">Loading song...</div>
            )
          )}

          {/* Swinging Charm on Top */}
          <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none z-10">
            {currentVehicle.id === 'truck' && (
              <div className="px-3 py-1 rounded-full bg-black/80 border border-red-500/50 text-xs font-bold text-amber-300 shadow-lg animate-pulse">
                🍋 🌶️ बुरी नज़र वाले तेरा मुंह काला
              </div>
            )}
            {currentVehicle.id === 'auto' && (
              <div className="px-3 py-1 rounded-full bg-black/80 border border-amber-500/50 text-xs font-bold text-amber-300 shadow-lg">
                🛺 मीटर चालू है - नो बारगेनिंग
              </div>
            )}
            {currentVehicle.id === 'roadways' && (
              <div className="px-3 py-1 rounded-full bg-red-800 border-2 border-yellow-300 text-xs font-black text-yellow-300 shadow-lg">
                ⚡ हरियाणा रोडवेज - 120 KMPH ⚡
              </div>
            )}
          </div>

        </div>

        {/* Cabin Dashboard Control Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-[#090b14] to-[#121626] border-t-2 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Song Info */}
          <div className="text-center sm:text-left min-w-0 flex-1">
            <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              {currentVehicle.hindiName}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white truncate">
              {currentSong.hindiTitle || currentSong.title}
            </h2>
            <p className="text-xs text-slate-400 truncate">
              {currentSong.artist} • {currentSong.duration}
            </p>
          </div>

          {/* Big Horn Button */}
          <button
            onClick={handleHorn}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition transform"
          >
            <Volume2 className="w-5 h-5 animate-bounce" />
            <span>हॉर्न बजाओ (BLAST HORN)</span>
          </button>

          {/* Local MP3 Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition"
              title="Upload your own song"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>अपना MP3 चलाएं</span>
            </button>
          </div>

        </div>

      </div>

      {/* 3. SIMPLE 1-CLICK REAL SONGS PLAYLIST */}
      <div className="rounded-3xl bg-[#0c0e18] border border-white/10 p-5 sm:p-7 shadow-xl space-y-3">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentVehicle.icon}</span>
            <h3 className="text-lg font-bold font-desi text-white">
              {currentVehicle.name} - असली गानों की लिस्ट
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            100% REAL AUDIO
          </span>
        </div>

        {/* Song Cards */}
        <div className="space-y-2">
          {currentVehicle.songs.map((song, idx) => {
            const isSelected = !localAudioUrl && activeSongIndex === idx;

            return (
              <div
                key={song.id}
                onClick={() => handleSelectSong(idx)}
                className={`group cursor-pointer p-4 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isSelected ? 'bg-slate-950 text-amber-400' : 'bg-white/10 text-slate-300'
                  }`}>
                    {isSelected ? '▶' : idx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">
                      {song.hindiTitle || song.title}
                    </div>
                    <div className={`text-xs truncate ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {song.artist} • <span className="font-mono">{song.album}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-mono ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                    {song.duration}
                  </span>
                  <button className={`p-2 rounded-full ${isSelected ? 'bg-slate-950 text-white' : 'bg-white/10 text-white'}`}>
                    <Play className="w-3.5 h-3.5 fill-current" />
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
