import React, { useState } from 'react';
import { Home, Heart, Music, Radio, Volume2, Sliders, Plus, Disc3, Sparkles, X, ChevronRight } from 'lucide-react';
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

  // Random shayari
  const [shayariIdx, setShayariIdx] = useState(0);

  const handleNextShayari = () => {
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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 md:w-60 lg:w-64 bg-[#0d0f18] border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto px-4 py-5 space-y-6">
          
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between md:hidden pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛺</span>
              <span className="font-bold text-white font-desi">देसी बीट्स</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              {language === 'hi' ? 'नेविगेशन' : 'Menu'}
            </div>

            <button
              onClick={() => {
                setActiveTab('home');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'home'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'liked'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{language === 'hi' ? 'पसंदीदा गाने' : 'Liked Songs'}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                {likedSongIds.length}
              </span>
            </button>

            <button
              onClick={() => {
                setIsSoundboardOpen(true);
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-red-400" />
                <span>{language === 'hi' ? 'प्रेशर हॉर्न पैड' : 'Horn Soundboard'}</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                1-6
              </span>
            </button>

            <button
              onClick={() => {
                setIsEqualizerOpen(true);
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
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

          {/* Authentic Playlists */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'ड्राइवर प्लेलिस्ट' : 'Driver Playlists'}
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
                        ? 'bg-white/10 text-white font-bold border-l-4 border-amber-500'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{p.icon}</span>
                    <span className="truncate flex-1">
                      {language === 'hi' ? p.hindiTitle : p.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom User Playlists */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'मेरी प्लेलिस्ट्स' : 'My Playlists'}
              </span>
              <button
                onClick={() => setIsCustomPlaylistModalOpen(true)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-amber-400"
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

          {/* Highway Shayari Truck Art Widget */}
          <div
            onClick={handleNextShayari}
            className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-black/60 border border-amber-500/20 hover:border-amber-500/50 transition group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span>{currentShayari.icon}</span>
                {language === 'hi' ? 'ट्रक शायरी' : 'Highway Quote'}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-amber-300 flex items-center">
                Next <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs font-bold text-white font-desi leading-snug">
              "{language === 'hi' ? currentShayari.hindi : currentShayari.english}"
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              — {currentShayari.author}
            </p>
          </div>

        </div>

        {/* Status bar */}
        <div className="p-3 border-t border-white/5 bg-black/40 text-[10px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>STEREO 120 KMPH</span>
          </div>
          <span className="font-mono text-amber-400/80">HORN OK PLEASE</span>
        </div>
      </aside>
    </>
  );
};
