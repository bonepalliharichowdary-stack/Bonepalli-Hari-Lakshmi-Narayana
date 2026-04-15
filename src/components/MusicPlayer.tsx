import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks, currentTrackIndex, onTrackChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    onTrackChange((currentTrackIndex + 1) % tracks.length);
  };

  const handlePrev = () => {
    onTrackChange((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-[400px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 flex-shrink-0"
        >
          <div 
            className="absolute -inset-1 blur-md opacity-40 rounded-2xl"
            style={{ backgroundColor: currentTrack.color }}
          ></div>
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="relative w-full h-full object-cover rounded-2xl border border-white/10"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
              <div className="flex gap-1 items-end h-6">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 8] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                    className="w-1 bg-white rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl truncate leading-tight mb-1">
            {currentTrack.title}
          </h3>
          <p className="text-white/40 text-sm font-mono uppercase tracking-wider">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full"
            style={{ backgroundColor: currentTrack.color }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button className="text-white/40 hover:text-white transition-colors">
            <Volume2 size={20} />
          </button>

          <div className="flex items-center gap-8">
            <button 
              onClick={handlePrev}
              className="text-white/60 hover:text-white transition-colors active:scale-90"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full flex items-center justify-center text-black transition-all active:scale-95 shadow-lg"
              style={{ backgroundColor: currentTrack.color }}
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={handleNext}
              className="text-white/60 hover:text-white transition-colors active:scale-90"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          <button className="text-white/40 hover:text-white transition-colors">
            <Music size={20} />
          </button>
        </div>
      </div>

      {/* Track List Preview */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => onTrackChange(index)}
              className={`flex-shrink-0 w-10 h-10 rounded-lg border transition-all ${
                index === currentTrackIndex 
                  ? 'border-white opacity-100 scale-110' 
                  : 'border-transparent opacity-40 hover:opacity-60'
              }`}
            >
              <img 
                src={track.cover} 
                alt={track.title} 
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
