import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface TreatmentMicroAnimationProps {
  treatmentName: string;
}

export default function TreatmentMicroAnimation({ treatmentName }: TreatmentMicroAnimationProps) {
  // Let's determine the type of animation
  const getAnimType = () => {
    switch (treatmentName) {
      case 'Professional Cleaning': return 'scaling';
      case 'Pediatric (kids) Dentistry': return 'pediatric';
      case 'Micro-Fillings': return 'fillings';
      case 'Root Canal Treatment': return 'rct';
      case 'Crowns & Bridges': return 'crowns';
      case 'Gum Surgery': return 'gums';
      case 'Dental Implants': return 'implants';
      case 'Teeth Whitening': return 'whitening';
      case 'Braces & Orthodontics': return 'braces';
      default: return 'scaling';
    }
  };

  const type = getAnimType();

  return (
    <div className="w-full h-32 bg-stone-950 rounded-xl border border-stone-850/65 overflow-hidden flex items-center justify-center relative shadow-inner mb-4 select-none">
      {/* Subtle diagnostic grid lines overlay to make it look clinical */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* 1. SCALING & POLISHING */}
      {type === 'scaling' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Tooth Outline */}
            <path 
              d="M30,40 C30,22 42,18 50,20 C58,18 70,22 70,40 C70,60 66,75 58,82 C54,86 46,86 42,82 C34,75 30,60 30,40 Z" 
              fill="#ffffff" 
              stroke="#0abab5" 
              strokeWidth="2" 
            />
            {/* Calculus/Plaque built up */}
            <motion.path 
              d="M30,55 C34,60 42,62 50,62 C58,62 66,60 70,55 C68,70 60,82 50,82 C40,82 32,70 30,55 Z" 
              fill="#d4b07a" 
              animate={{ opacity: [1, 0.4, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Ultrasonic instrument vibrating */}
            <motion.g
              animate={{ 
                x: [-3, 3, -1, 2, -3],
                y: [-2, 2, -3, 1, -2]
              }}
              transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
            >
              <line x1="20" y1="20" x2="35" y2="45" stroke="#888888" strokeWidth="2.5" />
              <line x1="35" y1="45" x2="40" y2="53" stroke="#cccccc" strokeWidth="1.5" />
              {/* Sparkle drops */}
              <circle cx="43" cy="56" r="1" fill="#5ac1c1" />
              <circle cx="38" cy="50" r="1.5" fill="#c1eeee" />
            </motion.g>
          </svg>
          <motion.div 
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }} 
            className="absolute top-4 right-6 text-[#b8975a] opacity-80"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>
      )}

      {/* 2. PAEDIATRIC CARE */}
      {type === 'pediatric' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Cute Child Tooth Character with Crown or Smile */}
            <path 
              d="M30,42 C30,28 42,24 50,26 C58,24 70,28 70,42 C70,58 66,72 58,78 C54,82 46,82 42,78 C34,72 30,58 30,42 Z" 
              fill="#ffffff" 
              stroke="#0abab5" 
              strokeWidth="2" 
            />
            {/* Smiling Face */}
            <circle cx="43" cy="45" r="2.5" fill="#1c3d3d" />
            <circle cx="57" cy="45" r="2.5" fill="#1c3d3d" />
            <path d="M46,54 Q50,60 54,54" stroke="#1c3d3d" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="36" cy="49" r="2" fill="#fda4af" opacity="0.6" />
            <circle cx="64" cy="49" r="2" fill="#fda4af" opacity="0.6" />
          </svg>
          {/* Looping stars */}
          <motion.div 
            animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-6 left-8 text-xl"
          >
            ⭐
          </motion.div>
          <motion.div 
            animate={{ y: [0, 8, 0], scale: [0.9, 1.1, 0.9] }} 
            transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-6 right-8 text-xl"
          >
            🫧
          </motion.div>
        </div>
      )}

      {/* 3. MICRO-FILLINGS */}
      {type === 'fillings' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <path 
              d="M30,40 C30,22 42,18 50,20 C58,18 70,22 70,40 C70,60 66,75 58,82 C54,86 46,86 42,82 C34,75 30,60 30,40 Z" 
              fill="#fcfaf7" 
              stroke="#1c3d3d" 
              strokeWidth="2" 
            />
            {/* Cavity that gets sealed with glowing blue light */}
            <motion.path 
              d="M45,32 Q50,42 55,32" 
              stroke="#665c49" 
              strokeWidth="4" 
              strokeLinecap="round"
              animate={{ stroke: ["#665c49", "#59dddd", "#ffffff", "#665c49"] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            />
            {/* Precision Laser Cure light */}
            <motion.line 
              x1="50" y1="0" x2="50" y2="30" 
              stroke="#22d3ee" 
              strokeWidth="2.5" 
              animate={{ opacity: [0.1, 0.8, 1, 0.1] }}
              style={{ filter: 'drop-shadow(0 0 4px #22d3ee)' }}
              transition={{ duration: 3.5, repeat: Infinity }}
            />
          </svg>
        </div>
      )}

      {/* 4. ROOT CANAL TREATMENT */}
      {type === 'rct' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Tooth cross-section snippet */}
            <path 
              d="M30,30 C30,15 42,10 50,12 C58,10 70,15 70,30 C70,50 66,75 58,86 C54,92 46,92 42,86 C34,75 30,50 30,30 Z" 
              fill="#ede8df" 
              stroke="#333333" 
              strokeWidth="2" 
            />
            {/* Inner Root Canal canal network pulsing with healing pink */}
            <motion.path 
              d="M48,32 Q50,45 52,65 Q54,75 56,82 M48,32 Q46,45 44,65 Q42,75 40,82" 
              fill="none" 
              stroke="#cf4646" 
              strokeWidth="2"
              animate={{ stroke: ['#cf4646', '#59dddd', '#f7a8b8', '#cf4646'] }}
              transition={{ duration: 4.5, repeat: Infinity }}
            />
            {/* Moving active canal cleaning file */}
            <motion.path 
              d="M50,10 L50,60" 
              fill="none" 
              stroke="#cccccc" 
              strokeWidth="1.5"
              animate={{ y: [-5, 15, -5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      )}

      {/* 5. CROWNS & BRIDGES */}
      {type === 'crowns' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Base Tooth Prepped Abutment */}
            <path 
              d="M38,65 C38,50 42,45 50,45 C58,45 62,50 62,65 Z" 
              fill="#ecdcb9" 
              stroke="#a48c5a" 
              strokeWidth="1.5" 
            />
            {/* Zirconia Crown dropping down and docking */}
            <motion.path 
              d="M33,48 C33,26 42,16 50,18 C58,16 67,26 67,48 Z" 
              fill="#ffffff" 
              stroke="#0abab5" 
              strokeWidth="2" 
              animate={{ y: [-15, 0, -15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      )}

      {/* 6. GUM SURGERY */}
      {type === 'gums' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Roots of teeth */}
            <path d="M35,40 L35,62 M50,40 L50,62 M65,40 L65,62" stroke="#ecdcb9" strokeWidth="8" strokeLinecap="round" />
            
            {/* Inflamed receding gums turning healthy coral pink */}
            <motion.path 
              d="M25,55 Q35,50 50,50 Q65,50 75,55 L75,80 L25,80 Z" 
              fill="#fda4af" 
              stroke="#f43f5e" 
              strokeWidth="1.5" 
              animate={{ 
                fill: ['#af3e3e', '#fda4af', '#f43f5e', '#af3e3e'],
                y: [4, -4, -4, 4]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Dental Laser sanitizing */}
            <motion.line 
              x1="50" y1="20" x2="50" y2="48" 
              stroke="#ef4444" 
              strokeWidth="2" 
              animate={{ opacity: [0.1, 0.9, 0.1], x: [35, 65, 35] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
        </div>
      )}

      {/* 7. DENTAL IMPLANTS */}
      {type === 'implants' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Titanium screw assembly animation */}
            <motion.g
              initial={{ y: -10, opacity: 0.5 }}
              animate={{ y: [0, 8, 0], opacity: 1 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Titanium root thread */}
              <line x1="50" y1="55" x2="50" y2="80" stroke="#708090" strokeWidth="5" strokeDasharray="3,2" />
              {/* Abutment base */}
              <rect x="42" y="44" width="16" height="12" fill="#d4b07a" rx="2" />
              {/* Stunning porcelain Crown capped on top */}
              <path 
                d="M33,40 C33,20 42,12 50,14 C58,12 67,20 67,40 Z" 
                fill="#ffffff" 
                stroke="#0abab5" 
                strokeWidth="2" 
              />
            </motion.g>
          </svg>
        </div>
      )}

      {/* 8. TEETH WHITENING */}
      {type === 'whitening' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            {/* Tooth */}
            <path 
              d="M30,40 C30,22 42,18 50,20 C58,18 70,22 70,40 C70,60 66,75 58,82 C54,86 46,86 42,82 C34,75 30,60 30,40 Z" 
              fill="#ffffff" 
              stroke="#0abab5" 
              strokeWidth="2" 
            />
            {/* Overlaid Yellow stain layer wiping right-to-left under laser influence */}
            <g style={{ clipPath: 'inset(0 0 0 50%)' }}>
              <path 
                d="M30,40 C30,22 42,18 50,20 C58,18 70,22 70,40 C70,60 66,75 58,82 C54,86 46,86 42,82 C34,75 30,60 30,40 Z" 
                fill="#fceebb" 
                stroke="#d4b07a" 
                strokeWidth="2" 
              />
            </g>
            {/* Laser scanning vertical bar */}
            <motion.line 
              x1="50" y1="15" x2="50" y2="85" 
              stroke="#06b6d4" 
              strokeWidth="2.5" 
              animate={{ x: [30, 70, 30] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
            />
          </svg>
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute right-8 top-6 text-[#b8975a]"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>
      )}

      {/* 9. BRACES & ORTHODONTICS */}
      {type === 'braces' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className="w-32 h-24" viewBox="0 0 120 100">
            {/* Three teeth layout aligning under brace tension */}
            {[0, 1, 2].map((idx) => {
              const baseTilt = idx === 0 ? 12 : idx === 2 ? -15 : 4;
              return (
                <motion.g
                  key={idx}
                  animate={{ rotate: [baseTilt, 0, baseTilt] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: `${idx === 0 ? '26px' : idx === 1 ? '60px' : '94px'} 74px` }}
                >
                  {/* Individual tooth */}
                  <path 
                    d={`${idx === 0 ? 'M10,40 C10,25 20,21 26,22 C32,21 42,25 42,40 C42,55 38,68 32,74 C29,77 23,77 20,74 C14,68 10,55 10,40 Z' : idx === 1 ? 'M44,40 C44,25 54,21 60,22 C66,21 76,25 76,40 C76,55 72,68 66,74 C63,77 57,77 54,74 C48,68 44,55 44,40 Z' : 'M78,40 C78,25 88,21 94,22 C100,21 110,25 110,40 C110,55 106,68 100,74 C97,77 91,77 88,74 C82,68 78,55 78,40 Z'}`}
                    fill="#ffffff" 
                    stroke="#cccccc" 
                    strokeWidth="1.5" 
                  />
                  {/* Metal Bracket */}
                  <rect 
                    x={idx === 0 ? '20' : idx === 1 ? '54' : '88'} 
                    y="38" 
                    width="12" 
                    height="12" 
                    fill="#475569" 
                    rx="1" 
                  />
                  <line 
                    x1={idx === 0 ? '18' : idx === 1 ? '52' : '86'} 
                    y1="44" 
                    x2={idx === 0 ? '34' : idx === 1 ? '68' : '102'} 
                    y2="44" 
                    stroke="#1e293b" 
                    strokeWidth="2" 
                  />
                </motion.g>
              );
            })}
            {/* Guide Archwire spanning horizontally across all brackets */}
            <motion.line 
              x1="5" y1="44" x2="115" y2="44" 
              stroke="#94a3b8" 
              strokeWidth="2.5" 
              animate={{ y: [0, -1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </svg>
        </div>
      )}
    </div>
  );
}
