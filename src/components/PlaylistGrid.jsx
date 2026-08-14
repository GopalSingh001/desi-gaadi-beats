import React from 'react';
import { playlists, allSongs } from '../data/playlistsData';
import { PlaylistCard } from './PlaylistCard';
import { useAudio } from '../context/AudioContext';
import { Play, Sparkles, Flame, Music, Heart } from 'lucide-react';

const categories = [
  { id: 'All', labelEn: 'All Playlists', labelHi: 'सभी प्लेलिस्ट्स' },
  { id: 'High Energy', labelEn: 'Auto & Disco', labelHi: 'ऑटो & डिस्को' },
  { id: 'Soulful Highway', labelEn: 'Truck Retro & Ghazal', labelHi: 'ट्रक रेट्रो & ग़ज़ल' },
  { id: 'High Octane Speed', labelEn: 'Roadways 120kmph', labelHi: 'हरियाणा रोडवेज' },
  { id: 'Vintage Lo-Fi & Retro', labelEn: 'Mumbai Monsoon', labelHi: 'मुंबई बारिश' },
  { id: 'Acoustic & Morning Chill', labelEn: 'Tapri Chai', labelHi: 'नुक्कड़ चाय' },
  { id: 'Heavy Punjabi Bass', labelEn: 'Tractor 5911', labelHi: 'ट्रैक्टर तोचन' },
  { id: 'Festival & Celebration', labelEn: 'Baraat Dhol', labelHi: 'बारात ढोल' }
];

export const PlaylistGrid = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    playSong,
    currentSong,
    isPlaying,
    language,
    toggleLikeSong,
    isSongLiked
  } = useAudio();

  // Filter playlists
  const filteredPlaylists = playlists.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.hindiTitle.toLowerCase().includes(q) ||
      p.vehicleType.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.songs.some(s => s.title.toLowerCase().includes(q) || s.hindiTitle.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Trending top tracks to showcase quick bangers
  const topTracks = allSongs.slice(0, 4);

  return (
    <div className="space-y-8">
      
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Playlist Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold font-desi text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            {language === 'hi' ? 'लोकप्रिय ड्राइवर प्लेलिस्ट्स' : 'Iconic Driver Playlists'}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredPlaylists.length} {language === 'hi' ? 'प्लेलिस्ट' : 'collections'}
          </span>
        </div>

        {filteredPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10">
            <span className="text-4xl mb-2 block">🛺</span>
            <h3 className="text-lg font-bold text-white mb-1">
              {language === 'hi' ? 'कोई प्लेलिस्ट नहीं मिली' : 'No Playlists Found'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'दूसरा नाम सर्च करें' : 'Try searching for auto, truck, or roadways...'}
            </p>
          </div>
        )}
      </div>

      {/* Quick Banger Track Picks */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <h3 className="text-xl font-bold font-desi text-white">
              {language === 'hi' ? 'सुपरहिट देसी सिंगल ट्रैक्स' : 'Trending Highway Bangers'}
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-semibold">
            {language === 'hi' ? 'इंस्टेंट प्ले' : 'Instant Play'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topTracks.map((song) => {
            const isSongActive = currentSong?.id === song.id;
            const liked = isSongLiked(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className={`group cursor-pointer flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isSongActive
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-[#121522] border-white/5 hover:border-white/20 hover:bg-[#161a29]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isSongActive ? 'text-amber-400' : 'text-white'}`}>
                      {language === 'hi' ? song.hindiTitle : song.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {song.artist} • <span className="text-amber-300/80">{song.playlistIcon} {song.tag}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeSong(song.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <span className="text-xs font-mono text-slate-400">
                    {song.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
