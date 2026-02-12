import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeroProps {
  onComplete: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onComplete }) => {
  const adjectives = [
    "The Delicious",
    "The Lovely",
    "The Fun",
    "The Dynamic",
    "The Forever Iconic"
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, rotate: -2 },
    show: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 } 
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center z-10 relative"
      exit={{ opacity: 0, y: -50 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-love-50/80 to-love-50 z-[-1] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="mb-8 border-b-2 border-love-300 pb-2"
      >
        <p className="text-love-800 uppercase tracking-[0.3em] text-xs md:text-sm font-bold">
          A website for my One and Only
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3 mb-12"
      >
        {adjectives.map((adj, index) => (
          <motion.h2 
            key={index} 
            variants={item}
            className="text-3xl md:text-5xl font-serif text-love-700 italic"
            style={{ textShadow: '2px 2px 0px rgba(255, 200, 200, 0.5)' }}
          >
            {adj}
          </motion.h2>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 4.5, type: "spring", duration: 1.5 }}
        className="mb-20 relative"
      >
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-love-900 mb-2 leading-tight">
          Lois Ogunnubi<br/>Oriade
        </h1>
        {/* Decorative underline */}
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 5, duration: 1 }}
            className="h-2 bg-love-500 mx-auto rounded-full mt-2"
        />
        <div className="absolute -right-8 -top-8 text-love-400 opacity-50 animate-bounce">
            <Heart size={40} fill="currentColor" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-10 w-full px-6 max-w-sm z-50"
      >
        <button
          onClick={onComplete}
          className="group w-full bg-love-600 hover:bg-love-700 text-white py-5 rounded-xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(164,19,60,1)] hover:shadow-[2px_2px_0px_0px_rgba(164,19,60,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-3 border-2 border-love-800"
        >
          <span>Your Journey Begins</span>
          <ArrowRightIcon />
        </button>
      </motion.div>
    </motion.div>
  );
};

const ArrowRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
)
