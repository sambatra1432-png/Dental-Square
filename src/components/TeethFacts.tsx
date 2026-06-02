import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Fingerprint, 
  ShieldAlert, 
  Waves, 
  Wrench, 
  Maximize2, 
  Compass, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Trophy,
  CheckCircle,
  Egg
} from 'lucide-react';

// Web Audio API Synthesizer for Dental Square fun interactive effects
const playFactSound = (type: 'flip' | 'bubble' | 'sparkle' | 'woosh' | 'pop') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'flip') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'bubble') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.setValueAtTime(650, now + 0.06);
      osc.frequency.setValueAtTime(850, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'sparkle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.22);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'woosh') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {
    // Suppress audio failure if blocked by policy
  }
};

interface DentalFact {
  id: string;
  badge: string;
  title: string;
  miniDesc: string;
  fact: string;
  colorTheme: string;
  bgLight: string;
  iconBg: string;
  illustrationType: 'fingerprint' | 'iceberg' | 'superhero' | 'swimming' | 'repair' | 'whale';
  clinicalTip: string;
}

const FACTS_DATA: DentalFact[] = [
  {
    id: 'fact_01',
    badge: '🧬 AS UNIQUE AS YOU ARE',
    title: 'Tooth "Fingerprints"',
    miniDesc: 'No two teeth in the entire world are alike.',
    fact: 'Your bite register, gum arches, and dental sizes are 100% unique to you! Even identical twins who share the exact same genetic DNA code have completely different tooth placements and dental micro-arches.',
    colorTheme: '#0abab5',
    bgLight: 'bg-emerald-50/50',
    iconBg: 'bg-emerald-100',
    illustrationType: 'fingerprint',
    clinicalTip: 'Ensure you maintain your specific custom diagnostic scans for flawless matching records!'
  },
  {
    id: 'fact_02',
    badge: '🧊 THE DENTAL ICEBERG',
    title: 'Hidden 1/3 Underneath',
    miniDesc: 'About 30% of each tooth sits out of sight.',
    fact: 'Just like massive polar icebergs floating in the ocean, about a third of your tooth structure sits completely anchored out of sight beneath your gums. This is why keeping your pink gum line firm and protective is absolutely vital.',
    colorTheme: '#b8975a',
    bgLight: 'bg-[#ede8df]/40',
    iconBg: 'bg-[#ede8df]',
    illustrationType: 'iceberg',
    clinicalTip: 'Brush at a gentle 45-degree angle to clear plaque hiding where the gums meet the teeth.'
  },
  {
    id: 'fact_03',
    badge: '🛡️ SUPERHUMAN SHIELD',
    title: 'Harder Than Skeleton Bones',
    miniDesc: 'Enamel is the ultimate shield.',
    fact: 'Your tooth enamel is the absolute hardest tissue in the entire human body—surpassing even titanium-tough skeletal bones! Despite this supreme hardness, organic acids and soda sugars can easily erode it, so protect your shield.',
    colorTheme: '#22c55e',
    bgLight: 'bg-green-50/40',
    iconBg: 'bg-green-100',
    illustrationType: 'superhero',
    clinicalTip: 'Wait 30 minutes after meals before brushing to let your enamel naturally remineralize.'
  },
  {
    id: 'fact_04',
    badge: '🏊 LIFETIME SALIVA POOLS',
    title: 'Swimming Pool Hydration',
    miniDesc: 'You produce enough saliva to fill two pools!',
    fact: 'The average person produces around 25,000 quarts of pristine saliva in an active lifetime—which is enough water to completely fill up two entire diving swimming pools! Saliva works around the clock to wash off acids.',
    colorTheme: '#3b82f6',
    bgLight: 'bg-blue-50/50',
    iconBg: 'bg-blue-100',
    illustrationType: 'swimming',
    clinicalTip: 'Chewing sugar-free gum can safely double your saliva production to combat chronic dry mouth.'
  },
  {
    id: 'fact_05',
    badge: '🧰 ZERO SELF-HEALING',
    title: 'Teeth Can\'t Auto-Repair',
    miniDesc: 'Your teeth have zero regeneration cells.',
    fact: 'Unlike your skin, muscles, and bones, teeth can never heal themselves or naturally repair a cavity. The outermost surface contains no living biological cells. Once decay penetrates enamel, professional treatment is necessary.',
    colorTheme: '#ef4444',
    bgLight: 'bg-red-50/40',
    iconBg: 'bg-red-100',
    illustrationType: 'repair',
    clinicalTip: 'Catching decay early with micro-fillings prevents large infections and root canals.'
  },
  {
    id: 'fact_06',
    badge: '🐋 ANIMAL WORLD SECRET',
    title: 'Dolphins have 250 Teeth!',
    miniDesc: 'But Blue Whales have absolutely zero.',
    fact: 'Dolphins develop up to 250 pristine teeth used purely for food capture, yet the Blue Whale—the largest animal in history—doesn\'t grow a single tooth! They filter tiny krill through flexible baleen plates.',
    colorTheme: '#8b5cf6',
    bgLight: 'bg-purple-50/45',
    iconBg: 'bg-purple-100',
    illustrationType: 'whale',
    clinicalTip: 'Humans only get two natural sets of teeth (baby & adult). Treat them like gold!'
  }
];

export default function TeethFacts() {
  const [viewMode, setViewMode] = useState<'deck' | 'explorer'>('deck');
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [sparkleTrigger, setSparkleTrigger] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Play audio safely
  const triggerAudio = (sound: 'flip' | 'bubble' | 'sparkle' | 'woosh' | 'pop') => {
    if (soundEnabled) {
      playFactSound(sound);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    triggerAudio('woosh');
    setActiveCardIdx((prev) => (prev + 1) % FACTS_DATA.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    triggerAudio('woosh');
    setActiveCardIdx((prev) => (prev - 1 + FACTS_DATA.length) % FACTS_DATA.length);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    triggerAudio('flip');
  };

  const triggerSparkle = () => {
    setSparkleTrigger(prev => prev + 1);
    triggerAudio('sparkle');
  };

  // Render highly-polished, cute responsive CSS illustrations
  const renderCuteToothIllustration = (type: string, theme: string) => {
    switch (type) {
      case 'fingerprint':
        return (
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Pulsing glow behind */}
            <div className="absolute inset-4 rounded-full bg-emerald-500/10 blur-md animate-pulse" />
            
            {/* Main Tooth Outline */}
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-20 h-20 bg-white border-2 border-stone-800 rounded-b-xl rounded-t-2xl shadow-sm flex flex-col justify-between items-center p-2.5 z-10"
            >
              {/* Cute Winking Face */}
              <div className="flex gap-4 mt-2.5 w-full justify-center">
                <div className="w-2 h-2 rounded-full bg-stone-800 font-bold text-[8px] flex items-center justify-center animate-bounce">
                  <span>^</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-stone-800 font-bold text-[8px] flex items-center justify-center">
                  <span>-</span>
                </div>
              </div>
              
              {/* Rosy blush cheeks */}
              <div className="absolute top-6 inset-x-3 flex justify-between px-1">
                <div className="w-2 h-1 rounded-full bg-red-400/50 animate-pulse" />
                <div className="w-2 h-1 rounded-full bg-red-400/50 animate-pulse" />
              </div>

              {/* Tiny Smile */}
              <div className="w-2 h-1 border-b-2 border-stone-800 rounded-b-full -mt-2" />

              {/* Detective magnifying glass/glasses */}
              <div className="absolute top-1 left-2.5 w-5 h-5 border border-stone-800 rounded-full bg-emerald-200/40 flex items-center justify-center">
                <span className="text-[7px] font-bold text-stone-800">🔍</span>
              </div>

              {/* Roots */}
              <div className="absolute -bottom-2 inset-x-2 flex justify-between z-0">
                <div className="w-4 h-3 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
                <div className="w-4 h-3 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
              </div>
            </motion.div>

            {/* Floating Fingerprint icon */}
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute right-5 bottom-4 w-10 h-10 rounded-full bg-emerald-100 border border-emerald-500/30 flex items-center justify-center shadow-xs z-20"
            >
              <Fingerprint className="w-5 h-5 text-emerald-700" />
            </motion.div>
          </div>
        );

      case 'iceberg':
        return (
          <div className="relative w-36 h-36 flex items-center justify-center overflow-hidden">
            {/* Water Waves animated background */}
            <motion.div 
              animate={{ x: [-10, 5, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-2 inset-x-0 h-10 bg-sky-200/40 border-t border-sky-400/50 rounded-b-2xl z-20 pointer-events-none"
            />
            
            {/* Sparkles */}
            <motion.div 
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-4 left-6 text-[#b8975a] text-xs"
            >
              ✦
            </motion.div>

            {/* Iceberg Tooth */}
            <motion.div 
              animate={{ y: [2, -2, 2], rotate: [-1, 1, -1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-22 h-26 bg-white border-2 border-stone-800 rounded-t-2xl shadow-sm z-10 flex flex-col items-center justify-between"
            >
              {/* Crown (Above surface) */}
              <div className="pt-2 flex flex-col items-center">
                <div className="flex gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-800" />
                </div>
                <div className="text-[12px] text-stone-850 font-bold -mt-1 font-serif">☺</div>
              </div>

              {/* Submerged line watermark */}
              <div className="w-full border-t border-sky-300 border-dashed absolute top-14 left-0 right-0 z-10" />

              {/* Massive submerged sleeping root (Belowed surface) */}
              <div className="pb-3 w-full flex flex-col items-center justify-end bg-sky-50/50 flex-1 rounded-b-xl">
                <span className="text-[7px] font-mono text-stone-500 font-bold bg-sky-100 px-1 py-0.5 rounded">30% ANCHOR</span>
                <div className="flex justify-between w-12 -mb-2 mt-1 px-1">
                  <div className="w-3.5 h-4 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
                  <div className="w-3.5 h-4 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'superhero':
        return (
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Superhero Cape drawn with SVG */}
            <motion.div 
              animate={{ skewY: [0, 4, -4, 0], scaleX: [1, 1.05, 1] }} 
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute left-0 top-10 w-16 h-12 bg-red-500 rounded-l-full origin-right shadow-xs z-0"
            />

            {/* Superhero strong tooth */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-20 h-20 bg-white border-2 border-stone-800 rounded-b-xl rounded-t-2xl shadow-md flex flex-col justify-between items-center p-2 z-10"
            >
              <div className="absolute -top-3 text-lg">👑</div>
              
              {/* Determined tough eyes & smile */}
              <div className="flex flex-col items-center mt-3">
                <div className="flex gap-3 mb-1">
                  <div className="text-[8px] font-extrabold text-stone-800 relative">
                    👁️
                  </div>
                  <div className="text-[8px] font-extrabold text-stone-800 relative">
                    👁️
                  </div>
                </div>
                <div className="w-3 h-1.5 bg-neutral-950 rounded-b-xl" />
              </div>

              {/* Flex muscle badge overlay */}
              <div className="absolute -right-3 bottom-4 text-xs font-bold bg-green-500 text-white rounded-full p-0.5 border border-stone-800">
                💪
              </div>

              {/* Strong roots */}
              <div className="absolute -bottom-2 inset-x-2 flex justify-between">
                <div className="w-4 h-3 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
                <div className="w-4 h-3 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
              </div>
            </motion.div>

            {/* Glowing stars */}
            <motion.div 
              animate={{ scale: [1, 1.4, 0.9], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute right-3 top-4 text-amber-400"
            >
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
            </motion.div>
          </div>
        );

      case 'swimming':
        return (
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Waves backdrop */}
            <div className="absolute inset-0 flex flex-col justify-end pb-2 opacity-50">
              <motion.div 
                animate={{ x: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-8 bg-sky-200/50 border-t border-sky-300"
                style={{ borderRadius: '40% 40% 0 0' }}
              />
            </div>

            {/* Floater Ring */}
            <motion.div 
              animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-24 h-12 bg-red-400 border-3 border-stone-800 rounded-full bottom-8 flex items-center justify-center z-10"
            >
              {/* White stripes on floater ring */}
              <div className="absolute left-4 w-2 h-full bg-white border-x border-stone-800 skew-x-12" />
              <div className="absolute right-4 w-2 h-full bg-white border-x border-stone-800 -skew-x-12" />
            </motion.div>

            {/* Swimming Tooth with goggles inside the ring */}
            <motion.div 
              animate={{ y: [-4, -8, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-16 h-16 bg-white border-2 border-stone-800 rounded-t-xl rounded-b-md z-20 flex flex-col items-center justify-start p-1"
            >
              {/* Swim Goggles */}
              <div className="mt-1 w-12 h-4 bg-sky-300/80 border border-stone-800 rounded-full flex items-center justify-around overflow-hidden">
                <div className="w-3.5 h-3 bg-white rounded-full border border-stone-800" />
                <div className="w-3.5 h-3 bg-white rounded-full border border-stone-800" />
              </div>
              
              {/* Cute smiley mouth */}
              <div className="text-[10px] font-bold text-stone-800 mt-2 font-serif">v</div>
            </motion.div>

            {/* Waves water drop icons */}
            <motion.div 
              animate={{ scale: [0.6, 1.1, 0.6], y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute left-4 top-10"
            >
              <Waves className="w-4 h-4 text-sky-500" />
            </motion.div>
          </div>
        );

      case 'repair':
        return (
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Warning or sign exclamation mark */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-400 text-stone-900 border border-stone-800 text-[9px] font-mono font-bold flex items-center justify-center rounded-sm animate-bounce">
              !
            </div>

            {/* Broken / Healing Tooth */}
            <motion.div 
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-20 h-20 bg-white border-2 border-stone-800 rounded-b-xl rounded-t-2xl shadow-sm flex flex-col justify-between items-center p-2 z-10 overflow-hidden"
            >
              {/* Healing bandage diagonal across the forehead */}
              <div className="absolute top-2 -left-3 w-12 h-3 bg-[#ede8df] border-y border-stone-800 rotate-[35deg] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-xs" />
              </div>

              {/* Cute pleading face */}
              <div className="flex gap-3 justify-center mt-3.5 relative z-10">
                <div className="w-2.5 h-2.5 bg-stone-800 rounded-full flex items-center justify-center text-[5px] text-white font-bold p-0.5">🥺</div>
                <div className="w-2.5 h-2.5 bg-stone-800 rounded-full flex items-center justify-center text-[5px] text-white font-bold p-0.5">🥺</div>
              </div>

              <div className="w-3.5 h-1 border-t border-stone-800 animate-pulse mt-0.5" />

              {/* Tool (tiny wrench) held passively */}
              <div className="absolute right-1 bottom-1 text-xs text-stone-700 font-bold bg-[#ede8df] p-0.5 border border-stone-800 rounded">
                🛠️
              </div>

              {/* Roots */}
              <div className="absolute -bottom-2 inset-x-2 flex justify-between z-0">
                <div className="w-4 h-3 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
                <div className="w-4 h-3 bg-white border-b-2 border-x-2 border-stone-800 rounded-b-md" />
              </div>
            </motion.div>
          </div>
        );

      case 'whale':
        return (
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Whale Blow Water Spout upwards custom keyframe */}
            <motion.div 
              animate={{ y: [-10, -25, -10], opacity: [0.3, 1, 0.3], scale: [0.7, 1.2, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-2 w-7 h-7 bg-purple-200/50 rounded-full border border-purple-300 flex items-center justify-center z-0"
            >
              <span className="text-[12px]">🐳</span>
            </motion.div>

            {/* Cute Dolphin-Teeth explorer */}
            <motion.div 
              animate={{ x: [-3, 3, -3], rotate: [-1, 2, -1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-20 h-20 bg-purple-50 border-2 border-stone-800 rounded-b-xl rounded-t-2xl shadow-sm flex flex-col justify-between items-center p-2.5 z-10"
            >
              {/* Happy winking face */}
              <div className="flex gap-4 mt-3 w-full justify-center">
                <span className="text-[10.5px] font-bold text-stone-850">^</span>
                <span className="text-[10.5px] font-bold text-stone-850">✿</span>
              </div>
              <div className="text-[10.5px] font-bold text-stone-800 -mt-2">‿</div>

              {/* Tiny dolphin fins on the side */}
              <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3 bg-purple-300 border border-stone-800 rounded-l-full rotate-[15deg]" />
              <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3 bg-purple-300 border border-stone-800 rounded-r-full -rotate-[15deg]" />

              {/* Whale facts badge bottom */}
              <span className="text-[7px] font-bold text-purple-700 bg-purple-200/50 px-1 py-0.5 rounded font-mono truncate max-w-full">
                0 WHALE TEETH
              </span>

              {/* Roots */}
              <div className="absolute -bottom-2 inset-x-2 flex justify-between z-0">
                <div className="w-4 h-3 bg-purple-50 border-b-2 border-x-2 border-stone-800 rounded-b-md" />
                <div className="w-4 h-3 bg-purple-50 border-b-2 border-x-2 border-stone-800 rounded-b-md" />
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  const activeFact = FACTS_DATA[activeCardIdx];

  return (
    <section className="bg-[#fcfaf8] py-20 px-6 sm:px-8 border-t border-stone-205 py-24 relative overflow-hidden" id="funfacts">
      {/* Decorative floral orbs */}
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#b8975a]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-32 w-80 h-80 bg-[#0abab5]/4 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        
        {/* Header Block with luxury subtitle */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0abab5]/10 px-4 py-1.5 rounded-full text-[#0abab5] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#0abab5] animate-spin" />
            <span>Interactive Fun Lab 🧠</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-neutral-950 tracking-tight leading-none">
            Must-Know <span className="italic font-normal text-[#0abab5]">Teeth Facts</span>
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto mt-4 leading-relaxed font-sans">
            Delve into these quick, scientifically proven, surprising dental facts decorated with lovely interactive cartoon teeth. Simply tap each card to flip and discover clinical diagnostics!
          </p>

          {/* Settings / Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <div className="flex bg-stone-200/60 p-1.5 rounded-full">
              <button
                type="button"
                onClick={() => { setViewMode('deck'); triggerAudio('woosh'); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all select-none cursor-pointer outline-none ${
                  viewMode === 'deck' ? 'bg-[#0abab5] text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🎴 Fact Deck
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('explorer'); triggerAudio('bubble'); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all select-none cursor-pointer outline-none ${
                  viewMode === 'explorer' ? 'bg-[#0abab5] text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                🪟 Grid Explorer
              </button>
            </div>

            {/* Audio volume toggler */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-stone-250 hover:bg-stone-50 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Interaction Sounds' : 'Unmute Interaction Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-300" />}
            </button>
          </div>
        </div>

        {/* FACT DECKS VIEW MODE (3D Flip Animation Deck) */}
        {viewMode === 'deck' && (
          <div className="flex flex-col items-center">
            
            {/* Main Interactive Flip Card container */}
            <div className="relative w-full max-w-md h-[460px] cursor-pointer select-none perspective-1000 mb-8 max-w-sm sm:max-w-md">
              <div 
                className="absolute inset-0 transition-transform duration-500 transform-style-3d w-full h-full"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                onClick={toggleFlip}
              >
                
                {/* CARD FRONT: Interactive Illustration & Badge */}
                <div className="absolute inset-0 w-full h-full bg-white rounded-3xl border border-stone-200/80 p-8 flex flex-col justify-between items-center shadow-md backface-hidden">
                  
                  {/* Glowing halo behind active illustration depending on current context */}
                  <div className="absolute top-1/4 w-32 h-32 rounded-full opacity-[0.04] pointer-events-none" style={{ backgroundColor: activeFact.colorTheme, filter: 'blur(30px)' }} />

                  {/* Header parts */}
                  <div className="w-full text-center relative">
                    <span className="text-[9px] font-mono font-bold text-center inline-block px-3 py-1 rounded-full border border-stone-200 tracking-widest uppercase" style={{ color: activeFact.colorTheme, backgroundColor: `${activeFact.colorTheme}08` }}>
                      {activeFact.badge}
                    </span>
                    <h3 className="font-serif text-2xl font-black text-stone-900 mt-4 leading-tight">
                      {activeFact.title}
                    </h3>
                  </div>

                  {/* Active illustration area */}
                  <div className="my-3 flex items-center justify-center h-40">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFact.id}
                        initial={{ scale: 0.82, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.82, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="p-1"
                      >
                        {renderCuteToothIllustration(activeFact.illustrationType, activeFact.colorTheme)}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom teaser metadata */}
                  <div className="w-full text-center">
                    <p className="text-stone-500 text-xs sm:text-sm font-semibold max-w-xs mx-auto mb-5 font-sans italic">
                      " {activeFact.miniDesc} "
                    </p>

                    <div className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-stone-400 font-bold uppercase animate-pulse">
                      <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Tap Card to Reveal Fact</span>
                    </div>
                  </div>
                </div>

                {/* CARD BACK: Scientific Fact & Clinical Tip */}
                <div 
                  className="absolute inset-0 w-full h-full bg-stone-900 text-white rounded-3xl border border-stone-850 p-8 flex flex-col justify-between items-center shadow-xl backface-hidden"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  
                  {/* Sparkle action click trigger */}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerSparkle();
                    }}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-amber-300 transition-colors active:scale-95 z-20 outline-none"
                    title="Sprinkle Magic Sparkles"
                  >
                    <Sparkles className={`w-4 h-4 ${sparkleTrigger > 0 ? 'animate-bounce' : ''}`} />
                  </button>

                  <div className="w-full text-left relative">
                    <span className="text-[8px] font-mono font-bold px-2.5 py-0.5 rounded bg-white/10 border border-white/20 tracking-wider text-amber-400 uppercase">
                      🔬 SCIENTIFIC INSIGHT
                    </span>
                    
                    <h4 className="font-serif text-xl font-bold text-white mt-4 tracking-tight">
                      How {activeFact.title} Works:
                    </h4>

                    {/* Highlighted text paragraph body */}
                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mt-4 font-sans bg-white/5 p-4 rounded-xl border border-white/5 relative">
                      <span className="absolute top-2 right-3 text-2xl font-serif text-white/10 select-none">“</span>
                      {activeFact.fact}
                    </p>
                  </div>

                  {/* Clinical Guideline Section */}
                  <div className="w-full bg-[#b8975a]/10 border border-[#b8975a]/30 p-4 rounded-2xl">
                    <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-[#b8975a] flex items-center gap-1 mb-1">
                      👑 Assistant Clinical Tip:
                    </span>
                    <p className="text-[#ede8df] text-[11px] sm:text-xs leading-relaxed font-sans">
                      {activeFact.clinicalTip}
                    </p>
                  </div>

                  {/* Tap key help info */}
                  <div className="inline-flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-[#b8975a] font-bold uppercase mt-2">
                    <RefreshCw className="w-3 h-3" />
                    <span>TAP TO FLIP BACK FRONT</span>
                  </div>

                </div>

              </div>
            </div>

            {/* Carousel navigation controls */}
            <div className="flex items-center gap-5 justify-center">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-stone-250 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-700 hover:text-[#0abab5] transition-all shadow-2xs hover:scale-105 active:scale-95 outline-none"
                aria-label="Previous Fact"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-mono font-bold text-stone-500 tracking-widest uppercase">
                Fact {activeCardIdx + 1} / {FACTS_DATA.length}
              </span>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-stone-250 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-700 hover:text-[#0abab5] transition-all shadow-2xs hover:scale-105 active:scale-95 outline-none"
                aria-label="Next Fact"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

        {/* FACTS GRID EXPLORER VIEW MODE */}
        {viewMode === 'explorer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACTS_DATA.map((fact) => {
              return (
                <div 
                  key={fact.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Subtle hover splash color strip */}
                  <div className="absolute top-0 left-0 w-[4px] h-0 bg-stone-700 group-hover:h-full transition-all duration-300" style={{ backgroundColor: fact.colorTheme }} />

                  <div>
                    {/* Top part block */}
                    <div className="flex items-center justify-between gap-2.5 mb-4">
                      <span className="text-[8px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded" style={{ color: fact.colorTheme, backgroundColor: `${fact.colorTheme}08` }}>
                        {fact.badge}
                      </span>
                      <Trophy className="w-3.5 h-3.5 text-[#b8975a]" />
                    </div>

                    {/* Cute cartoon illustration small thumbnail layout */}
                    <div className="p-3 bg-stone-50 rounded-2xl flex items-center justify-center overflow-hidden mb-4 min-h-[144px]">
                      <div className="scale-90 transition-transform duration-300 group-hover:scale-95">
                        {renderCuteToothIllustration(fact.illustrationType, fact.colorTheme)}
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug tracking-tight mb-2">
                      {fact.title}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed mb-4 font-sans">
                      {fact.fact}
                    </p>
                  </div>

                  {/* Tip drawer footer */}
                  <div className="pt-3 border-t border-stone-100 bg-[#fbfaf8] -mx-6 -mb-6 p-5 rounded-b-3xl">
                    <div className="inline-flex items-center gap-1.5 text-[8px] font-mono font-bold tracking-widest text-[#0abab5] uppercase mb-1">
                      <CheckCircle className="w-3 h-3 text-[#0abab5]" />
                      <span>CLINICAL ADAPTATION:</span>
                    </div>
                    <p className="text-stone-500 text-[10.5px] leading-snug font-sans">
                      {fact.clinicalTip}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
