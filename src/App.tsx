/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';
import { motion } from 'motion/react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-hidden relative">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{ backgroundColor: currentTrack.color }}
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[100px]"
          style={{ backgroundColor: currentTrack.color }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* Left Side: Info / Branding */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 mb-4">
              Arcade Experience v1.0
            </span>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-4">
              NEON<br />
              <span style={{ color: currentTrack.color }} className="transition-colors duration-500">SNAKE</span>
            </h1>
            <p className="text-white/40 font-medium leading-relaxed">
              Classic arcade mechanics meets modern synthwave aesthetics. 
              Play the rhythm, chase the glow.
            </p>
          </motion.div>

          {/* Music Player Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MusicPlayer 
              tracks={TRACKS} 
              currentTrackIndex={currentTrackIndex} 
              onTrackChange={setCurrentTrackIndex} 
            />
          </motion.div>
        </div>

        {/* Center: Game Window */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring', damping: 20 }}
          className="flex-shrink-0"
        >
          <SnakeGame accentColor={currentTrack.color} />
        </motion.div>

      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-8 left-0 right-0 z-10 pointer-events-none">
        <div className="container mx-auto px-6 flex justify-between items-end">
          <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/20">
            © 2026 NEON BEATS ARCADE
          </div>
          <div className="flex gap-4">
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
          </div>
        </div>
      </footer>
    </div>
  );
}

