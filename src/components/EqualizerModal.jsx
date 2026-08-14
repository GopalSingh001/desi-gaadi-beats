import React from 'react';
import { Sliders, X, Zap, Volume2, Sparkles, Disc } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const EqualizerModal = () => {
  const {
    isEqualizerOpen,
    setIsEqualizerOpen,
    isBassBoost,
    toggleBassBoost,
    isJhankar,
    toggleJhankar,
    language
  } = useAudio();

  if (!isEqualizerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#121522] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => setIsEqualizerOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-desi text-white">
              {language === 'hi' ? 'देसी इक्वलाइज़र & बीट ट्यूनर' : 'Desi Equalizer & Jhankar Tuner'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'कस्टमाइज करें साउंड और बास को' : 'Hardware-accelerated sound enhancement'}
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 my-6">
          
          {/* Haryana Sub-Bass 200% */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isBassBoost
              ? 'bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isBassBoost ? 'bg-emerald-500 text-black' : 'bg-white/10 text-emerald-400'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {language === 'hi' ? 'हरियाणा रोडवेज बास बूस्ट (200%)' : 'Haryana Roadways Sub-Bass 200%'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'hi' ? 'डीप 120Hz सब-वूफर पंच' : 'Deep 120Hz punch calibrated for heavy woofers'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleBassBoost}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isBassBoost ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isBassBoost ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 90s DJ Jhankar Beats */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isJhankar
              ? 'bg-gradient-to-r from-amber-950/60 to-amber-900/30 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isJhankar ? 'bg-amber-500 text-black' : 'bg-white/10 text-amber-400'}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {language === 'hi' ? '90s डीजे झंकार बीट्स' : '90s DJ Jhankar Cassette Echo'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'hi' ? 'क्रिस्टल क्लियर ढोलक छन-छन इफ़ेक्ट' : 'Sparkling high-frequency dholak & cassette sparkle'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleJhankar}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isJhankar ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isJhankar ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Visualizer Graphic */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center gap-1.5 h-16">
          <div className="w-2 rounded bg-amber-400 eq-bar" />
          <div className="w-2 rounded bg-emerald-400 eq-bar" />
          <div className="w-2 rounded bg-red-400 eq-bar" />
          <div className="w-2 rounded bg-blue-400 eq-bar" />
          <div className="w-2 rounded bg-purple-400 eq-bar" />
          <div className="w-2 rounded bg-amber-400 eq-bar" />
          <div className="w-2 rounded bg-emerald-400 eq-bar" />
        </div>

        {/* Done Button */}
        <button
          onClick={() => setIsEqualizerOpen(false)}
          className="w-full mt-6 py-3 rounded-2xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
        >
          {language === 'hi' ? 'सेट करें (Apply Settings)' : 'Save & Tune'}
        </button>

      </div>
    </div>
  );
};
