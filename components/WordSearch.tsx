import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { ArrowRight, Check } from 'lucide-react';

interface WordSearchProps {
  onComplete: () => void;
}

const WORDS = [
  { id: 'BEAUTIFUL', display: 'Beautiful', color: 'bg-rose-500' },
  { id: 'DIVINE', display: 'Divine', color: 'bg-pink-500' },
  { id: 'GODSFAVOURITE', display: "God's Favourite", color: 'bg-love-600' },
  { id: 'GODLOVESME', display: "God Loves Me", color: 'bg-red-500' },
  { id: 'PORKIE', display: "Porkie", color: 'bg-orange-400' },
  { id: 'MAMAS', display: "Mamas", color: 'bg-yellow-500' },
];

const GRID_SIZE = 14; // Increased from 13 to ensure 13-letter words fit comfortably

export const WordSearch: React.FC<WordSearchProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ r: number, c: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ r: number, c: number } | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Grid
  useEffect(() => {
    generateGrid();
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateGrid = () => {
    // Empty grid
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    // Sort words by length descending to place largest first
    const sortedWords = [...WORDS].sort((a, b) => b.id.length - a.id.length);

    sortedWords.forEach((wordObj) => {
      let placed = false;
      let attempts = 0;
      const word = wordObj.id;
      
      while (!placed && attempts < 200) {
        attempts++;
        // Prefer diagonal for 'BEAUTIFUL' to satisfy 'Slant' hint
        const isSlantPreferred = word === 'BEAUTIFUL' && Math.random() > 0.3;
        const dir = isSlantPreferred 
            ? (Math.random() > 0.5 ? [1, 1] : [1, -1]) 
            : [[0, 1], [1, 0], [1, 1], [1, -1]][Math.floor(Math.random() * 4)];
            
        const [dr, dc] = dir;
        const r = Math.floor(Math.random() * GRID_SIZE);
        const c = Math.floor(Math.random() * GRID_SIZE);

        // Check bounds
        const endR = r + dr * (word.length - 1);
        const endC = c + dc * (word.length - 1);

        if (endR >= 0 && endR < GRID_SIZE && endC >= 0 && endC < GRID_SIZE) {
          // Check collision
          let clean = true;
          for (let i = 0; i < word.length; i++) {
            const charAtCell = newGrid[r + dr * i][c + dc * i];
            if (charAtCell !== '' && charAtCell !== word[i]) {
              clean = false;
              break;
            }
          }

          if (clean) {
            for (let i = 0; i < word.length; i++) {
              newGrid[r + dr * i][c + dc * i] = word[i];
            }
            placed = true;
          }
        }
      }
      
      if (!placed) {
          console.warn(`Could not place word: ${word}`);
      }
    });

    // Fill empty
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    setGrid(newGrid);
  };

  const getCellFromTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (!containerRef.current) return null;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Find the element under the cursor/touch
    const element = document.elementFromPoint(clientX, clientY);
    if (element && element.hasAttribute('data-r')) {
      return {
        r: parseInt(element.getAttribute('data-r')!),
        c: parseInt(element.getAttribute('data-c')!)
      };
    }
    return null;
  };

  const handleStart = (r: number, c: number) => {
    setSelecting(true);
    setSelectionStart({ r, c });
    setSelectionEnd({ r, c });
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!selecting) return;
    const cell = getCellFromTouch(e);
    if (cell) {
      setSelectionEnd(cell);
    }
  };

  const handleEnd = () => {
    if (!selecting || !selectionStart || !selectionEnd) {
        setSelecting(false);
        return;
    }
    
    // Get Selected Word
    const word = getSelectedWord(selectionStart, selectionEnd);
    if (word) {
      // Check if matches any target word
      const reversed = word.split('').reverse().join('');
      const match = WORDS.find(w => w.id === word || w.id === reversed);
      
      if (match && !foundWords.includes(match.id)) {
        setFoundWords(prev => [...prev, match.id]);
      }
    }
    
    setSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const getSelectedWord = (start: {r: number, c: number}, end: {r: number, c: number}) => {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    
    // Valid lines only (horizontal, vertical, diagonal)
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return grid[start.r][start.c]; // Single letter

    const rStep = dr === 0 ? 0 : dr / Math.abs(dr);
    const cStep = dc === 0 ? 0 : dc / Math.abs(dc);

    let chars = '';
    for (let i = 0; i <= steps; i++) {
        chars += grid[start.r + i * rStep][start.c + i * cStep];
    }
    return chars;
  };

  const isSelected = (r: number, c: number) => {
    if (!selecting || !selectionStart || !selectionEnd) return false;
    
    const start = selectionStart;
    const end = selectionEnd;
    
    const dr = end.r - start.r;
    const dc = end.c - start.c;

    // Only highlight if valid line
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return false;

    // Bounds check
    const minR = Math.min(start.r, end.r);
    const maxR = Math.max(start.r, end.r);
    const minC = Math.min(start.c, end.c);
    const maxC = Math.max(start.c, end.c);
    
    if (r < minR || r > maxR || c < minC || c > maxC) return false;

    if (dr === 0) return r === start.r; // Horizontal
    if (dc === 0) return c === start.c; // Vertical
    if (Math.abs(dr) === Math.abs(dc)) { // Diagonal
        return Math.abs(r - start.r) === Math.abs(c - start.c) && 
               ((r - start.r) / (c - start.c)) === (dr / dc);
    }
    return false;
  };

  // Helper to check if a cell is part of a found word (requires finding the word again)
  const getFoundColor = (r: number, c: number) => {
     for (const wordId of foundWords) {
         const word = wordId;
         const len = word.length;
         
         const dirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
         
         for(let gr=0; gr<GRID_SIZE; gr++) {
             for(let gc=0; gc<GRID_SIZE; gc++) {
                 if (grid[gr][gc] !== word[0]) continue;
                 
                 for (let d=0; d<dirs.length; d++) {
                     const [dr, dc] = dirs[d];
                     let match = true;
                     for(let i=1; i<len; i++) {
                         if (
                             gr+dr*i < 0 || gr+dr*i >= GRID_SIZE || 
                             gc+dc*i < 0 || gc+dc*i >= GRID_SIZE ||
                             grid[gr+dr*i][gc+dc*i] !== word[i]
                         ) {
                             match = false;
                             break;
                         }
                     }
                     
                     if (match) {
                         for(let k=0; k<len; k++) {
                             if (gr+dr*k === r && gc+dc*k === c) {
                                 // Return specific color if desired, or default found style
                                 const wordObj = WORDS.find(w => w.id === wordId);
                                 return `${wordObj?.color || 'bg-love-300'} text-white font-bold shadow-sm`;
                             }
                         }
                     }
                 }
             }
         }
     }
     return null;
  };

  const allFound = foundWords.length === WORDS.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center p-2 pt-16 md:p-4 bg-love-50 select-none touch-none overflow-hidden relative z-20"
    >
      {allFound && (
        <Confetti 
            width={windowSize.width} 
            height={windowSize.height} 
            recycle={false} 
            numberOfPieces={500}
        />
      )}

      <div className="mb-2 text-center">
        <h2 className="text-xl md:text-3xl font-serif font-bold text-love-800">
          Who are you to me?
        </h2>
        <p className="text-love-500 text-xs md:text-sm">Find the words below</p>
      </div>

      {/* Grid Container */}
      <div 
        ref={containerRef}
        className="bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-xl border-2 border-love-200 relative touch-none select-none max-w-full overflow-visible"
        onMouseLeave={handleEnd}
        onMouseUp={handleEnd}
        onTouchEnd={handleEnd}
      >
        <div 
            className="grid gap-0"
            style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
        >
          {grid.map((row, r) => (
            row.map((char, c) => {
              const selected = isSelected(r, c);
              const foundClass = getFoundColor(r, c);
              
              return (
                <div
                  key={`${r}-${c}`}
                  data-r={r}
                  data-c={c}
                  onMouseDown={() => handleStart(r, c)}
                  onMouseEnter={(e) => handleMove(e)}
                  onTouchStart={() => handleStart(r, c)}
                  onTouchMove={(e) => handleMove(e)}
                  className={`
                    w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 flex items-center justify-center 
                    text-xs sm:text-sm md:text-base font-medium cursor-pointer transition-all duration-150 select-none
                    ${selected ? 'bg-love-600 text-white scale-110 rounded-full z-10 shadow-lg' : ''}
                    ${foundClass ? foundClass : (!selected ? 'text-love-900 hover:bg-love-100 rounded-full' : '')}
                  `}
                >
                  {char}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {/* Word List */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-2xl px-2 pb-20">
        {WORDS.map((word) => {
           const isFound = foundWords.includes(word.id);
           return (
             <motion.div
               key={word.id}
               animate={isFound ? { scale: [1, 1.2, 1] } : {}}
               className={`
                 px-3 py-1.5 rounded-full border text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all
                 ${isFound 
                    ? `${word.color} border-transparent text-white shadow-md order-last opacity-80` 
                    : 'bg-white/90 border-love-200 text-love-800 shadow-sm backdrop-blur-sm'
                 }
               `}
             >
               {isFound && <Check size={12} />}
               {word.display}
             </motion.div>
           );
        })}
      </div>

      <AnimatePresence>
        {allFound && (
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             className="fixed bottom-8 z-50 px-4 w-full max-w-sm"
           >
             <button
               onClick={onComplete}
               className="w-full bg-love-600 text-white py-4 rounded-xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(164,19,60,1)] flex items-center justify-center gap-2 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(164,19,60,1)] transition-all border-2 border-love-800"
             >
               See Your Prize <ArrowRight />
             </button>
           </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};