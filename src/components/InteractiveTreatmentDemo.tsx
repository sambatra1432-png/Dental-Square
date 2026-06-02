import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  Activity, 
  ShieldCheck, 
  Flame, 
  ChevronRight, 
  Info,
  Maximize2
} from 'lucide-react';

interface InteractiveTreatmentDemoProps {
  treatmentName: string;
  onClose: () => void;
}

export default function InteractiveTreatmentDemo({ treatmentName, onClose }: InteractiveTreatmentDemoProps) {
  // Map names to specific simulation screens
  const getSimType = () => {
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

  const simType = getSimType();

  // State shared among interactions
  const [sliderVal, setSliderVal] = useState<number>(20);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Clean reset
  const handleReset = () => {
    setSliderVal(20);
    setActiveStep(0);
    setIsDone(false);
    setIsPlaying(false);
  };

  // Treatment description files
  const getTreatmentMeta = () => {
    switch (simType) {
      case 'scaling':
        return {
          title: 'Ultrasonic Plaque Exterminator',
          benefit: 'Removes hard calculus, preserves pink gum lines, and eliminates chronic bad breath.',
          instructions: 'Slide the Scaling Power bar to guide the gentle micro-vibrational tip. Watch hard tartar layers break away, revealing clean, natural enamel underneath.',
          urgency: 'Highly recommended once every 6 months to prevent irreversible teeth loosening.'
        };
      case 'pediatric':
        return {
          title: 'Happy Tooth Safe Protection',
          benefit: 'Protects tender child teeth from aggressive cavities and builds confidence.',
          instructions: 'Click "Brush Away Sugar Bugs" to launch a clinical foaming session. Interactive brushing breaks down sweet acidic residues, leaving a strong protective shield.',
          urgency: 'Helps young patients develop dental compliance without any lifetime fear.'
        };
      case 'fillings':
        return {
          title: 'Fluoride Composite Injection',
          benefit: 'Seals decayed enamel cavities, blocks sensitivity, and restores 100% chewing surface structures.',
          instructions: 'Perform the three steps: Click to clear decayed grey layers, apply biocompatible white resin, and light cure with our specialized blue UV laser handler.',
          urgency: 'Prevents shallow enamel cavities from penetrating roots and requiring root canal treatments.'
        };
      case 'rct':
        return {
          title: 'Salvage Infected Root Chambers',
          benefit: 'Stops acute toothaching, treats underlying root infections, and salvages natural structures.',
          instructions: 'Go through the steps: Click to clear infected tissues, irrigate and sterile-dry the canal channels, and finally plug rubberized sealing gutta-percha with a porcelain crown fitting.',
          urgency: 'Your absolute final resort to save the natural tooth before extraction is forced.'
        };
      case 'crowns':
        return {
          title: 'Monolithic Ceramic Cap Ingress',
          benefit: 'Protects highly cracked teeth, restores beautiful look, and can withstand maximum chewing force.',
          instructions: 'Use the Crown Placement slider to drop the translucent zirconia restoration onto the prepared tooth structure. Watch it dock and seal tightly below the protective margins.',
          urgency: 'Critical within 14 days after a Root Canal to prevent the tooth structure from cracking.'
        };
      case 'gums':
        return {
          title: 'Soft Gum Laser Rejuvenation',
          benefit: 'Cures bleeding sockets, tightens loose dental support, and elevates receding margins.',
          instructions: 'Adjust the Gums Rehydration handle to watch inflamed, receding red gum linings undergo sterilization and lift back to a healthy pink protective socket level.',
          urgency: 'Crucial for patients noticing exposed roots, severe bleeding during brushings, or loose molars.'
        };
      case 'implants':
        return {
          title: 'Aesthetic Root Implantation',
          benefit: 'Permanent titanium tooth replacement. Provides natural bone stimulation and zero slippage.',
          instructions: 'Advance through our step-by-step assembly: Click to insert the titanium anchor, lock the custom golden abutment, and screw on the pristine porcelain dental crown.',
          urgency: 'Prevents adjacent teeth from drifting and avoids facial bone collapse following extractions.'
        };
      case 'whitening':
        return {
          title: 'Laser Activated Oxygen Bleaching',
          benefit: 'Instantly removes decades of deep tea, smoke, and food stains, lifting shades up to 8 levels.',
          instructions: 'Sweep the compares overlay bar to check yellow A4-shade teeth against lightened, radiant clinical whitening. Drag all the way to trigger sparkling activation!',
          urgency: 'An elegant, non-invasive treatment completed under single dental chair settings.'
        };
      case 'braces':
        return {
          title: 'Orthodontic Alignment Tensioner',
          benefit: 'Straightens overlapping teeth, fixes crowding, corrects underbites/overbites, and styles a flawless smile.',
          instructions: 'Drag the Alignment Tension slider to regulate the soft correction forces. Watch twisted teeth shift smoothly under dental guidewires into gorgeous alignment.',
          urgency: 'Highly optimized during youth, but fully available for adults via invisible clear aligners.'
        };
    }
  };

  const meta = getTreatmentMeta();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[11000] flex items-center justify-center p-4 sm:p-6 select-none"
      id="treatment-demo-modal"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="bg-neutral-900 border border-stone-800 text-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative max-h-[90vh] sm:max-h-[85vh] lg:max-h-none"
      >
        {/* Simulator Interaction Area */}
        <div className="w-full lg:w-3/5 bg-[#141414] p-6 lg:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-stone-850 overflow-y-auto lg:overflow-visible">
          {/* Active Sim Banner Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 bg-[#b8975a]/10 border border-[#b8975a]/30 text-[#b8975a] text-[9px] font-mono tracking-widest uppercase rounded-full">
              <Activity className="w-3 h-3 text-[#b8975a] animate-pulse" />
              Patient Interactive Simulator
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-full hover:bg-white/5 text-stone-400 hover:text-white transition-colors cursor-pointer border border-stone-850"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SIMULATION VISUALIZERS */}
          <div className="flex-grow flex items-center justify-center py-6 min-h-[220px] sm:min-h-[280px]">
            {/* 1. SCALING & POLISHING */}
            {simType === 'scaling' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                <svg className="w-48 h-48 drop-shadow-[0_10px_15px_rgba(45,106,106,0.15)]" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="toothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="60%" stopColor="#f4ede0" />
                      <stop offset="100%" stopColor="#ded1be" />
                    </linearGradient>
                    <linearGradient id="plaqueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e3c784" />
                      <stop offset="100%" stopColor="#967b44" />
                    </linearGradient>
                  </defs>
                  
                  {/* Tooth Core */}
                  <g>
                    {/* Crown outline */}
                    <path 
                      d="M20,40 C20,20 40,15 60,18 C80,15 100,20 100,40 C100,65 95,85 85,95 C78,102 68,105 60,105 C52,105 42,102 35,95 C25,85 20,65 20,40 Z" 
                      fill="url(#toothGrad)" 
                    />
                    {/* Inner natural shine lines */}
                    <path d="M30,35 Q45,30 55,30" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
                  </g>

                  {/* Intersecting Plaque Overlay (disappears as sliderVal goes up) */}
                  {sliderVal < 95 && (
                    <motion.path 
                      d="M20,40 C20,20 40,15 60,18 C80,15 100,20 100,40 C100,65 95,85 85,95 C78,102 68,105 60,105 C52,105 42,102 35,95 C25,85 20,65 20,40 Z" 
                      fill="url(#plaqueGrad)"
                      style={{ opacity: (100 - sliderVal) / 100 }}
                    />
                  )}
                </svg>

                {/* Simulated Scaling Wand */}
                {sliderVal < 95 && (
                  <motion.div 
                    className="absolute z-10 pointer-events-none"
                    animate={{ 
                      x: [0, -25, 30, -10, 20, 0], 
                      y: [0, -15, 25, -20, 10, 0] 
                    }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    style={{ 
                      left: `${30 + (sliderVal * 0.4)}%`, 
                      top: '30%' 
                    }}
                  >
                    {/* Ultrasonic Scaler SVG */}
                    <svg className="w-16 h-16 origin-bottom-left" viewBox="0 0 40 40">
                      <path d="M0,40 L18,22 L15,19 L0,40" fill="#0abab5" />
                      <line x1="18" y1="22" x2="30" y2="10" stroke="#cccccc" strokeWidth="2.5" />
                      {/* Water mist */}
                      <circle cx="32" cy="8" r="1.5" fill="#5ac1c1" className="animate-ping" />
                      <circle cx="28" cy="12" r="1" fill="#c1eeee" />
                    </svg>
                  </motion.div>
                )}

                {/* Clean sparkles */}
                {sliderVal >= 90 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.3 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute"
                  >
                    <Sparkles className="w-12 h-12 text-[#0abab5] animate-bounce" />
                    <Sparkles className="w-6 h-6 text-[#b8975a] absolute -top-8 -right-8 animate-ping" />
                  </motion.div>
                )}
              </div>
            )}

            {/* 2. PAEDIATRIC CARE */}
            {simType === 'pediatric' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={isDone ? { y: [0, -10, 0], scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: isDone ? Infinity : 0, duration: 1.8 }}
                  className="relative p-6"
                >
                  {/* Tooth Character */}
                  <svg className="w-40 h-40" viewBox="0 0 100 100">
                    <path 
                      d="M15,30 C15,15 35,10 50,15 C65,10 85,15 85,30 C85,60 80,75 70,85 C65,90 58,92 50,92 C42,92 35,90 30,85 C20,75 15,60 15,30 Z" 
                      fill="#ffffff" 
                      stroke="#0abab5" 
                      strokeWidth="3.5"
                    />
                    
                    {isDone ? (
                      // Smiling Happy Eyes & Cheerful Tongue
                      <g>
                        <path d="M30,40 Q35,35 40,40" stroke="#0abab5" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M60,40 Q65,35 70,40" stroke="#0abab5" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M40,55 Q50,65 60,55" stroke="#0abab5" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                        <path d="M43,58 C45,63 55,63 57,58 Z" fill="#e06666" />
                        {/* Blush bubbles */}
                        <circle cx="24" cy="48" r="4" fill="#fbcfe8" />
                        <circle cx="76" cy="48" r="4" fill="#fbcfe8" />
                      </g>
                    ) : (
                      // Scared/Wobbly Eyes (Sugar Bugs around)
                      <g>
                        <circle cx="35" cy="42" r="5" fill="#0abab5" />
                        <circle cx="37" cy="40" r="1.5" fill="#ffffff" />
                        <circle cx="65" cy="42" r="5" fill="#0abab5" />
                        <circle cx="67" cy="40" r="1.5" fill="#ffffff" />
                        <path d="M40,58 Q50,52 60,58" stroke="#0abab5" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </g>
                    )}
                  </svg>

                  {/* Interactive Sugar bugs floating when not brushed */}
                  {!isDone && (
                    <g>
                      <motion.div 
                        animate={{ y: [0, -12, 0], rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2 }}
                        className="absolute top-10 left-4 text-2xl"
                      >
                        🦠
                      </motion.div>
                      <motion.div 
                        animate={{ y: [0, 15, 0], rotate: [0, -20, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="absolute bottom-12 right-2 text-2xl"
                      >
                        🦠
                      </motion.div>
                    </g>
                  )}

                  {/* Foaming bubbles brush trigger */}
                  {isPlaying && (
                    <motion.div 
                      initial={{ scale: 0.1, opacity: 0 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="w-32 h-32 bg-teal-100/30 rounded-full border border-teal-200 border-dashed animate-spin" />
                      <div className="text-xl absolute top-12">🫧</div>
                      <div className="text-xl absolute bottom-8 left-12">🫧</div>
                      <div className="text-xl absolute right-16 top-16">🧸</div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}

            {/* 3. MICRO-FILLINGS */}
            {simType === 'fillings' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                <svg className="w-44 h-44 border border-stone-800 rounded-2xl bg-neutral-950 p-4" viewBox="0 0 100 100">
                  {/* Tooth base contour */}
                  <path 
                    d="M15,20 C15,5 35,5 50,12 C65,5 85,5 85,20 C85,55 80,75 70,85 C60,95 40,95 30,85 C20,75 15,55 15,20 Z" 
                    fill="#fcfaf7" 
                    stroke="#1c3d3d" 
                    strokeWidth="2.5"
                  />
                  
                  {/* Step visual states */}
                  {activeStep === 0 && (
                    // Decay cavity state
                    <path d="M40,25 C40,15 60,15 63,22 C65,30 45,35 40,25" fill="#665c49" />
                  )}

                  {activeStep === 1 && (
                    // Prepared empty cavity state
                    <path d="M40,25 C40,15 60,15 63,22 C65,30 45,35 40,25" fill="#dedede" stroke="#cccccc" strokeWidth="1.5" />
                  )}

                  {activeStep === 2 && (
                    // Loaded glowing composite composite state
                    <path d="M40,25 C40,15 60,15 63,22 C65,30 45,35 40,25" fill="#9deae2" className="animate-pulse" />
                  )}

                  {activeStep === 3 && (
                    // Permanent perfect solid filling
                    <path d="M40,25 C40,15 60,15 63,22 C65,30 45,35 40,25" fill="#ffffff" stroke="#e6e6e6" strokeWidth="1" />
                  )}
                </svg>

                {/* Laser light curing beam overlay */}
                {activeStep === 2 && isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    className="absolute w-full h-full flex flex-col items-center justify-center pointer-events-none"
                  >
                    {/* Blue beam representation */}
                    <div className="w-1.5 h-36 bg-cyan-400 absolute top-0 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    <div className="w-6 h-6 bg-cyan-400/50 rounded-full animate-ping absolute top-[45%]" />
                  </motion.div>
                )}
              </div>
            )}

            {/* 4. ROOT CANAL TREATMENT (RCT) */}
            {simType === 'rct' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                <svg className="w-48 h-48 bg-neutral-950 p-2 rounded-2xl border border-stone-850" viewBox="0 0 120 120">
                  <defs>
                    <clipPath id="toothClip">
                      <path d="M30,25 C30,10 50,5 60,12 C70,5 90,10 90,25 C90,60 85,85 75,98 C70,105 60,112 60,112 C60,112 50,105 45,98 C35,85 30,60 30,25 Z" />
                    </clipPath>
                  </defs>

                  {/* Main bounding outline */}
                  <path 
                    d="M30,25 C30,10 50,5 60,12 C70,5 90,10 90,25 C90,60 85,85 75,98 C70,105 60,112 60,112 C60,112 50,105 45,98 C35,85 30,60 30,25 Z" 
                    fill="#333333" 
                    stroke="#111111" 
                    strokeWidth="2.5"
                  />

                  {/* Inside layers masked */}
                  <g clipPath="url(#toothClip)">
                    {/* Dentin fill */}
                    <path d="M0,0 H120 V120 H0 Z" fill="#ede8df" opacity="0.9" />

                    {/* Central nerve chambers according to active treatment stages */}
                    {activeStep === 0 ? (
                      // Infected deep crimson pulse tissue
                      <path 
                        d="M57,30 C55,20 65,20 63,30 C63,45 68,60 70,85 C68,75 52,75 50,85 C52,60 57,45 57,30 Z" 
                        fill="#cf4646" 
                        className="animate-pulse" 
                      />
                    ) : activeStep === 1 ? (
                      // Completely emptied clean/white canal structure
                      <path 
                        d="M57,30 C55,20 65,20 63,30 C63,45 68,60 70,85 C68,75 52,75 50,85 C52,60 57,45 57,30 Z" 
                        fill="#ffffff" 
                      />
                    ) : activeStep === 2 ? (
                      // Blue healing sterilizing ultraviolet beam filling
                      <path 
                        d="M57,30 C55,20 65,20 63,30 C63,45 68,60 70,85 C68,75 52,75 50,85 C52,60 57,45 57,30 Z" 
                        fill="#59dddd" 
                        className="animate-pulse"
                      />
                    ) : (
                      // Healthy biocompatible gutta-percha filling sealing (pink)
                      <path 
                        d="M57,30 C55,20 65,20 63,30 C63,45 68,60 70,85 C68,75 52,75 50,85 C52,60 57,45 57,30 Z" 
                        fill="#f7a8b8" 
                      />
                    )}
                  </g>
                </svg>

                {/* File wand animating in canal clearance */}
                {activeStep === 1 && (
                  <motion.div 
                    animate={{ y: [-15, 20, -15] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute w-1 h-24 bg-cyan-500 rounded shadow-md pb-8 text-[9px] font-mono text-center text-white"
                  >
                    File
                  </motion.div>
                )}
              </div>
            )}

            {/* 5. CROWNS & BRIDGES */}
            {simType === 'crowns' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                {/* Tooth stump base waiting */}
                <div className="absolute top-[48%] w-32 h-20 bg-amber-500/10 border border-[#b8975a]/30 rounded-t-xl flex flex-col items-center justify-center text-[10px] font-mono text-[#b8975a]">
                  Prepared Stub
                </div>

                {/* Custom Zirconia porcelain Crown lowering on slider sliderVal */}
                <motion.div 
                  className="absolute"
                  style={{ 
                    top: `${15 + (40 - (sliderVal * 0.4))}%`,
                    opacity: 0.45 + (sliderVal / 150)
                  }}
                >
                  <svg className="w-28 h-20 drop-shadow-[0_12px_15px_rgba(255,255,255,0.15)]" viewBox="0 0 100 70">
                    <path 
                      d="M10,65 C10,15 35,5 50,12 C65,5 90,15 90,65 Q50,55 10,65 Z" 
                      fill="#ffffff" 
                      stroke="#0abab5" 
                      strokeWidth="2.5" 
                    />
                    {/* Gloss shine reflection line */}
                    <path d="M25,25 Q45,18 60,18" stroke="#dcfafa" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </motion.div>

                {/* Docked indicators */}
                {sliderVal >= 98 && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: [1, 1.3, 1] }}
                    className="absolute top-2 z-10 bg-teal-950/80 border border-teal-500 py-1 px-3.5 rounded-full text-[10px] font-mono text-teal-400 uppercase tracking-widest animate-pulse"
                  >
                    Perfect Seal Lock 🔒
                  </motion.div>
                )}
              </div>
            )}

            {/* 6. GUM SURGERY */}
            {simType === 'gums' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                {/* Teeth core sitting fixed */}
                <div className="flex gap-1.5 items-end justify-center">
                  {[1, 2, 3].map((id) => (
                    <div key={id} className="w-10 h-24 bg-white rounded-b-lg border-x border-[#f8f5ee] relative flex flex-col justify-end">
                      {/* Exposed Root representation */}
                      <div className="h-10 bg-amber-200/50 rounded-b-lg text-[8px] text-center text-amber-900/60 font-mono">Root</div>
                    </div>
                  ))}
                </div>

                {/* Configurable gum slider line overlay */}
                <div 
                  className="absolute bottom-6 w-52 rounded-t-xl transition-all duration-300"
                  style={{ 
                    // Gum height controls
                    height: `${30 + (sliderVal * 0.45)}%`,
                    // Gum healthy color controls changing from irritated deep crimson to rich soft healthy coral pink
                    backgroundColor: sliderVal < 50 ? '#af3e3e' : '#fda4af',
                    opacity: 0.85
                  }}
                >
                  <div className="w-full h-full border-t-4 border-rose-400 flex items-center justify-center text-[9px] font-mono text-neutral-900 uppercase font-bold tracking-widest">
                    {sliderVal < 50 ? 'Receded Gums' : 'Protected Gums'}
                  </div>
                </div>
              </div>
            )}

            {/* 7. DENTAL IMPLANTS */}
            {simType === 'implants' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                {/* Jawbone bed container */}
                <div className="absolute bottom-0 w-44 h-24 bg-stone-900 border border-stone-800 rounded-2xl flex items-end justify-center pb-2 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
                  Jawbone Foundation
                </div>

                {/* STEP 1: Screwed titanium post */}
                {activeStep >= 1 && (
                  <motion.div 
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-8 w-12 h-16 bg-[#708090] border-r-2 border-[#5f9ea0] rounded flex flex-col justify-between items-center text-[9px] font-mono text-white p-1"
                  >
                    <span>Thread</span>
                    <span>Anchor</span>
                  </motion.div>
                )}

                {/* STEP 2: Abutment addition */}
                {activeStep >= 2 && (
                  <motion.div 
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: -16, opacity: 1 }}
                    className="absolute bottom-16 w-8 h-10 bg-amber-500 rounded-t border border-amber-600 flex items-center justify-center text-[8px] font-mono font-bold text-neutral-950"
                  >
                    ABUT
                  </motion.div>
                )}

                {/* STEP 3: Complete porcelain crown placement */}
                {activeStep >= 3 && (
                  <motion.div 
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: -38, opacity: 1 }}
                    className="absolute bottom-20 w-16 h-14 bg-white rounded-t-xl border border-stone-200/50 shadow-md flex items-center justify-center text-[8px] font-mono text-[#0abab5] font-bold"
                  >
                    Crown
                  </motion.div>
                )}
              </div>
            )}

            {/* 8. TEETH WHITENING */}
            {simType === 'whitening' && (
              <div className="relative w-72 h-44 border border-stone-850 rounded-2xl bg-neutral-950 overflow-hidden flex shadow-inner">
                {/* Left side yellow A4 preview */}
                <div className="w-1/2 h-full bg-[#fceebb] flex flex-col justify-center items-center text-center p-3">
                  <span className="text-4xl">🦷</span>
                  <p className="text-stone-800 text-[10px] font-mono font-extrabold uppercase mt-2">Yellow A4 Shade</p>
                  <p className="text-stone-600 text-[9px] mt-1">Decades of Stain</p>
                </div>

                {/* Right side beautifully laser-lightened comparison */}
                <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center text-center p-3 relative">
                  {/* Sweep wipe mask revealing whitening shade based on slider progress */}
                  <div 
                    className="absolute inset-0 bg-white flex flex-col justify-center items-center text-center p-3 animate-fade-in"
                    style={{ 
                      clipPath: `inset(0 0 0 ${100 - sliderVal}%)`,
                      borderLeft: '1px solid #b8975a' 
                    }}
                  >
                    <span className="text-4xl text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">🦷</span>
                    <p className="text-[#0abab5] text-[10px] font-mono font-extrabold uppercase mt-2">Radiant B1 Shade</p>
                    <p className="text-emerald-600 text-[9px] font-semibold mt-1">✨ Up to 8 Shades Whiter</p>
                  </div>
                </div>

                {/* Slider divider wand trigger */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-[#b8975a] pointer-events-none"
                  style={{ left: `${sliderVal}%` }}
                />
              </div>
            )}

            {/* 9. BRACES & ORTHODONTICS */}
            {simType === 'braces' && (
              <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                {/* 3 teeth alignment layout */}
                <div className="flex gap-3 items-center justify-center relative w-full px-6">
                  {[0, 1, 2].map((idx) => {
                    // Teeth straightening physics shifting coordinates
                    const baseTilt = idx === 0 ? 14 : idx === 2 ? -18 : 6;
                    const finalTilt = 0;
                    const activeTilt = baseTilt - (baseTilt * (sliderVal / 100));

                    const baseShift = idx === 0 ? -12 : idx === 2 ? 10 : -8;
                    const activeShift = baseShift - (baseShift * (sliderVal / 100));

                    return (
                      <motion.div 
                        key={idx}
                        className="w-14 h-20 bg-white border border-stone-300 rounded-b-xl flex flex-col items-center justify-center relative shadow-xs"
                        style={{ 
                          rotate: `${activeTilt}deg`,
                          x: activeShift
                        }}
                      >
                        <span className="text-neutral-300 text-[9px] font-mono absolute top-2">Enamel</span>
                        
                        {/* Custom brackets fitted on teeth */}
                        <div className="w-6 h-6 bg-red-800 border border-neutral-400 rounded flex items-center justify-center text-white text-[7px] font-mono font-bold z-10 select-none">
                          🦷
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Wire Tension Line spanning across teeth */}
                  <div className="absolute left-6 right-6 h-1 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 shadow-sm top-[45%] pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* SIMULATION CONTROLLER TRIGGER ACTIONS */}
          <div className="pt-6 border-t border-stone-850">
            {/* Range sliders */}
            {['scaling', 'crowns', 'gums', 'whitening', 'braces'].includes(simType) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>Simulation Target Progress</span>
                  <span className="text-[#b8975a] font-bold">{sliderVal}% Complete</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#b8975a]"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-500 uppercase">
                  <span>Before Relief</span>
                  <span>Fully Restored</span>
                </div>
              </div>
            )}

            {/* Pediatric character brushing action */}
            {simType === 'pediatric' && (
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  disabled={isDone}
                  onClick={() => {
                    setIsPlaying(true);
                    setTimeout(() => {
                      setIsPlaying(false);
                      setIsDone(true);
                    }, 2400);
                  }}
                  className={`w-full py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-widest text-center transition-all ${
                    isDone 
                      ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-[#0abab5] hover:bg-[#1f4848] text-white hover:scale-102 cursor-pointer'
                  }`}
                >
                  {isDone ? '✨ Teeth Protected Successfully!' : isPlaying ? '🫧 Brushing sweet tooth...' : '🧹 Brush Away Sugar Bugs'}
                </button>
              </div>
            )}

            {/* Stepped assembly triggers */}
            {['fillings', 'rct', 'implants'].includes(simType) && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                  <span>Clinical Procedure Sequence</span>
                  <span>Step {activeStep + 1} of {simType === 'fillings' ? '4' : '4'}</span>
                </div>
                
                {/* Assembly guide path tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((step) => {
                    const stepTitles = {
                      fillings: ['Drill Cavity', 'Irrigate Clean', 'Seal Resin', 'Light Cure'],
                      rct: ['Drain Nerve', 'Sterile File', 'Gutta-Percha', 'Insert Crown'],
                      implants: ['Prep Bed', 'Suture Anchor', 'Golden Abutment', 'Crown Fit']
                    }[simType === 'fillings' ? 'fillings' : simType === 'rct' ? 'rct' : 'implants'];

                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => {
                          setActiveStep(step);
                          if (step === 3) {
                            setIsPlaying(true);
                            setTimeout(() => setIsPlaying(false), 3000);
                          }
                        }}
                        className={`py-2 px-1 text-[9px] font-bold uppercase tracking-tight rounded border transition-all ${
                          activeStep === step 
                            ? 'bg-[#b8975a] text-white border-[#b8975a]' 
                            : 'bg-stone-850 text-stone-400 border-stone-800 hover:text-white'
                        }`}
                      >
                        {stepTitles?.[step]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informative Side Card Column */}
        <div className="w-full lg:w-2/5 p-6 lg:p-10 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                {treatmentName} <span className="text-[#0abab5] font-normal italic">Walkthrough</span>
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 px-3 rounded-full hover:bg-white/5 border border-stone-850 text-stone-400 hover:text-white transition-colors cursor-pointer"
                title="Back to Services"
                id="close-sim-btn"
              >
                <X className="w-4 h-4 shrink-0 inline mr-1" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Exit</span>
              </button>
            </div>

            {/* High fidelity procedural specifications */}
            <div className="space-y-6 mt-8">
              <div>
                <h4 className="text-[11px] font-bold tracking-widest text-[#d4b07a] uppercase mb-1.5 font-mono">
                  🩺 {meta?.title}
                </h4>
                <p className="text-stone-300 text-[12.5px] leading-relaxed font-sans">
                  {meta?.benefit}
                </p>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-stone-850/60">
                <h4 className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-2 flex items-center gap-1.5 font-mono">
                  <Info className="w-3.5 h-3.5 text-[#0abab5]" />
                  How to Operate Simulator
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed font-sans">
                  {meta?.instructions}
                </p>
              </div>

              <div className="border-l-2 border-red-500/30 pl-4 py-1.5">
                <h4 className="text-[10px] font-bold tracking-widest text-red-400 uppercase mb-1 font-mono">
                  ⚠️ CLINICAL WARNING INDICATOR
                </h4>
                <p className="text-stone-400 text-[11.5px] leading-relaxed font-sans">
                  {meta?.urgency}
                </p>
              </div>
            </div>
          </div>

          {/* Secure sterilization badge confirmation */}
          <div className="pt-8 border-t border-stone-850/85 mt-8">
            <div className="flex items-start gap-3 bg-[#111111]/70 p-4.5 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold tracking-widest text-[#ffffff] uppercase mb-0.5 font-mono">
                  100% STERILE COMPLIANCE ASSURED
                </h4>
                <p className="text-stone-400 text-[10.5px] leading-relaxed font-sans">
                  Every instrument pouch is autoclaved and unpacked in front of patients. Total hygiene is verified step-by-step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
