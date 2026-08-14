import React, { useState } from 'react';
import { Home, Heart, Music, Volume2, Sliders, Plus, ChevronRight, X } from 'lucide-react';
import { playlists } from '../data/playlistsData';
import { highwayShayari } from '../data/triviaData';
import { useAudio } from '../context/AudioContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const {
    currentPlaylist,
    setCurrentPlaylist,
    activeTab,
    setActiveTab,
    likedSongIds,
    customPlaylists,
    setIsCustomPlaylistModalOpen,
    setIsSoundboardOpen,
    setIsEqualizerOpen,
    isBassBoost,
    isJhankar,
    language
  } = useAudio();

  const [shayariIdx, setShayariIdx] = useState(0);

  const handleNextShayari = (e) => {
    e.stopPropagation();
    setShayariIdx((shayariIdx + 1) % highwayShayari.length);
  };

  const currentShayari = highwayShayari[shayariIdx];

  const handleSelectPlaylist = (p) => {
    setCurrentPlaylist(p);
    setActiveTab('playlist-detail');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 md:w-64 lg:w-72 bg-[#0c0e17] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto px-4 py-5 space-y-6">
          
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🛺</span>
              <span className="font-bold text-white font-desi text-lg">देसी बीट्स</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-mono">
              {language === 'hi' ? 'नेविगेशन' : 'MAIN MENU'}
            </div>

            <button
              onClick={() => {
                setActiveTab('home');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'home'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{language === 'hi' ? 'होम स्क्रीन' : 'Home'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('liked');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'liked'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{language === 'hi' ? 'पसंदीदा गाने' : 'Liked Songs'}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
                {likedSongIds.length}
              </span>
            </button>

            <button
              onClick={() => {
                setIsSoundboardOpen(true);
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-red-400" />
                <span>{language === 'hi' ? 'प्रेशर हॉर्न पैड' : 'Horn Soundboard'}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono">
                1-6
              </span>
            </button>

            <button
              onClick={() => {
                setIsEqualizerOpen(true);
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'झंकार & इक्वलाइज़र' : 'Equalizer / Jhankar'}</span>
              </div>
              {(isBassBoost || isJhankar) && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          </div>

          {/* Authentic Driver Playlists */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="px-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {language === 'hi' ? 'ड्राइवर प्लेलिस्ट्स' : 'DRIVER PLAYLISTS'}
              </span>
            </div>

            <div className="space-y-1">
              {playlists.map((p) => {
                const isSelected = activeTab === 'playlist-detail' && currentPlaylist?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPlaylist(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
                      isSelected
                        ? 'bg-white/10 text-amber-400 font-bold border-l-4 border-amber-500'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-base shrink-0">{p.icon}</span>
                    <span className="truncate flex-1">
                      {language === 'hi' ? p.hindiTitle : p.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom User Playlists */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between px-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {language === 'hi' ? 'मेरी प्लेलिस्ट्स' : 'MY PLAYLISTS'}
              </span>
              <button
                onClick={() => setIsCustomPlaylistModalOpen(true)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-400 transition"
                title="Create New Playlist"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {customPlaylists.map((cp) => (
                <button
                  key={cp.id}
                  onClick={() => {
                    setCurrentPlaylist({
                      id: cp.id,
                      title: cp.title,
                      hindiTitle: cp.hindiTitle,
                      category: 'Custom',
                      icon: cp.icon || '✨',
                      accentColor: cp.color || '#ec4899',
                      badge: 'Custom Mix',
                      description: cp.description || 'User personalized playlist',
                      songs: cp.songIds.map(sid => {
                        const found = playlists.flatMap(pl => pl.songs).find(s => s.id === sid);
                        return found || {
                          id: sid,
                          title: 'Custom Track',
                          hindiTitle: 'कस्टम ट्रैक',
                          artist: 'Desi Gaadi Beats',
                          duration: '3:30',
                          durationSeconds: 210,
                          synthTrackType: 'auto_banger',
                          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                          coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
                          tag: 'Custom',
                          tempo: 130
                        };
                      })
                    });
                    setActiveTab('playlist-detail');
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left text-slate-400 hover:bg-white/5 hover:text-slate-200 transition"
                >
                  <span>{cp.icon || '🎵'}</span>
                  <span className="truncate flex-1">
                    {language === 'hi' ? cp.hindiTitle : cp.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {cp.songIds.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Highway Shayari Truck Art Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181308] via-[#1c160a] to-[#0c0e17] border border-amber-500/30 shadow-lg relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
                <span>{currentShayari.icon}</span>
                {language === 'hi' ? 'हाईवे शायरी' : 'HIGHWAY QUOTE'}
              </span>
              <button
                onClick={handleNextShayari}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 transition"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-bold text-white font-desi leading-relaxed mt-1">
              "{language === 'hi' ? currentShayari.hindi : currentShayari.english}"
            </p>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">
              — {currentShayari.author}
            </p>
          </div>

        </div>

        {/* Status bar */}
        <div className="p-3.5 border-t border-white/10 bg-black/60 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>120 KMPH STEREO</span>
          </div>
          <span className="text-amber-400 font-bold">HORN OK PLEASE</span>
        </div>
      </aside>
    </>
  );
};
