import React, { useRef, useEffect } from 'react';
import { desiAudio } from '../utils/audioSynth';
import { useAudio } from '../context/AudioContext';

export const AudioVisualizer = ({ barCount = 24, height = 40, width = 140, color = '#f59e0b' }) => {
  const canvasRef = useRef(null);
  const { isPlaying } = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const freqData = isPlaying ? desiAudio.getFrequencyData() : new Uint8Array(barCount);

      const barWidth = (canvas.width / barCount) - 2;
      const step = Math.floor(freqData.length / barCount) || 1;

      for (let i = 0; i < barCount; i++) {
        let value = isPlaying ? freqData[i * step] : 0;
        
        // If paused or value is low, add a tiny organic idle hum if playing
        if (isPlaying && value < 20) {
          value = 15 + Math.sin((Date.now() / 150) + (i * 0.4)) * 12;
        } else if (!isPlaying) {
          value = 4;
        }

        const percent = Math.min(1, value / 255);
        const barH = Math.max(3, percent * (canvas.height - 4));
        const x = i * (barWidth + 2);
        const y = canvas.height - barH;

        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;
        ctx.shadowColor = color;
        ctx.shadowBlur = isPlaying ? 8 : 0;
        
        // Rounded bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [2, 2, 0, 0]);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, barCount, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg opacity-90 transition-opacity hover:opacity-100"
    />
  );
};
