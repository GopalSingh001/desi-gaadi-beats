import React, { useRef } from 'react';
import { Upload, Music, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import confetti from 'canvas-confetti';

export const AudioUploader = () => {
  const { playSong, setCurrentPlaylist, language } = useAudio();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    const customTrack = {
      id: `local-${Date.now()}`,
      title: fileName,
      hindiTitle: fileName,
      artist: "Your Device Audio",
      album: "Local Audio Track",
      duration: "4:00",
      durationSeconds: 240,
      audioUrl: fileUrl,
      isLocalAudio: true,
      coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      tag: "Custom Audio",
      tempo: 130
    };

    const localPlaylist = {
      id: `local-pl-${Date.now()}`,
      title: "My Local Driver Deck",
      hindiTitle: "मेरी लोकल गाड़ी प्लेलिस्ट",
      vehicleType: "Custom Vehicle",
      icon: "⚡",
      accentColor: "#F59E0B",
      badge: "Real Audio Loaded",
      songs: [customTrack]
    };

    setCurrentPlaylist(localPlaylist);
    playSong(customTrack, localPlaylist);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border-2 border-dashed border-amber-500/40 hover:border-amber-400 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
      
      <div className="flex items-center gap-3.5 text-left">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 text-xl shadow">
          🎧
        </div>
        <div>
          <h4 className="text-sm md:text-base font-bold text-white font-desi flex items-center gap-2">
            <span>{language === 'hi' ? 'अपना असली MP3 गाना चलाएं (Play Real Song)' : 'Play Your Own Real MP3 Song'}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              REAL AUDIO
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            {language === 'hi'
              ? 'कंप्यूटर से कोई भी MP3 गाना चुनें और कॉकपिट में 3D डैशबोर्ड के साथ असली आवाज़ में सुनें!'
              : 'Select any MP3 from your device to drive with real audio and live 3D visualizer!'}
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full sm:w-auto px-6 py-3 rounded-xl btn-primary text-xs md:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 shrink-0 active:scale-95 transition"
      >
        <Upload className="w-4 h-4" />
        <span>{language === 'hi' ? 'MP3 फाइल चुनें' : 'Choose MP3 File'}</span>
      </button>

    </div>
  );
};
