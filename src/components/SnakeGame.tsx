import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction, Point } from '../types';
import { GRID_SIZE, GAME_SPEED } from '../constants';

interface SnakeGameProps {
  accentColor: string;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = accentColor;
    ctx.shadowBlur = 15;
    ctx.shadowColor = accentColor;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : accentColor;
      ctx.shadowBlur = index === 0 ? 10 : 5;
      ctx.shadowColor = accentColor;
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });
    ctx.shadowBlur = 0;
  }, [snake, food, accentColor]);

  return (
    <div className="relative flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-sm tracking-widest uppercase">
        <div className="flex flex-col">
          <span className="text-white/40">Score</span>
          <span className="text-2xl font-bold" style={{ color: accentColor }}>{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-white/40">High Score</span>
          <span className="text-2xl font-bold text-white/80">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        {/* Neon Border Effect */}
        <div 
          className="absolute -inset-0.5 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500"
          style={{ backgroundColor: accentColor }}
        ></div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black rounded-lg border border-white/10 shadow-2xl"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm"
            >
              <div className="text-center p-8">
                {isGameOver ? (
                  <>
                    <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Game Over</h2>
                    <p className="text-white/60 mb-6 font-mono text-sm uppercase">Final Score: {score}</p>
                    <button
                      onClick={resetGame}
                      className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all active:scale-95"
                    >
                      Restart
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Paused</h2>
                    <p className="text-white/60 mb-6 font-mono text-sm uppercase">Press Space to Resume</p>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="px-8 py-3 font-bold uppercase tracking-widest border border-white text-white hover:bg-white hover:text-black transition-all active:scale-95"
                    >
                      Resume
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-white/30 font-mono text-[10px] uppercase tracking-[0.3em]">
        Use Arrow Keys to Move • Space to Pause
      </div>
    </div>
  );
};

export default SnakeGame;
