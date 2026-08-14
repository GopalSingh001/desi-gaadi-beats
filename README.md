# 🛺 Desi Gaadi Beats (देसी गाड़ी बीट्स) | Dhaba FM
### *The Ultimate Indian Driver & Highway Themed Music Streaming Experience*

An authentic, single-page music streaming React web application built with **React**, **Vite**, **Web Audio API**, and **Tailwind CSS**. Designed with rich Indian Highway & Truck Art aesthetics, real procedural sound effects, interactive cassette mode, night highway dashcam view, and multiple themed playlists.

---

## 🌟 Featured Playlists Included

1. 🛺 **Auto Rickshaw Bass Bangerz (मीटर डाउन 3000)**
   - 90s Mumbai Taxi Remix, DJ Jhankar dholak beats, Mithun disco groove, and street bangers calibrated for under-seat subwoofers.
2. 🚛 **GT Road Truck Driver Retro (ढाबा सुर & रात का सफर)**
   - Late-night highway Qawwalis, Attaullah Khan dard-e-dil cassettes, Nusrat trance, and nostalgic retro heartbreak anthems for 3 AM driving.
3. 🚌 **Haryana & UP Roadways Express (रोडवेज 120 KMPH)**
   - High-bass Ragni EDM, Sapna live stage energy, UP loudspeakers, and adrenaline-pumping pressure horns.
4. 🚖 **Kaali-Peeli Mumbai Monsoon (काली पीली बारिश और मरीन ड्राइव)**
   - Marine Drive rain reflections, RD Burman jazzy saxophones, Kishore melancholic night drives, and warm lo-fi tape tape hiss.
5. ☕ **Highway Tapri Chai Adda (नुक्कड़ चाय सुकून)**
   - Cozy acoustic sitar, tabla grooves, morning Binaca Geetmala nostalgia, and breezy indie Hindi melodies.
6. 🚜 **Pind Tractor Tochan Heavy Bass (पिंड स्वैग)**
   - Heavy 808 sub-bass kicks, Punjabi dholak drops, and tractor competition speaker sound tests.
7. 🎺 **Band Baaja Baraat & Ganpati Dhol (धमाका ढोल)**
   - High-tempo Nashik Dhol, Tasha rolls, wedding brass band fanfares, nagin dance tunes, and celebration beats.

---

## ⚡ Core Features

- 🎵 **Continuous Auto-Play & Queue**: Automatically transitions to the next track seamlessly when current song ends. Supports Shuffle, Repeat-One, Repeat-All, and Seeking.
- 🔊 **Web Audio Synthesizer & Fallback**: High-fidelity procedural audio engine ensures playback **never fails or 404s**, and generates real synthesizer melodies & basslines.
- 🎛️ **Hardware Equalizer & 90s Jhankar Mode**:
  - **Haryana Sub-Bass 200%**: 120Hz low-shelf subwoofer boost.
  - **90s DJ Jhankar Beats**: Sparkling treble echo & dholak resonance.
- 📢 **Desi Pressure Horn Soundboard (Hotkeys 1 to 6)**:
  - `[1]` Haryana Pressure Horn (140 dB blast)
  - `[2]` Horn OK Please (Twin Peep-Peep)
  - `[3]` Meter Down Click (Mechanical snap + 2-stroke rev)
  - `[4]` Truck Reverse Tune (8-bit nostalgic melody)
  - `[5]` Dhaba Chai Spoon Chime (Steel on glass)
  - `[6]` Ustaad Desi Seeti (Celebration whistle)
- 🎚️ **3 Fullscreen Player Display Modes**:
  1. **Modern Studio**: Rotating vinyl record with dynamic frequency canvas equalizer.
  2. **90s Retro Cassette Deck**: Spinning tape spools, tape counter, and **✏️ Natraj Pencil Rewind** animation.
  3. **Highway Night Drive**: Night GT Road windshield with rain droplets, moving road lines, and 120 KMPH speed HUD.
- 🌐 **Bilingual (English & Hindi)**: Instant toggle between English and Hindi.
- ❤️ **Liked Songs & Custom Playlists**: Create your own "Apna Playlist" and save favorites with `localStorage` persistence.
- 📖 **Desi Driver Trivia & Highway Shayari**: Fun highway facts & truck quotes ("लटक मत पटक दूँगा", "बुरी नज़र वाले तेरा मुंह काला").

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# App runs at: http://localhost:3000/
```

---

## 🌐 1-Click Deployment Options

### Option 1: Vercel (Instant Free Deployment)
```bash
npx vercel
```

### Option 2: Netlify (Drag & Drop or CLI)
```bash
npx netlify deploy --dir=dist --prod
```

### Option 3: GitHub Pages
```bash
npm install -D gh-pages
# Run: npm run build
# Deploy dist directory to gh-pages branch
```

### Option 4: Firebase Hosting
```bash
npx -y firebase-tools deploy --only hosting
```
