import React, { useState } from 'react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeSimplified } from './components/HomeSimplified';
import { PlaylistDetail } from './components/PlaylistDetail';
import { LikedSongsView } from './components/LikedSongsView';
import { PlayerBar } from './components/PlayerBar';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { SoundboardModal } from './components/SoundboardModal';
import { EqualizerModal } from './components/EqualizerModal';
import { CustomPlaylistModal } from './components/CustomPlaylistModal';
import { Toast } from './components/Toast';

const MainLayout = () => {
  const { activeTab, setActiveTab, currentPlaylist } = useAudio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullScreenModalOpen, setIsFullScreenModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090e] text-white flex flex-col selection:bg-amber-400 selection:text-black">
      
      {/* Top Fixed Header */}
      <Header onToggleMobileSidebar={() => setIsMobileMenuOpen(prev => !prev)} />

      {/* Body Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto pb-28">
        
        {/* Left Sidebar */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Central Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'home' && (
            <HomeSimplified />
          )}

          {activeTab === 'playlist-detail' && (
            <PlaylistDetail
              playlist={currentPlaylist}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'liked' && (
            <LikedSongsView onBack={() => setActiveTab('home')} />
          )}
        </main>

      </div>

      {/* Persistent Bottom Audio Player Bar */}
      <PlayerBar
        onOpenFullScreen={() => setIsFullScreenModalOpen(true)}
        onOpenCassette={() => setIsFullScreenModalOpen(true)}
      />

      {/* Interactive Global Modals */}
      {isFullScreenModalOpen && (
        <FullScreenPlayer onClose={() => setIsFullScreenModalOpen(false)} />
      )}
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
