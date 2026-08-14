import React, { useState } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { PlaylistGrid } from './components/PlaylistGrid';
import { PlaylistDetail } from './components/PlaylistDetail';
import { LikedSongsView } from './components/LikedSongsView';
import { PlayerBar } from './components/PlayerBar';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { SoundboardModal } from './components/SoundboardModal';
import { EqualizerModal } from './components/EqualizerModal';
import { CustomPlaylistModal } from './components/CustomPlaylistModal';
import { Toast } from './components/Toast';

const MainLayout = () => {
  const { activeTab, setActiveTab } = useAudio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0c12] text-white flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Top Fixed Header */}
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)} />

      {/* Body Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto pb-28">
        
        {/* Left Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Central Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-full">
          {activeTab === 'home' && (
            <div className="animate-in fade-in duration-300">
              <HeroBanner />
              <PlaylistGrid />
            </div>
          )}

          {activeTab === 'playlist-detail' && (
            <PlaylistDetail onBack={() => setActiveTab('home')} />
          )}

          {activeTab === 'liked' && (
            <LikedSongsView onBack={() => setActiveTab('home')} />
          )}
        </main>

      </div>

      {/* Persistent Bottom Audio Player Bar */}
      <PlayerBar />

      {/* Interactive Global Modals */}
      <FullScreenPlayer />
      <SoundboardModal />
      <EqualizerModal />
      <CustomPlaylistModal />
      <Toast />

    </div>
  );
};

export default function App() {
  return (
    <AudioProvider>
      <MainLayout />
    </AudioProvider>
  );
}
