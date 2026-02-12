import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { ArrowRight, Delete, Check, RefreshCw } from 'lucide-react';
import { WORDLE_LEVELS } from '../constants';

interface GameProps {
  onComplete: () => void;
}

type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export const Game: React.FC<GameProps> = ({ onComplete }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [usedKeys, setUsedKeys] = useState<Record<string, LetterStatus>>({});

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentLevel = WORDLE_LEVELS[levelIndex];
  const MAX_ATTEMPTS = 5;
  const WORD_LENGTH = 5;

  const getGuessStatuses = (guess: string, target: string): LetterStatus[] => {
    const statuses: LetterStatus[] = Array(5).fill('absent');
    const targetChars = target.split('');
    const guessChars = guess.split('');

    // First pass: Correct
    guessChars.forEach((char, i) => {
      if (char === targetChars[i]) {
        statuses[i] = 'correct';
        targetChars[i] = ''; // Mark as used
      }
    });

    // Second pass: Present
    guessChars.forEach((char, i) => {
      if (statuses[i] !== 'correct') {
        const index = targetChars.indexOf(char);
        if (index !== -1) {
          statuses[i] = 'present';
          targetChars[index] = ''; // Mark as used
        }
      }
    });

    return statuses;
  };

  const handleType = (char: string) => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + char.toUpperCase());
    }
  };

  const handleDelete = () => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (gameStatus !== 'playing') return;
    
    if (currentGuess.length !== WORD_LENGTH) {
      setShakeRow(guesses.length);
      setTimeout(() => setShakeRow(null), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    
    // Update keyboard keys
    const statuses = getGuessStatuses(currentGuess, currentLevel.word);
    const newUsedKeys = { ...usedKeys };
    
    currentGuess.split('').forEach((char, i) => {
      const status = statuses[i];
      const currentStatus = newUsedKeys[char];
      
      if (status === 'correct') {
        newUsedKeys[char] = 'correct';
      } else if (status === 'present' && currentStatus !== 'correct') {
        newUsedKeys[char] = 'present';
      } else if (status === 'absent' && !currentStatus) {
        newUsedKeys[char] = 'absent';
      }
    });
    setUsedKeys(newUsedKeys);

    // Check Win/Loss
    if (currentGuess === currentLevel.word) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }
    
    setCurrentGuess('');
  };

  const nextLevel = () => {
    setGameStatus('playing');
    setGuesses([]);
    setCurrentGuess('');
    setUsedKeys({});
    
    if (levelIndex < WORDLE_LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  // Keyboard layout
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const getKeyStyles = (char: string) => {
    const status = usedKeys[char];
    switch (status) {
      case 'correct': return 'bg-love-600 text-white border-love-600';
      case 'present': return 'bg-yellow-400 text-white border-yellow-400';
      case 'absent': return 'bg-gray-300 text-gray-500 border-gray-300 opacity-50';
      default: return 'bg-white text-love-900 border-love-200 hover:bg-love-100';
    }
  };

  // Custom Confetti Shape to draw "Lois" letters
  const drawConfettiShape = (ctx: CanvasRenderingContext2D) => {
    const shapes = ['L', 'O', 'I', 'S', '♥'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    ctx.font = "bold 40px 'Playfair Display'";
    ctx.fillStyle = ctx.strokeStyle; // Use the confetti color
    ctx.fillText(randomShape, 0, 0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-between min-h-screen p-4 max-w-lg mx-auto relative z-10"
    >
      {gameStatus === 'won' && (
        <Confetti 
            width={windowSize.width} 
            height={windowSize.height} 
            recycle={false} 
            numberOfPieces={400} 
            drawShape={drawConfettiShape}
            colors={['#c9184a', '#ff4d6d', '#ffccd5', '#800f2f']}
        />
      )}

      {/* Header */}
      <div className="w-full flex flex-col items-center mb-4 mt-2">
        <div className="flex justify-between w-full items-center mb-2">
            <span className="text-love-400 font-bold text-xs uppercase tracking-widest">Level {levelIndex + 1}/{WORDLE_LEVELS.length}</span>
            <span className="text-love-400 font-bold text-xs uppercase tracking-widest"> Attempts {guesses.length + (gameStatus === 'playing' ? 0 : 0)}/{MAX_ATTEMPTS}</span>
        </div>
        <h2 className="font-serif italic text-love-800 text-2xl md:text-3xl text-center drop-shadow-sm">"{currentLevel.hint}"</h2>
      </div>

      {/* Grid */}
      <div className="flex-1 flex flex-col justify-center gap-2 mb-6 w-full max-w-[320px]">
        {/* Past Guesses */}
        {guesses.map((guess, guessIndex) => {
          const statuses = getGuessStatuses(guess, currentLevel.word);
          return (
            <div key={guessIndex} className="grid grid-cols-5 gap-2">
              {guess.split('').map((char, charIndex) => (
                <motion.div
                  key={charIndex}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: 360 }}
                  transition={{ delay: charIndex * 0.1, duration: 0.5 }}
                  className={`
                    aspect-square flex items-center justify-center text-2xl font-bold rounded-lg border-2 shadow-sm
                    ${statuses[charIndex] === 'correct' ? 'bg-love-600 border-love-600 text-white' : ''}
                    ${statuses[charIndex] === 'present' ? 'bg-yellow-400 border-yellow-400 text-white' : ''}
                    ${statuses[charIndex] === 'absent' ? 'bg-gray-300 border-gray-300 text-white' : ''}
                  `}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          );
        })}

        {/* Current Guess */}
        {gameStatus === 'playing' && guesses.length < MAX_ATTEMPTS && (
          <motion.div 
            className="grid grid-cols-5 gap-2"
            animate={shakeRow === guesses.length ? { x: [-10, 10, -10, 10, 0] } : {}}
          >
            {[...Array(WORD_LENGTH)].map((_, i) => (
              <div 
                key={i} 
                className={`
                  aspect-square flex items-center justify-center text-2xl font-bold rounded-lg border-2
                  ${currentGuess[i] 
                    ? 'border-love-400 bg-love-50 text-love-900 animate-pulse' 
                    : 'border-love-200 bg-white/50'
                  }
                `}
              >
                {currentGuess[i] || ''}
              </div>
            ))}
          </motion.div>
        )}

        {/* Empty Rows */}
        {[...Array(Math.max(0, MAX_ATTEMPTS - 1 - guesses.length - (gameStatus === 'playing' ? 0 : 1)))].map((_, i) => (
           <div key={`empty-${i}`} className="grid grid-cols-5 gap-2 opacity-50">
             {[...Array(WORD_LENGTH)].map((_, j) => (
               <div key={j} className="aspect-square rounded-lg border-2 border-love-100 bg-transparent" />
             ))}
           </div>
        ))}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {gameStatus !== 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 z-50 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border-4 border-love-200"
            >
              {gameStatus === 'won' ? (
                <>
                  <h3 className="text-3xl font-serif text-love-600 mb-2">Beautiful!</h3>
                  <p className="text-gray-600 mb-6">You guessed it correctly.</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-serif text-gray-600 mb-2">Almost there!</h3>
                  <p className="text-gray-500 mb-2">The word was:</p>
                  <p className="text-3xl font-bold text-love-600 tracking-widest mb-6">{currentLevel.word}</p>
                </>
              )}
              
              <button 
                onClick={nextLevel}
                className="w-full bg-love-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-love-700 transition shadow-lg"
              >
                {levelIndex === WORDLE_LEVELS.length - 1 ? 'Claim Your Prize' : 'Next Level'} 
                <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard */}
      <div className="w-full max-w-md mb-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-2">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => handleType(char)}
                disabled={gameStatus !== 'playing'}
                className={`
                  ${getKeyStyles(char)}
                  font-bold rounded-lg shadow-[0px_2px_0px_0px_rgba(0,0,0,0.1)]
                  w-8 h-10 md:w-10 md:h-12 text-sm flex items-center justify-center transition-all
                  active:scale-95 disabled:cursor-not-allowed disabled:opacity-50
                `}
              >
                {char}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-2 mt-2">
           <button 
             onClick={handleDelete}
             disabled={gameStatus !== 'playing'}
             className="px-4 py-3 bg-love-100 rounded-lg text-love-800 font-bold hover:bg-love-200 active:bg-love-300 transition-colors disabled:opacity-50 shadow-sm"
           >
             <Delete size={20} />
           </button>
           <button 
             onClick={handleEnter}
             disabled={gameStatus !== 'playing'}
             className="px-6 py-3 bg-love-600 rounded-lg text-white font-bold hover:bg-love-700 active:bg-love-800 transition-colors shadow-lg disabled:opacity-50"
           >
             ENTER
           </button>
        </div>
      </div>
    </motion.div>
  );
};