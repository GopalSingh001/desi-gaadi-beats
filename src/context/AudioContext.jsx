import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playlists, allSongs } from '../data/playlistsData';
import { desiAudio } from '../utils/audioSynth';

const AudioContext = createContext(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  // Current Playlist & Song State
  const [currentPlaylist, setCurrentPlaylist] = useState(playlists[0]);
  const [currentSong, setCurrentSong] = useState(playlists[0].songs[0]);
  const [queue, setQueue] = useState(playlists[0].songs);
  const [queueIndex, setQueueIndex] = useState(0);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(225);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('all'); // 'off' | 'all' | 'one'
  const [isSynthFallback, setIsSynthFallback] = useState(false);

  // Equalizer & Audio Effects
  const [isBassBoost, setIsBassBoost] = useState(false);
  const [isJhankar, setIsJhankar] = useState(false);
  const [isSoundboardOpen, setIsSoundboardOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isCustomPlaylistModalOpen, setIsCustomPlaylistModalOpen] = useState(false);
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState('modern'); // 'modern' | 'cassette' | 'highway'

  // Navigation & User Preferences
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'playlist-detail' | 'liked' | 'soundboard' | 'custom'

  // Persistent Likes & Custom Playlists
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('desi_gaadi_liked_songs');
      return saved ? JSON.parse(saved) : ['ab-1', 'tr-1', 'br-1', 'kp-1'];
    } catch {
      return ['ab-1', 'tr-1', 'br-1', 'kp-1'];
    }
  });

  const [customPlaylists, setCustomPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('desi_gaadi_custom_playlists');
      return saved ? JSON.parse(saved) : [
        {
          id: 'custom-nh44-night',
          title: 'My Late Night Highway Vibes',
          hindiTitle: 'मेरी लेट नाइट हाईवे वाइब',
          description: 'Personal collection of road tunes and late night dhabha songs.',
          icon: '✨',
          color: '#ec4899',
          songIds: ['tr-1', 'tr-2', 'kp-1', 'tc-1', 'br-1']
        }
      ];
    } catch {
      return [];
    }
  });

  // Audio Element Ref
  const audioRef = useRef(null);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Save Liked Songs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('desi_gaadi_liked_songs', JSON.stringify(likedSongIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedSongIds]);

  // Save Custom Playlists to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('desi_gaadi_custom_playlists', JSON.stringify(customPlaylists));
    } catch (e) {
      console.error(e);
    }
  }, [customPlaylists]);

  // Toggle Like Song
  const toggleLikeSong = (songId) => {
    setLikedSongIds(prev => {
      if (prev.includes(songId)) {
        showToast(language === 'hi' ? 'पसंदीदा से हटाया गया' : 'Removed from Liked Songs', 'info');
        return prev.filter(id => id !== songId);
      } else {
        showToast(language === 'hi' ? 'पसंदीदा में जोड़ा गया! ❤️' : 'Added to Liked Songs! ❤️', 'success');
        return [...prev, songId];
      }
    });
  };

  // Check if Song is Liked
  const isSongLiked = (songId) => likedSongIds.includes(songId);

  // Setup HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!isSynthFallback) {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      }
    };

    const handleEnded = () => {
      handleNextSong();
    };

    const handleError = (e) => {
      console.warn("Audio stream unavailable or blocked, falling back to Desi Synth Audio Engine:", e);
      setIsSynthFallback(true);
      if (isPlaying && currentSong) {
        desiAudio.startProceduralTrack(currentSong.synthTrackType || 'auto_banger');
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      desiAudio.stopProceduralTrack();
    };
  }, []);

  // Update volume & muting
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    desiAudio.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Toggle Bass Boost
  const toggleBassBoost = () => {
    setIsBassBoost(prev => {
      const next = !prev;
      desiAudio.setBassBoost(next);
      showToast(next ? (language === 'hi' ? 'हरियाणा रोडवेज बास एक्टिवेट! 🔊' : 'Haryana Roadways Bass 200% Active! 🔊') : 'Bass Normal', 'success');
      return next;
    });
  };

  // Toggle Jhankar Beat
  const toggleJhankar = () => {
    setIsJhankar(prev => {
      const next = !prev;
      desiAudio.setJhankar(next);
      showToast(next ? (language === 'hi' ? '90s झंकार बीट एक्टिवेटेड! ✨' : '90s DJ Jhankar Beats Active! ✨') : 'Jhankar Normal', 'success');
      return next;
    });
  };

  // Play a specific song
  const playSong = (song, playlist = null, newQueue = null) => {
    desiAudio.ensureContext();
    setCurrentSong(song);
    if (playlist) setCurrentPlaylist(playlist);
    
    const activeQueue = newQueue || (playlist ? playlist.songs : queue);
    setQueue(activeQueue);
    const idx = activeQueue.findIndex(s => s.id === song.id);
    setQueueIndex(idx !== -1 ? idx : 0);

    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(song.durationSeconds || 220);

    if (audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsSynthFallback(false);
          desiAudio.stopProceduralTrack();
        })
        .catch(err => {
          console.warn("Audio play prevented or errored, using procedural synth engine:", err);
          setIsSynthFallback(true);
          desiAudio.startProceduralTrack(song.synthTrackType || 'auto_banger');
        });
    } else {
      setIsSynthFallback(true);
      desiAudio.startProceduralTrack(song.synthTrackType || 'auto_banger');
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    desiAudio.ensureContext();
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      desiAudio.stopProceduralTrack();
      setIsPlaying(false);
    } else {
      if (audioRef.current && !isSynthFallback && audioRef.current.src) {
        audioRef.current.play().catch(() => {
          setIsSynthFallback(true);
          desiAudio.startProceduralTrack(currentSong?.synthTrackType || 'auto_banger');
        });
      } else {
        desiAudio.startProceduralTrack(currentSong?.synthTrackType || 'auto_banger');
      }
      setIsPlaying(true);
    }
  };

  // Next Track Logic
  const handleNextSong = () => {
    if (!queue || queue.length === 0) return;

    if (repeatMode === 'one' && currentSong) {
      playSong(currentSong, currentPlaylist, queue);
      return;
    }

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'off') {
          setIsPlaying(false);
          desiAudio.stopProceduralTrack();
          if (audioRef.current) audioRef.current.pause();
          return;
        }
        nextIndex = 0;
      }
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      playSong(nextSong, currentPlaylist, queue);
    }
  };

  // Previous Track Logic
  const handlePrevSong = () => {
    if (!queue || queue.length === 0) return;

    if (currentTime > 3) {
      // Seek to start
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    const prevSong = queue[prevIndex];
    if (prevSong) {
      playSong(prevSong, currentPlaylist, queue);
    }
  };

  // Seek time
  const handleSeek = (newTime) => {
    setCurrentTime(newTime);
    if (audioRef.current && !isSynthFallback) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Procedural Synth simulation of time progress when playing synthetic tracks
  useEffect(() => {
    let interval = null;
    if (isPlaying && isSynthFallback) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleNextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isSynthFallback, duration, queueIndex]);

  // Soundboard Trigger Helper
  const triggerSoundEffect = (actionName) => {
    if (typeof desiAudio[actionName] === 'function') {
      desiAudio[actionName]();
    }
  };

  // Create New Custom Playlist
  const createCustomPlaylist = (title, hindiTitle, description, icon = '🎵', color = '#f59e0b') => {
    const newPlaylist = {
      id: 'custom-' + Date.now(),
      title,
      hindiTitle: hindiTitle || title,
      description,
      icon,
      color,
      songIds: []
    };
    setCustomPlaylists(prev => [newPlaylist, ...prev]);
    showToast(language === 'hi' ? 'नई प्लेलिस्ट बनाई गई! ✨' : 'New Playlist Created! ✨', 'success');
  };

  // Add Song to Custom Playlist
  const addSongToCustomPlaylist = (playlistId, songId) => {
    setCustomPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (!p.songIds.includes(songId)) {
          showToast(language === 'hi' ? 'प्लेलिस्ट में गाना जोड़ा गया' : 'Song added to playlist', 'success');
          return { ...p, songIds: [...p.songIds, songId] };
        } else {
          showToast(language === 'hi' ? 'यह गाना पहले से मौजूद है' : 'Song already in playlist', 'info');
        }
      }
      return p;
    }));
  };

  // Remove Song from Custom Playlist
  const removeSongFromCustomPlaylist = (playlistId, songId) => {
    setCustomPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== songId) };
      }
      return p;
    }));
    showToast(language === 'hi' ? 'गाना हटाया गया' : 'Song removed', 'info');
  };

  return (
    <AudioContext.Provider
      value={{
        // Playback state
        currentPlaylist,
        setCurrentPlaylist,
        currentSong,
        setCurrentSong,
        queue,
        setQueue,
        queueIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        isShuffle,
        setIsShuffle,
        repeatMode,
        setRepeatMode,
        isSynthFallback,
        playSong,
        togglePlay,
        handleNextSong,
        handlePrevSong,
        handleSeek,

        // Effects & Visuals
        isBassBoost,
        toggleBassBoost,
        isJhankar,
        toggleJhankar,
        isSoundboardOpen,
        setIsSoundboardOpen,
        isEqualizerOpen,
        setIsEqualizerOpen,
        isCustomPlaylistModalOpen,
        setIsCustomPlaylistModalOpen,
        isFullScreenPlayerOpen,
        setIsFullScreenPlayerOpen,
        playerMode,
        setPlayerMode,
        triggerSoundEffect,

        // App state
        language,
        setLanguage,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeTab,
        setActiveTab,

        // Favorites & Custom Playlists
        likedSongIds,
        toggleLikeSong,
        isSongLiked,
        customPlaylists,
        createCustomPlaylist,
        addSongToCustomPlaylist,
        removeSongFromCustomPlaylist,

        // Notifications
        toastMessage,
        showToast
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
