import React from 'react';
import { playlists, allSongs } from '../data/playlistsData';
import { PlaylistCard } from './PlaylistCard';
import { useAudio } from '../context/AudioContext';
import { Play, Sparkles, Flame, Heart } from 'lucide-react';

const categories = [
  { id: 'All', labelEn: 'All Playlists', labelHi: 'सभी प्लेलिस्ट्स' },
  { id: 'High Energy', labelEn: '🛺 Auto & Disco', labelHi: '🛺 ऑटो & डिस्को' },
  { id: 'Soulful Highway', labelEn: '🚛 Truck & Sufi', labelHi: '🚛 ट्रक & सूफी' },
  { id: 'High Octane Speed', labelEn: '🚌 Haryana Roadways', labelHi: '🚌 हरियाणा रोडवेज' },
  { id: 'Vintage Lo-Fi & Retro', labelEn: '🚖 Mumbai Monsoon', labelHi: '🚖 मुंबई बारिश' },
  { id: 'Acoustic & Morning Chill', labelEn: '☕ Tapri Chai', labelHi: '☕ नुक्कड़ चाय' },
  { id: 'Heavy Punjabi Bass', labelEn: '🚜 Tractor 5911', labelHi: '🚜 ट्रैक्टर तोचन' },
  { id: 'Festival & Celebration', labelEn: '🎺 Baraat Dhol', labelHi: '🎺 बारात ढोल' }
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

  const trendingSingles = allSongs.slice(0, 6);

  return (
    <div className="space-y-10">
      
      {/* Category Pills Slider */}
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
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Playlist Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-black font-desi text-white flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-400" />
              {language === 'hi' ? 'लोकप्रिय ड्राइवर प्लेलिस्ट्स' : 'Iconic Driver Playlists'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi' ? 'हाईवे ड्राइवर्स और कैब उस्तादों की पहली पसंद' : 'Handcrafted for Indian roads, highways, and late-night journeys'}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredPlaylists.length} {language === 'hi' ? 'प्लेलिस्ट' : 'Albums'}
          </span>
        </div>

        {filteredPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10">
            <span className="text-4xl mb-2 block">🛺</span>
            <h3 className="text-base font-bold text-white mb-1">
              {language === 'hi' ? 'कोई प्लेलिस्ट नहीं मिली' : 'No Playlists Found'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'दूसरा नाम लिखकर सर्च करें' : 'Try searching for auto, truck, or roadways...'}
            </p>
          </div>
        )}
      </div>

      {/* Trending Singles Tracklist Grid */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-black font-desi text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
              {language === 'hi' ? 'सुपरहिट देसी सिंगल ट्रैक्स' : 'Trending Highway Hits'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'hi' ? 'इंस्टेंट प्ले करें और आनंद लें' : 'Top played single tracks across all vehicle decks'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {trendingSingles.map((song) => {
            const isSongActive = currentSong?.id === song.id;
            const liked = isSongLiked(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className={`group cursor-pointer flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isSongActive
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-[#0f121e]/80 border-white/5 hover:border-white/20 hover:bg-[#141828]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow">
                    <img
                      src={song.coverArt}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-xs md:text-sm font-bold truncate ${isSongActive ? 'text-amber-400' : 'text-white'}`}>
                      {language === 'hi' ? song.hindiTitle : song.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeSong(song.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <span className="text-[11px] font-mono text-slate-400">
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
