import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Package, Heart, CheckCircle } from 'lucide-react';
import { DATE_OPTIONS } from '../constants';

interface FinalRevealProps {
  selectedDateId: string | null;
}

export const FinalReveal: React.FC<FinalRevealProps> = ({ selectedDateId }) => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedOption = DATE_OPTIONS.find(d => d.id === selectedDateId);

  // Custom Confetti Shape to draw "Lois" letters
  const drawConfettiShape = (ctx: CanvasRenderingContext2D) => {
    const shapes = ['L', 'O', 'I', 'S', '♥', 'L', 'O', 'I', 'S'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    ctx.font = "bold 40px 'Playfair Display'";
    ctx.fillStyle = ctx.strokeStyle; 
    ctx.fillText(randomShape, 0, 0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-love-900/95 text-love-50 relative overflow-hidden"
    >
      <Confetti 
        width={windowSize.width} 
        height={windowSize.height} 
        colors={['#f43f5e', '#ffe4e6', '#fb7185', '#FFF']}
        drawShape={drawConfettiShape}
        numberOfPieces={200}
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-8 bg-love-800 p-6 rounded-full border-4 border-love-400/30"
      >
        <CheckCircle size={64} className="text-love-200" />
      </motion.div>

      <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg text-white">
        It's Official!
      </h1>

      {selectedOption && (
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
        >
            <p className="text-love-200 text-xl mb-2">We are locked in for:</p>
            <div className="bg-white/10 px-8 py-4 rounded-xl backdrop-blur-sm inline-block border border-white/20">
                <span className="font-bold text-white text-2xl md:text-3xl font-serif">{selectedOption.title}</span>
            </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl max-w-lg border border-white/20 shadow-2xl relative"
      >
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-love-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg">
            Bonus
        </div>
        <div className="flex justify-center mb-6 mt-2">
          <motion.div
            animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Package size={64} className="text-love-200" strokeWidth={1.5} />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-serif font-bold mb-3 text-white">The Indigo Special Box</h2>
        <p className="text-love-100 mb-6 text-lg leading-relaxed font-light">
          Because you're my one and only, <br/> a special package is on its way.
        </p>
        
        <div className="inline-block bg-love-950/50 px-6 py-2 rounded-full border border-love-500/30">
          <p className="text-sm font-mono tracking-wider text-love-300">EST. ARRIVAL: FEB 20TH</p>
        </div>
      </motion.div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="fixed bottom-8 text-love-300/60 font-serif italic flex items-center gap-2 z-50"
      >
        I love you, Lois <Heart size={14} fill="currentColor" />
      </motion.footer>
    </motion.div>
  );
};