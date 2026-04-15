import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
    color: '#00f2ff', // Cyan
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
    color: '#ff00ff', // Magenta
  },
  {
    id: '3',
    title: 'Retro Future',
    artist: 'Arcade Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
    color: '#39ff14', // Lime
  },
];

export const GAME_SPEED = 100;
export const GRID_SIZE = 20;
