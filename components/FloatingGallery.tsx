import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GALLERY_IMAGES } from '../constants';

export const FloatingGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {GALLERY_IMAGES.map((src, index) => {
        // Random positioning
        const randomTop = Math.random() * 70 + 10; // 10% to 80%
        const randomLeft = Math.random() * 80 + 10; 
        const randomRotate = Math.random() * 30 - 15; // -15 to 15 deg
        const floatDuration = 4 + Math.random() * 4; // 4-8s duration
        const floatY = 15 + Math.random() * 15; // Amount of vertical float

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
              y: [0, -floatY, 0], // Bobbing up and down
              rotate: [randomRotate, randomRotate + 5, randomRotate - 5, randomRotate], // Slight rotation wobble
            }}
            transition={{
              opacity: { duration: 1, delay: index * 0.2 },
              scale: { duration: 1, delay: index * 0.2 },
              y: { 
                duration: floatDuration, 
                repeat: Infinity, 
                repeatType: "reverse", 
                ease: "easeInOut",
                delay: index * 0.5 // Stagger the floating start slightly
              },
              rotate: {
                duration: floatDuration * 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            whileHover={{ 
                scale: 1.15, 
                zIndex: 50, 
                cursor: 'grab',
                transition: { duration: 0.2 }
            }}
            whileDrag={{ 
                scale: 1.2, 
                zIndex: 60, 
                cursor: 'grabbing',
                transition: { duration: 0.1 }
            }}
            className="absolute pointer-events-auto"
            style={{
              top: `${randomTop}%`,
              left: `${randomLeft}%`,
            }}
          >
            <div className="bg-white p-2 md:p-3 pb-8 md:pb-10 shadow-lg hover:shadow-2xl transform transition-shadow duration-300 w-32 md:w-48 border border-gray-100 rounded-sm">
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay z-10 pointer-events-none" /> {/* Vintage tint */}
                <img 
                  src={src} 
                  alt="Lois" 
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                 <span className="font-serif italic text-love-300 text-[10px] md:text-xs">♥ Lois</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};