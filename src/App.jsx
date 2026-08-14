import React from 'react';
import { RealVehicleCabinPlayer } from './components/RealVehicleCabinPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      
      {/* Top Simple Brand Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#07090e]/90 border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 text-xl font-black shadow-md shadow-amber-500/20">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white font-desi">
                DESI GAADI BEATS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                100% REAL SONGS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              असली गानों का देसी गाड़ी प्लेयर (Auto • Truck • Bus • Taxi • Tractor)
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-amber-400 font-bold hidden sm:block">
          HORN OK PLEASE
        </div>
      </header>

      {/* Main Single-Page Vehicle Cabin */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
        <RealVehicleCabinPlayer />
      </main>

      {/* Simple Footer */}
      <footer className="py-4 border-t border-white/10 text-center text-xs text-slate-400 font-mono bg-black/40">
        Desi Gaadi Beats • Indian Driver & Highway Audio Player
      </footer>

    </div>
  );
}
