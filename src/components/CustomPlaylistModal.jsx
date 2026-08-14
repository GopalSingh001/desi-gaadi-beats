import React, { useState } from 'react';
import { Plus, X, ListPlus, Music2, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const emojiOptions = ['🛺', '🚛', '🚌', '🚖', '🚜', '☕', '🎺', '🔥', '❤️', '⚡'];
const colorOptions = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export const CustomPlaylistModal = () => {
  const {
    isCustomPlaylistModalOpen,
    setIsCustomPlaylistModalOpen,
    createCustomPlaylist,
    language
  } = useAudio();

  const [title, setTitle] = useState('');
  const [hindiTitle, setHindiTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🛺');
  const [selectedColor, setSelectedColor] = useState('#f59e0b');

  if (!isCustomPlaylistModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    createCustomPlaylist(title.trim(), hindiTitle.trim() || title.trim(), description.trim(), selectedEmoji, selectedColor);
    setTitle('');
    setHindiTitle('');
    setDescription('');
    setIsCustomPlaylistModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#121522] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCustomPlaylistModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ListPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-desi text-white">
              {language === 'hi' ? 'अपनी नई प्लेलिस्ट बनाएं' : 'Create Custom Playlist'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'अपने पसंदीदा गानों का देसी मिक्स' : 'Assemble your personalized highway collection'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'hi' ? 'प्लेलिस्ट का नाम (English Title)' : 'Playlist Name'} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Night Drive with Chai"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'hi' ? 'हिंदी नाम (Hindi Title Optional)' : 'Hindi Title (Optional)'}
            </label>
            <input
              type="text"
              value={hindiTitle}
              onChange={(e) => setHindiTitle(e.target.value)}
              placeholder="उदा. रात का सुहाना सफर"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'hi' ? 'विवरण (Description)' : 'Description'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Best tracks for GT Road travel..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
            />
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'hi' ? 'आइकॉन चुनें' : 'Choose Vehicle / Mood Icon'}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {emojiOptions.map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setSelectedEmoji(em)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition ${
                    selectedEmoji === em ? 'border-amber-400 bg-amber-500/20 scale-110' : 'border-white/10 bg-white/5'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'hi' ? 'थीम रंग' : 'Accent Color'}
            </label>
            <div className="flex items-center gap-3">
              {colorOptions.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full transition transform ${
                    selectedColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-5 h-5" />
            {language === 'hi' ? 'प्लेलिस्ट बनाएं' : 'Create Playlist'}
          </button>
        </form>

      </div>
    </div>
  );
};
