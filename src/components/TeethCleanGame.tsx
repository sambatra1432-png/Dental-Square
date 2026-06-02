import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCcw, Smile, Award, Check, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

class ToothSoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    try {
      this.isMuted = localStorage.getItem('teeth_game_muted') === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch (e) {
        console.warn('Failed to resume AudioContext:', e);
      }
    }
    return this.ctx;
  }

  private playNoise(duration: number, volume: number) {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    try {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.warn('Synthesized noise failed:', e);
    }
  }

  public playSelect(tool: 'brush' | 'floss' | 'spray') {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (tool === 'brush') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);
      } else if (tool === 'floss') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.1);
      } else {
        this.playNoise(0.18, 0.03);
        return;
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Synthesized select tone failed:', e);
    }
  }

  public playClean(type: 'plaque' | 'food' | 'sugar-bug') {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'plaque') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
      } else if (type === 'food') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880.00, now); // A5
        osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.2); // A6
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.2);
        this.playNoise(0.15, 0.02);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('Synthesized clean tone failed:', e);
    }
  }

  public playError() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.25);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn('Synthesized error tone failed:', e);
    }
  }

  public playVictory() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Beautiful C Major chord arpeggio
      
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        gain.gain.setValueAtTime(0.08, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.37);
      });
    } catch (e) {
      console.warn('Synthesized victory chime failed:', e);
    }
  }
}

const toothSound = new ToothSoundManager();

interface GameItem {
  id: string;
  type: 'plaque' | 'food' | 'sugar-bug';
  name: string;
  emoji: string;
  description: string;
  x: number; // percentage from left (15-85)
  y: number; // percentage from top (25-75)
  size: number; // scale
  cleaned: boolean;
  angle: number;
}

export default function TeethCleanGame() {
  const [activeTool, setActiveTool] = useState<'brush' | 'floss' | 'spray'>('brush');
  const [attempts, setAttempts] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [feedback, setFeedback] = useState<string>('Select an organic dental tool to start polishing Tooth Buddy! 🦷');
  const [shake, setShake] = useState(false);
  const [muted, setMuted] = useState(toothSound.isMuted);

  // Sync state mutation with singleton
  const toggleMute = () => {
    const nextState = !muted;
    setMuted(nextState);
    toothSound.isMuted = nextState;
    try {
      localStorage.setItem('teeth_game_muted', String(nextState));
    } catch (e) {
      console.warn(e);
    }
  };

  // Initial dirty state coordinates relative to the cute tooth shape
  const [items, setItems] = useState<GameItem[]>([
    // Plaque & surface stains - cleaned by Brush
    { id: 'p1', type: 'plaque', name: 'Coffee Stain', emoji: '☕', description: 'Yellow-brown stain left on the outer enamel by your rich morning brew.', x: 28, y: 44, size: 34, cleaned: false, angle: 12 },
    { id: 'p2', type: 'plaque', name: 'Tea Tannin Tartar', emoji: '🍵', description: 'Stubborn dark tannin spot binding to the bottom ridge.', x: 50, y: 72, size: 36, cleaned: false, angle: -8 },
    { id: 'p3', type: 'plaque', name: 'Cheesy Plaque', emoji: '🧀', description: 'Sticky soft layer of calcium & bacteria accumulating from lunch.', x: 72, y: 46, size: 30, cleaned: false, angle: 25 },
    
    // Food scraps caught in gaps - cleaned by Floss
    { id: 'f1', type: 'food', name: 'Popcorn Husk', emoji: '🍿', description: 'Sharp hull wedged tightly into the deep left corner pocket.', x: 19, y: 58, size: 30, cleaned: false, angle: 90 },
    { id: 'f2', type: 'food', name: 'Stuck Broccoli', emoji: '🥦', description: 'Fibrous green floret trapped right between the interdental contacts.', x: 81, y: 56, size: 32, cleaned: false, angle: -90 },
    
    // Sticky candies & bacteria bugs - cleaned by Sparkle Jet / Spray
    { id: 'b1', type: 'sugar-bug', name: 'Sticky Chocolate', emoji: '🍫', description: 'Creamy cocoa residue turning into sticky plaque adhering to upper tooth valleys.', x: 38, y: 29, size: 38, cleaned: false, angle: -15 },
    { id: 'b2', type: 'sugar-bug', name: 'Sweet Soda Bug', emoji: '👿', description: 'Acid-producing colony of bacteria feeding on sticky liquid syrup.', x: 64, y: 31, size: 36, cleaned: false, angle: 18 }
  ]);

  const totalItems = items.length;
  const cleanedCount = items.filter(i => i.cleaned).length;
  const progressPercent = Math.round((cleanedCount / totalItems) * 100);
  const isFullyClean = cleanedCount === totalItems;

  const handleToolChange = (tool: 'brush' | 'floss' | 'spray') => {
    setActiveTool(tool);
    toothSound.playSelect(tool);
    if (tool === 'brush') {
      setFeedback('🪥 Toothbrush equipped! Absolute best for scrubbing off Coffee Stains ☕, Tea Tannin spots 🍵, and soft Cheesy Plaque 🧀 on the flat enamel surfaces!');
    } else if (tool === 'floss') {
      setFeedback('🧵 Dental Floss ready! Specially designed to glide between tightly touching teeth and pull out wedged Popcorn Husks 🍿 and Stuck Broccoli fibers 🥦!');
    } else if (tool === 'spray') {
      setFeedback('✨ Sparkle Water Jet armed! Pressurized micro-flusher easily dissolves sticky Chocolate 🍫 and washes off acidic Sweet Soda Bugs 👿!');
    }
  };

  const handleItemClick = (item: GameItem) => {
    if (item.cleaned) return;

    let isCorrectTool = false;
    if (item.type === 'plaque' && activeTool === 'brush') isCorrectTool = true;
    if (item.type === 'food' && activeTool === 'floss') isCorrectTool = true;
    if (item.type === 'sugar-bug' && activeTool === 'spray') isCorrectTool = true;

    setAttempts(prev => prev + 1);

    if (isCorrectTool) {
      // Clean target
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, cleaned: true } : i));
      
      const praises = [
        `Awesome scrubbing! You cured the ${item.emoji} ${item.name}! ✨`,
        `Perfect hygiene! The ${item.emoji} ${item.name} was successfully brushed off! 🧼`,
        `Fabulous flossing! You retrieved the ${item.emoji} ${item.name} from the gap! 🧵`,
        `High pressure blast! The sticky ${item.emoji} ${item.name} has been thoroughly rinsed! 🌊`,
        `Excellent! ${item.name} threat defeated before it could cause cavities! 🚀`
      ];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setFeedback(randomPraise);

      // Check if this was the last item to be cleaned
      if (cleanedCount + 1 === totalItems) {
        setShowConfetti(true);
        setFeedback('🏆 Sparkling clean! You successfully countered real Coffee stains, caught Popcorn, and acidic Sugar Bugs like a true Dental Champion! 🦷🎉');
        toothSound.playVictory();

        // Launch beautiful premium clinical-styled confetti explosion!
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0abab5', '#b8975a', '#ffffff', '#fbbf24', '#34d399']
        });

        // Launch delightful side burst cannons for ultimate victory satisfaction
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.8 },
            colors: ['#0abab5', '#b8975a', '#ffffff']
          });
        }, 250);

        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.8 },
            colors: ['#0abab5', '#b8975a', '#ffffff']
          });
        }, 450);
      } else {
        toothSound.playClean(item.type);
      }
    } else {
      // Trigger temporary shake error animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toothSound.playError();

      // Educate user on matching tool with real stains/scraps
      if (item.type === 'plaque') {
        setFeedback(`💡 Oops! The ${item.emoji} ${item.name} represents flat surface enamel discoloration. You need the 🪥 Toothbrush to polish it off!`);
      } else if (item.type === 'food') {
        setFeedback(`💡 Oops! The ${item.emoji} ${item.name} is packed deep between the interproximal gaps. Only 🧵 Dental Floss can reach inside and lift it out!`);
      } else if (item.type === 'sugar-bug') {
        setFeedback(`💡 Oops! The ${item.emoji} ${item.name} is a sticky sugary film. It requires the high-pressure ✨ Sparkle Water Jet to dissolve and rinse it!`);
      }
    }
  };

  const resetGame = () => {
    setItems(prev => prev.map(i => ({ ...i, cleaned: false })));
    setAttempts(0);
    setShowConfetti(false);
    setActiveTool('brush');
    setFeedback('🪥 Toothbrush is equipped first! Tap on flat Coffee stains ☕, Tea marks 🍵, or Plaque 🧀 on the tooth surface to scrub them away!');
    toothSound.playSelect('brush');
  };

  const handleScrollToBooking = () => {
    const section = document.getElementById('contact');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#fcfaf7] py-20 px-6 md:px-8 border-y border-stone-200 overflow-hidden" id="clinic-game">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center justify-center gap-3 mb-2">
            <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
            Interactive Micro-Oasis 🎮
            <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900">
            Polish <span className="italic font-normal text-[#0abab5]">Tooth Buddy</span> Healthy
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto mt-2 leading-relaxed">
            Equip dental tools to clear away lingering sugary plaque, food fibers, and sticky cavity bugs. Help Tooth Buddy smile!
          </p>
        </div>

        {/* Outer Game Console */}
        <div className="bg-white border-2 border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto relative">
          
          {/* Sparkles or Stars on Clean completion */}
          <AnimatePresence>
            {isFullyClean && (
              <div className="absolute inset-0 bg-[#0abab5]/5 rounded-3xl pointer-events-none flex items-center justify-center z-20">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute pointer-events-none"
                >
                  <Sparkles className="w-24 h-24 text-[#b8975a]/25 animate-pulse" />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Level Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-stone-400">Smile Rating:</span>
              <span className="text-sm font-extrabold text-[#0abab5] font-mono">{progressPercent}%</span>
            </div>
            <div className="flex gap-2.5 text-[10px] text-stone-500 font-mono">
              <span>Cleaned: <strong>{cleanedCount}/{totalItems}</strong></span>
              <span>•</span>
              <span>Attempts: <strong>{attempts}</strong></span>
            </div>
          </div>

          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-8 border border-stone-200/30">
            <motion.div 
              className="bg-[#0abab5] h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Core Playground: Adorable Tooth Canvas and Tools Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            {/* Left side: Tools panel (1 Column) */}
            <div className="flex md:flex-col gap-3 justify-center md:justify-start">
              {[
                { 
                  id: 'brush', 
                  label: 'Toothbrush', 
                  icon: '🪥', 
                  color: 'border-amber-400 hover:bg-amber-50 text-amber-800',
                  targetText: 'Cleans Stains',
                  emojis: [
                    { char: '☕', name: 'Coffee' },
                    { char: '🍵', name: 'Tea' },
                    { char: '🧀', name: 'Cheese' }
                  ]
                },
                { 
                  id: 'floss', 
                  label: 'Dental Floss', 
                  icon: '🧵', 
                  color: 'border-blue-400 hover:bg-blue-50 text-blue-800',
                  targetText: 'Gaps & Gums',
                  emojis: [
                    { char: '🍿', name: 'Popcorn' },
                    { char: '🥦', name: 'Broccoli' }
                  ]
                },
                { 
                  id: 'spray', 
                  label: 'Sparkle Jet', 
                  icon: '✨', 
                  color: 'border-emerald-400 hover:bg-emerald-50 text-emerald-800',
                  targetText: 'Sticky Sugars',
                  emojis: [
                    { char: '🍫', name: 'Chocolate' },
                    { char: '👿', name: 'Soda' }
                  ]
                }
              ].map((tool) => {
                const isSelected = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolChange(tool.id as any)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex-1 md:flex-initial text-center ${
                      isSelected
                        ? 'bg-[#0abab5] border-[#0abab5] text-white shadow-md shadow-[#0abab5]/15 scale-103'
                        : `bg-white border-stone-200 text-stone-705 shadow-sm ${tool.color}`
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl mb-1">{tool.icon}</span>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase font-mono">{tool.label}</span>
                    <span className={`text-[8px] mt-1 font-bold uppercase tracking-wider ${isSelected ? 'text-[#e9f2f2]' : 'text-stone-400'}`}>
                      {tool.targetText}
                    </span>
                    
                    {/* Visual target badges directly under the tools */}
                    <div className="flex gap-1.5 mt-2.5 justify-center">
                      {tool.emojis.map((emojiObj, idx) => (
                        <div 
                          key={idx}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-base sm:text-lg shadow-sm border transition-all duration-200 hover:scale-110 ${
                            isSelected 
                              ? 'bg-white/20 border-white/30 text-white' 
                              : 'bg-stone-50 border-stone-200/80 text-stone-800'
                          }`}
                          title={`Removes ${emojiObj.name}`}
                        >
                          {emojiObj.char}
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right side: Beautiful Interactive Tooth Canvas (3 Columns) */}
            <div className="md:col-span-3 bg-[#ede8df]/30 rounded-2xl p-4 min-h-[300px] border border-stone-200/60 flex items-center justify-center relative select-none overflow-hidden">
              
              {/* Adorable big SVG Tooth element */}
              <motion.div
                animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="w-48 h-56 relative flex items-center justify-center"
              >
                {/* Custom Vector Cute Tooth shape */}
                <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md cursor-default">
                  {/* Outer White Body */}
                  <path
                    d="M 40 40 
                       C 50 15, 90 15, 100 35 
                       C 110 15, 150 15, 160 40 
                       C 175 70, 175 120, 160 160 
                       C 152 180, 140 210, 125 210 
                       C 115 210, 110 190, 100 178 
                       C 90 190, 85 210, 75 210 
                       C 60 210, 48 180, 40 160 
                       C 25 120, 25 70, 40 40 Z"
                    fill={isFullyClean ? "#ffffff" : "#fefdfa"}
                    stroke="#e6decb"
                    strokeWidth="3.5"
                    className="transition-colors duration-500"
                  />
                  
                  {/* Rosy Cheeks (Soft pink circles) */}
                  <circle cx="58" cy="112" r={isFullyClean ? "14" : "10"} fill="#f87171" fillOpacity={isFullyClean ? "0.35" : "0.15"} className="transition-all duration-300" />
                  <circle cx="142" cy="112" r={isFullyClean ? "14" : "10"} fill="#f87171" fillOpacity={isFullyClean ? "0.35" : "0.15"} className="transition-all duration-300" />

                  {/* Active Interactive Expressions */}
                  {isFullyClean ? (
                    // 100% clean complete expression: Joyous Sparkly Eyes and Open Smile
                    <>
                      {/* Left Happy Curved Eye */}
                      <path d="M 50 95 Q 58 87 66 95" stroke="#111111" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                      {/* Right Happy Curved Eye */}
                      <path d="M 134 95 Q 142 87 150 95" stroke="#111111" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                      {/* Heartwarming Big Smiling Mouth */}
                      <path d="M 85 118 Q 100 144 115 118" stroke="#111111" strokeWidth="4" strokeLinecap="round" fill="#e11d48" />
                    </>
                  ) : progressPercent >= 40 ? (
                    // Partially cleaned: Cute cautious smile and simple round eyes
                    <>
                      <circle cx="58" cy="94" r="5.5" fill="#111111" />
                      <circle cx="142" cy="94" r="5.5" fill="#111111" />
                      <path d="M 88 122 Q 100 134 112 122" stroke="#111111" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                    </>
                  ) : (
                    // Dirty: Confused/sad wiggly mouth and downward closed sad/tired eyes
                    <>
                      <path d="M 52 90 L 64 96" stroke="#57534e" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M 136 96 L 148 90" stroke="#57534e" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M 90 126 Q 100 114 110 124" stroke="#57534e" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </>
                  )}
                </svg>

                {/* Overlay Game elements (Mischievous spots that must be clicked) */}
                {items.map((item) => {
                  if (item.cleaned) return null;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        position: 'absolute',
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) rotate(${item.angle}deg)`,
                      }}
                      className="absolute z-10 p-1 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none group"
                    >
                      {/* Interactive Educational Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center z-50 scale-90 group-hover:scale-100">
                        <div className="bg-neutral-900/95 border border-stone-800 text-white text-[9px] font-sans py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap leading-tight text-center">
                          <div className="font-extrabold flex items-center gap-1 justify-center">
                            <span>{item.emoji}</span>
                            <span className="text-amber-400">{item.name}</span>
                          </div>
                          <p className="text-stone-300 text-[8px] max-w-[150px] whitespace-normal mt-0.5 leading-snug">
                            {item.description}
                          </p>
                          <div className="text-[8px] text-teal-400 font-extrabold mt-1.5 uppercase tracking-wider">
                            Requires: {item.type === 'plaque' ? '🪥 Toothbrush' : item.type === 'food' ? '🧵 Dental Floss' : '✨ Sparkle Jet'}
                          </div>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="w-1.5 h-1.5 bg-neutral-900 border-r border-b border-stone-800 rotate-45 -translate-y-1" />
                      </div>

                      {item.type === 'plaque' && (
                        // Plaque Stain bubble blob
                        <div 
                          className="bg-amber-100 hover:bg-amber-100/90 border-2 border-amber-400/80 rounded-full flex items-center justify-center shadow-md select-none relative"
                          style={{ width: `${item.size}px`, height: `${item.size}px` }}
                        >
                          <span className="text-lg select-none">{item.emoji}</span>
                        </div>
                      )}

                      {item.type === 'food' && (
                        // Caught Food scrap line fiber
                        <div 
                          className="bg-[#b45309]/5 hover:bg-[#b45309]/15 border-2 border-[#b45309]/50 rounded-xl flex items-center justify-center shadow-sm select-none"
                          style={{ width: `${item.size}px`, height: `${item.size}px` }}
                        >
                          <span className="text-lg select-none">{item.emoji}</span>
                        </div>
                      )}

                      {item.type === 'sugar-bug' && (
                        // Evil Green Cavity Sugar Bug
                        <div 
                          className="bg-rose-50 hover:bg-rose-100 border-2 border-rose-300/80 rounded-2xl flex items-center justify-center shadow-md relative select-none animate-bounce"
                          style={{ width: `${item.size}px`, height: `${item.size}px`, animationDuration: '3s' }}
                        >
                          <span className="text-xl select-none">{item.emoji}</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}

                {/* Custom confetti explosion burst on absolute victory */}
                <AnimatePresence>
                  {isFullyClean && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: [1, 1.4, 1.2], rotate: 45 }}
                        className="absolute text-5xl pointer-events-none -top-12 -left-12 text-[#b8975a] drop-shadow-sm"
                        transition={{ duration: 0.8 }}
                      >
                        ✨
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: [1, 1.4, 1.2], rotate: -30 }}
                        className="absolute text-5xl pointer-events-none -top-12 -right-12 text-[#b8975a] drop-shadow-sm"
                        transition={{ duration: 0.8, delay: 0.15 }}
                      >
                        ✨
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.1 }}
                        animate={{ opacity: 1, scale: [1, 1.3, 1.1], y: -20 }}
                        className="absolute text-3xl pointer-events-none -bottom-8 text-emerald-600 font-bold"
                        transition={{ duration: 0.7 }}
                      >
                        👑 Sparkle!
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

              </motion.div>
            </div>

          </div>

          {/* Feedback & Interaction Dialogue Box */}
          <div className="mt-8 bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isFullyClean ? 'bg-amber-100 text-[#b8975a]' : 'bg-[#0abab5]/15 text-[#0abab5]'}`}>
              {isFullyClean ? <Award className="w-5 h-5 animate-bounce" /> : <Smile className="w-5 h-5" />}
            </div>
            <p className="text-stone-700 text-xs font-semibold leading-relaxed font-sans flex-1">
              {feedback}
            </p>
          </div>

          {/* Footer Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between pt-5 border-t border-stone-100">
            {isFullyClean ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScrollToBooking}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#0abab5] hover:bg-[#1f4a4a] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Keep Your Smile Bright! Book an Appointment
              </motion.button>
            ) : (
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#b8975a] animate-pulse">
                ⚙️ Equip tools and clear all {totalItems - cleanedCount} spots to win!
              </span>
            )}

            <div className="flex items-center gap-4 self-end">
              <button
                onClick={toggleMute}
                className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                title={muted ? "Unmute game sounds" : "Mute game sounds"}
              >
                {muted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />}
                {muted ? "Muted" : "Sounds"}
              </button>

              <span className="text-stone-300">|</span>

              <button
                onClick={resetGame}
                className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Stop / Reset Level
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
