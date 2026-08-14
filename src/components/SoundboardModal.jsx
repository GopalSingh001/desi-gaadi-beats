import React, { useEffect, useState } from 'react';
import { Volume2, Megaphone, Gauge, Truck, Coffee, Sparkles, X, Flame } from 'lucide-react';
import { soundboardEffects } from '../data/soundboardData';
import { useAudio } from '../context/AudioContext';
import confetti from 'canvas-confetti';

const iconMap = {
  Volume2: Volume2,
  Megaphone: Megaphone,
  Gauge: Gauge,
  Truck: Truck,
  Coffee: Coffee,
  Sparkles: Sparkles
};

export const SoundboardModal = () => {
  const { isSoundboardOpen, setIsSoundboardOpen, triggerSoundEffect, language } = useAudio();
  const [activePad, setActivePad] = useState(null);

  // Keyboard shortcut listener for 1-6 keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isSoundboardOpen) return;
      const key = e.key;
      const effect = soundboardEffects.find(s => s.hotkey === key);
      if (effect) {
        handleTrigger(effect);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSoundboardOpen]);

  if (!isSoundboardOpen) return null;

  const handleTrigger = (effect) => {
    setActivePad(effect.id);
    triggerSoundEffect(effect.action);

    if (effect.id === 'pressure-horn' || effect.id === 'desi-seeti') {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#ffffff']
      });
    }

    setTimeout(() => {
      setActivePad(null);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121522] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        
        {/* Decorative Truck Decal Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-red-500 to-emerald-500" />
        
        {/* Close Button */}
        <button
          onClick={() => setIsSoundboardOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title & Desi Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-wide font-desi text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200">
              {language === 'hi' ? 'देसी हॉर्न & साउंडबोर्ड' : 'Desi Highway Soundboard'}
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              {language === 'hi'
                ? 'गाने के साथ कभी भी बजाएं - हॉटकी 1 से 6 दबाएं!'
                : 'Blast pressure horns & driver sound effects over any song! Press [1] to [6]'}
            </p>
          </div>
        </div>

        {/* Soundboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 my-6">
          {soundboardEffects.map((item) => {
            const Icon = iconMap[item.icon] || Volume2;
            const isActive = activePad === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTrigger(item)}
                style={{
                  boxShadow: isActive ? `0 0 25px ${item.color}` : 'none',
                  borderColor: isActive ? item.color : 'rgba(255,255,255,0.1)'
                }}
                className={`relative group flex flex-col items-center justify-center p-4 md:p-5 rounded-2xl border bg-gradient-to-b from-slate-900/90 to-[#181d2e] transition-all duration-150 transform ${
                  isActive ? 'scale-95 bg-white/10 ring-2' : 'hover:-translate-y-1 hover:border-amber-400/50'
                }`}
              >
                {/* Hotkey Badge */}
                <span className="absolute top-2.5 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold border border-white/10">
                  KEY {item.hotkey}
                </span>

                {/* Icon */}
                <div
                  style={{ backgroundColor: `${item.color}25`, color: item.color }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner"
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Name */}
                <div className="text-sm font-bold text-white text-center leading-tight mb-1">
                  {language === 'hi' ? item.hindiName : item.name}
                </div>

                {/* Tag */}
                <span className="text-[11px] text-amber-400/90 font-medium">
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {language === 'hi' ? 'वेब ऑडियो सिंथेसाइजर एक्टिव' : 'Web Audio Synth Engine Active'}
          </span>
          <span className="font-mono text-amber-400">
            HORN OK PLEASE 🚛
          </span>
        </div>

      </div>
    </div>
  );
};
