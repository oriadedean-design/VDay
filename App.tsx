import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Hero } from './components/Hero';
import { Game } from './components/Game';
import { WordSearch } from './components/WordSearch';
import { PrizeIntro } from './components/PrizeIntro';
import { DateSelection } from './components/DateSelection';
import { FinalReveal } from './components/FinalReveal';
import { FloatingGallery } from './components/FloatingGallery';
import { AppStage } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('hero');
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);

  const handleDateSelect = (id: string) => {
    setSelectedDateId(id);
    setTimeout(() => setStage('final'), 800);
  };

  const handleBack = () => {
    switch (stage) {
      case 'game':
        setStage('hero');
        break;
      case 'word-search':
        setStage('game');
        break;
      case 'prize-intro':
        setStage('word-search');
        break;
      case 'date-selection':
        setStage('prize-intro');
        break;
      case 'final':
        setStage('date-selection');
        break;
      default:
        break;
    }
  };

  const handleHome = () => {
    if (window.confirm("Are you sure you want to restart the journey?")) {
      setStage('hero');
      setSelectedDateId(null);
    }
  };

  return (
    <div className="min-h-screen bg-love-50 text-love-900 font-sans overflow-x-hidden relative">
      <FloatingGallery />

      {/* Navigation Controls */}
      {stage !== 'hero' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-4 z-50 flex gap-3"
        >
          <button
            onClick={handleBack}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-love-600 hover:bg-love-100 hover:scale-105 transition-all border border-love-200 group"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={handleHome}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-love-600 hover:bg-love-100 hover:scale-105 transition-all border border-love-200 group"
            title="Return Home"
          >
            <Home size={20} />
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {stage === 'hero' && (
          <Hero key="hero" onComplete={() => setStage('game')} />
        )}
        
        {stage === 'game' && (
          <Game key="game" onComplete={() => setStage('word-search')} />
        )}

        {stage === 'word-search' && (
          <WordSearch key="word-search" onComplete={() => setStage('prize-intro')} />
        )}

        {stage === 'prize-intro' && (
          <PrizeIntro key="prize-intro" onNext={() => setStage('date-selection')} />
        )}

        {stage === 'date-selection' && (
          <DateSelection key="date-selection" onSelect={handleDateSelect} />
        )}

        {stage === 'final' && (
          <FinalReveal key="final" selectedDateId={selectedDateId} />
        )}
      </AnimatePresence>
      
      {/* Background decoration gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-10 left-10 w-48 h-48 bg-love-200 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-20 right-10 w-48 h-48 bg-love-300 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-love-100 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default App;