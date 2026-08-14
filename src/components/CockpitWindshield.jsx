import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';
import { Volume2, Zap, CloudRain, Gauge, Disc, Sparkles, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CockpitWindshield = () => {
  const {
    currentPlaylist,
    currentSong,
    isPlaying,
    togglePlay,
    triggerSoundEffect,
    analyserNode,
    language
  } = useAudio();

  const [wipersActive, setWipersActive] = useState(true);
  const [speed, setSpeed] = useState(90); // km/h
  const [highBeams, setHighBeams] = useState(false);
  const [meterFare, setMeterFare] = useState(24.50);
  const [audioLevel, setAudioLevel] = useState(0.5);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Meter Fare Ticking for Auto
  useEffect(() => {
    if (!isPlaying || currentPlaylist?.vehicleType !== 'Auto Rickshaw') return;
    const interval = setInterval(() => {
      setMeterFare(prev => +(prev + 1.25).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, currentPlaylist]);

  // Audio frequency reactivity for subwoofer / charm swing / speedometer bounce
  useEffect(() => {
    if (!analyserNode || !isPlaying) {
      setAudioLevel(0.2);
      return;
    }

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    const updateAudioLevel = () => {
      analyserNode.getByteFrequencyData(dataArray);
      let sum = 0;
      // Focus on lower bass frequencies (0 to 15)
      for (let i = 0; i < 16; i++) {
        sum += dataArray[i];
      }
      const avg = sum / 16;
      const normalized = Math.min(1.5, Math.max(0.1, avg / 120));
      setAudioLevel(normalized);
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [analyserNode, isPlaying]);

  const handleHorn = () => {
    triggerSoundEffect('horn');
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleDipper = () => {
    setHighBeams(true);
    setTimeout(() => setHighBeams(false), 300);
    setTimeout(() => {
      setHighBeams(true);
      setTimeout(() => setHighBeams(false), 250);
    }, 400);
  };

  const vehicle = currentPlaylist?.vehicleType || 'Auto Rickshaw';
  const isAuto = vehicle === 'Auto Rickshaw';
  const isTruck = vehicle.includes('Truck');
  const isBus = vehicle.includes('Bus') || vehicle.includes('Roadways');
  const isTaxi = vehicle.includes('Taxi') || vehicle.includes('Premier');
  const isTractor = vehicle.includes('Tractor');
  const isChai = vehicle.includes('Tea') || vehicle.includes('Tapri');
  const isDhol = vehicle.includes('Jeep') || vehicle.includes('Dhol');

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-[#05070c] select-none">
      
      {/* 1. HIGH SPEED ROAD VIEW (3D PERSPECTIVE CANVAS) */}
      <div className="relative w-full h-80 sm:h-96 md:h-[420px] overflow-hidden bg-[#04060a]">
        
        {/* Sky with stars / night city skyline */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#020307] via-[#090d1a] to-[#121829] flex items-end justify-center overflow-hidden">
          
          {/* City Neon Lights Silhouette */}
          <div className="absolute inset-x-0 bottom-0 h-28 flex items-end justify-around opacity-40">
            <div className="w-12 h-20 bg-indigo-950/80 border-t-2 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div className="w-16 h-28 bg-purple-950/80 border-t-2 border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.5)]" />
            <div className="w-20 h-16 bg-blue-950/80 border-t-2 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div className="w-10 h-24 bg-amber-950/80 border-t-2 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <div className="w-14 h-32 bg-slate-900/80 border-t-2 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <div className="w-24 h-14 bg-indigo-950/80 border-t-2 border-cyan-400/50" />
            <div className="w-16 h-22 bg-purple-950/80 border-t-2 border-pink-400/50" />
          </div>

          {/* Moonlight / Sunrise Glow */}
          <div className="w-28 h-28 rounded-full bg-amber-400/10 blur-2xl absolute top-6 right-12" />
        </div>

        {/* 3D Highway Road Perspective */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-[#08090e]">
          
          {/* Road Asphalt */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#11131c] via-[#0d0f17] to-[#06070b]" />

          {/* Left Green Roadside Barrier */}
          <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-emerald-950/40 to-transparent transform -skew-x-12" />
          {/* Right Roadside Barrier */}
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-emerald-950/40 to-transparent transform skew-x-12" />

          {/* Center Zooming Yellow Road Markings */}
          <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center items-center overflow-hidden">
            <div
              style={{
                animationDuration: isPlaying ? `${Math.max(0.2, 1.2 - (speed / 140) * 0.9)}s` : '0s'
              }}
              className="w-4 h-full highway-road-bg transform scale-x-150"
            />
          </div>

          {/* Road Reflection Glow from Headlights */}
          <div className={`absolute inset-x-12 bottom-0 h-32 bg-gradient-to-t ${highBeams ? 'from-yellow-200/40 via-yellow-400/20' : 'from-amber-400/15 via-amber-500/5'} to-transparent blur-xl transition-all duration-200`} />
        </div>

        {/* Rain Effect on Windshield for Taxi or Weather */}
        {(isTaxi || isChai) && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="rain-streak" style={{ left: '15%', animationDelay: '0.1s' }} />
            <div className="rain-streak" style={{ left: '35%', animationDelay: '0.4s' }} />
            <div className="rain-streak" style={{ left: '55%', animationDelay: '0.2s' }} />
            <div className="rain-streak" style={{ left: '75%', animationDelay: '0.5s' }} />
            <div className="rain-streak" style={{ left: '90%', animationDelay: '0.3s' }} />
          </div>
        )}

        {/* ANIMATED WINDSHIELD WIPER */}
        {wipersActive && (isTaxi || isTruck || isBus) && (
          <div className="absolute bottom-16 inset-x-0 pointer-events-none z-20 flex justify-around">
            <div
              style={{
                animation: isPlaying ? 'wiperSweep 1.6s ease-in-out infinite alternate' : 'none',
                transformOrigin: 'bottom center'
              }}
              className="w-1.5 h-36 bg-slate-900 border-t-2 border-slate-600 rounded-full shadow-lg"
            />
            <div
              style={{
                animation: isPlaying ? 'wiperSweep 1.6s ease-in-out infinite alternate' : 'none',
                animationDelay: '0.2s',
                transformOrigin: 'bottom center'
              }}
              className="w-1.5 h-36 bg-slate-900 border-t-2 border-slate-600 rounded-full shadow-lg"
            />
          </div>
        )}

        {/* 2. SWINGING VEHICLE CHARMS (PULSING WITH BASS) */}
        <div className="absolute top-0 inset-x-0 z-20 flex justify-center pointer-events-none">
          
          {/* Auto: Swinging Mirror & Disco Ball */}
          {isAuto && (
            <div
              style={{
                transform: `rotate(${Math.sin(Date.now() / 250) * 12 * audioLevel}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
              className="flex flex-col items-center origin-top pt-2"
            >
              <div className="w-0.5 h-16 bg-amber-400/60" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.8)] flex items-center justify-center text-xs font-black text-slate-950 border border-white">
                🪩
              </div>
            </div>
          )}

          {/* Truck: Nimbu Mirchi Evil Eye Charm */}
          {isTruck && (
            <div
              style={{
                transform: `rotate(${Math.sin(Date.now() / 300) * 16 * audioLevel}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
              className="flex flex-col items-center origin-top pt-2"
            >
              <div className="w-0.5 h-14 bg-red-500/80" />
              <div className="p-2 rounded-xl bg-black/80 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center gap-1 text-sm font-bold text-white">
                <span>🍋</span>
                <span>🌶️</span>
                <span className="text-[10px] text-amber-400 font-mono">बुरी नज़र वाले</span>
              </div>
            </div>
          )}

          {/* Tractor: Massive Dual Subwoofers Pumping */}
          {isTractor && (
            <div className="absolute top-4 inset-x-6 flex justify-between pointer-events-auto">
              <div
                style={{
                  transform: `scale(${1 + (audioLevel - 0.5) * 0.25})`,
                  transition: 'transform 0.05s linear'
                }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-900 to-black border-4 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.8)] flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-black border-2 border-purple-400 flex items-center justify-center text-xs font-mono font-bold text-purple-300">
                  SUB 808
                </div>
              </div>
              <div
                style={{
                  transform: `scale(${1 + (audioLevel - 0.5) * 0.25})`,
                  transition: 'transform 0.05s linear'
                }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-900 to-black border-4 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.8)] flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-black border-2 border-purple-400 flex items-center justify-center text-xs font-mono font-bold text-purple-300">
                  SUB 808
                </div>
              </div>
            </div>
          )}

          {/* Roadways Bus: Route Board */}
          {isBus && (
            <div className="pt-2">
              <div className="px-5 py-1.5 rounded-lg bg-red-700 border-2 border-yellow-300 text-yellow-300 font-black text-xs sm:text-sm tracking-widest shadow-xl flex items-center gap-2">
                <span>⚡</span>
                <span>दिल्ली ➔ रोहतक ➔ चंडीगढ़ सुपरफास्ट</span>
                <span>⚡</span>
              </div>
            </div>
          )}
        </div>

        {/* HUD Overlay Info Badges */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 shadow-lg">
            <span className="text-xl">{currentPlaylist?.icon || '🛺'}</span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                {currentPlaylist?.vehicleType || 'Auto'}
              </div>
              <div className="text-xs font-bold truncate max-w-[120px] sm:max-w-[180px]">
                {currentSong?.title || 'No song selected'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. COCKPIT DASHBOARD CONTROLS & GAUGES */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-[#090b14] via-[#0e111e] to-[#121524] border-t-2 border-white/10">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
          
          {/* Gauge 1: Speedometer with Bouncing Needle */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center shadow-inner">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span>SPEED</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 drop-shadow">
              {isPlaying ? Math.round(speed + (audioLevel - 0.5) * 15) : 0} <span className="text-xs text-white font-normal">KM/H</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${(speed / 140) * 100}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full transition-all"
              />
            </div>
          </div>

          {/* Gauge 2: Auto Electronic Meter / Truck Diesel Gauge */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center shadow-inner">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
              {isAuto ? 'FARECAB METER' : 'BASS OUTPUT'}
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 drop-shadow">
              {isAuto ? `₹ ${meterFare.toFixed(2)}` : `${Math.round(audioLevel * 100)} %`}
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-1">
              {isAuto ? 'TICKET: ACTIVE' : 'SUBWOOFER: PUMPING'}
            </span>
          </div>

          {/* Control 1: Big Loud Pressure Horn Button */}
          <button
            onClick={handleHorn}
            className="p-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black flex flex-col items-center justify-center shadow-lg shadow-red-600/30 transition transform hover:scale-105 active:scale-95 border border-red-400/40"
          >
            <Volume2 className="w-6 h-6 mb-0.5 animate-bounce" />
            <span className="text-xs font-desi">
              {language === 'hi' ? 'हॉर्न बजाओ!' : 'BLAST HORN!'}
            </span>
            <span className="text-[9px] font-mono opacity-80">KEY [1]</span>
          </button>

          {/* Control 2: Headlights High-Beam Dipper */}
          <button
            onClick={handleDipper}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold flex flex-col items-center justify-center border border-white/10 transition transform hover:scale-105 active:scale-95"
          >
            <Zap className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-xs">
              {language === 'hi' ? 'डिपर मारो' : 'Dipper Beam'}
            </span>
            <span className="text-[9px] text-slate-400 font-mono">FLASH LIGHTS</span>
          </button>

          {/* Control 3: Speed Accelerator Slider */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 col-span-2 sm:col-span-2 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 font-bold mb-1">
              <span>{language === 'hi' ? 'गाड़ी की स्पीड (Race)' : 'ACCELERATOR'}</span>
              <span className="text-amber-400">{speed} km/h</span>
            </div>
            <input
              type="range"
              min="30"
              max="140"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer accent-amber-400"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
