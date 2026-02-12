import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GALLERY_IMAGES } from '../constants';

export const FloatingGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {GALLERY_IMAGES.map((src, index) => {
        // More distributed positioning to avoid clumping
        const randomTop = Math.random() * 70 + 5; // 5% to 75%
        // Spread left/right based on index to prevent overlap
        const randomLeft = Math.random() * 80 + 5; 
        const randomRotate = Math.random() * 40 - 20; // -20 to 20 deg

        return (
          <motion.div
            key={index}
            drag
            dragConstraints={containerRef}
            dragElastic={0.2}
            dragMomentum={true}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              y: 100
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: randomRotate,
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.2,
              type: "spring",
            }}
            whileHover={{ scale: 1.1, zIndex: 50, rotate: 0, cursor: 'grab' }}
            whileDrag={{ scale: 1.2, zIndex: 50, cursor: 'grabbing' }}
            className="absolute pointer-events-auto"
            style={{
              top: `${randomTop}%`,
              left: `${randomLeft}%`,
            }}
          >
            <div className="bg-white p-3 pb-8 shadow-2xl transform transition-transform duration-300 w-40 md:w-56 border border-gray-100 rotate-1">
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay z-10 pointer-events-none" /> {/* Vintage tint */}
                <img 
                  src={src} 
                  alt="Lois" 
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
              </div>
              <div className="mt-2 text-center">
                 <span className="font-serif italic text-love-300 text-xs">♥ Lois</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};