import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Home, Heart } from 'lucide-react';
import { DATE_OPTIONS } from '../constants';

interface DateSelectionProps {
  onSelect: (id: string) => void;
}

export const DateSelection: React.FC<DateSelectionProps> = ({ onSelect }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOptionClick = (id: string) => {
    if (id === 'earls') {
      setShowConfirm(true);
    } else {
      onSelect(id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-rose-50 relative z-20"
    >
      <h2 className="text-2xl md:text-4xl font-serif text-rose-900 mb-2 text-center">
        What shall we do after dinner?
      </h2>
      <p className="text-rose-600 mb-10 text-center">Choose your perfect evening</p>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        {DATE_OPTIONS.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(option.id)}
            className="bg-white p-8 rounded-2xl shadow-xl border-2 border-transparent hover:border-rose-300 group text-left transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               {option.icon === 'dinner' ? <Utensils size={100} /> : <Home size={100} />}
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
                {option.icon === 'dinner' ? <Utensils className="text-rose-600" /> : <Home className="text-rose-600" />}
              </div>
              <h3 className="text-xl font-bold text-rose-900 mb-2 font-serif">{option.title}</h3>
              <p className="text-rose-700 leading-relaxed">{option.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-4 border-love-200 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-love-300 via-love-500 to-love-300" />
              
              <div className="mb-6 flex justify-center">
                 <div className="bg-rose-100 p-4 rounded-full animate-bounce">
                    <Heart className="text-rose-500 fill-rose-500" size={48} />
                 </div>
              </div>

              <h3 className="text-2xl font-serif font-bold text-love-900 mb-4">
                Are you sure, my love? 🥺
              </h3>
              
              <p className="text-love-700 mb-8 leading-relaxed">
                While Earls is delicious, a cozy night in implies 
                <strong> unlimited cuddles</strong>, a movie of your choice, and 
                Special Massage from Monsieur Dean...
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => onSelect('home')}
                  className="w-full bg-love-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-love-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  You convinced me! Let's stay in
                </button>
                
                <button
                  onClick={() => onSelect('earls')}
                  className="w-full bg-transparent text-love-400 py-2 text-sm hover:text-love-600 transition-colors"
                >
                  I really want Earls though! (Confirm Earls)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};