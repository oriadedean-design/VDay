import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface PrizeIntroProps {
  onNext: () => void;
}

export const PrizeIntro: React.FC<PrizeIntroProps> = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-rose-50 to-rose-100"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        className="mb-8 p-6 bg-white rounded-full shadow-xl"
      >
        <Gift size={64} className="text-rose-500" />
      </motion.div>

      <h1 className="text-3xl md:text-5xl font-serif text-rose-900 mb-6 leading-tight">
        You won!
      </h1>

      <p className="text-lg md:text-xl text-rose-800 mb-8 max-w-lg leading-relaxed">
        The prize for winning is picking exactly what you want as a gift for Valentine's Day.
      </p>
      
      <div className="bg-white/60 p-4 rounded-lg mb-10 max-w-md border border-rose-200">
        <p className="text-rose-600 text-sm font-semibold uppercase tracking-wider">Note</p>
        <p className="text-rose-800 italic">You will get this at the end of the month.</p>
      </div>

      <button
        onClick={onNext}
        className="bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-rose-300/50 hover:bg-rose-700 transition-transform hover:scale-105"
      >
        Choose Your Date
      </button>
    </motion.div>
  );
};