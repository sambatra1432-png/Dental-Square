import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle, 
  Smile, 
  Award, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  Flame, 
  Share2, 
  Check, 
  X,
  Stethoscope,
  Crown
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

// Custom clinical image imports matched with existing assets
// @ts-ignore
import wisdomTeethRealImage from '../assets/images/colgate_wisdom_display_1780159506681.png';
// @ts-ignore
import clinicalTreatmentRoom from '../assets/images/clinic_treatment_room_1780150082462.png';
// @ts-ignore
import doctorDeskDetails from '../assets/images/doctor_desk_details_1780159470802.png';

interface MythFactItem {
  id: string;
  myth: string;
  shortMythLabel: string;
  factTitle: string;
  factDetail: string;
  punchline: string;
  category: 'hygiene' | 'clinical' | 'implants';
  svgType: 'toothpaste' | 'wisdom' | 'dentures' | 'baby_teeth' | 'implants' | 'cavities' | 'root_canal' | 'silent' | 'partials' | 'gums' | 'whitening' | 'straightening';
  isActuallyFact: boolean; // Almost all are myths, but we can make the game exciting!
  imageUrl: string;
  imageImport?: any;
  factImageUrl?: string;
  factImageImport?: any;
}

// Web Audio API Synthesizer to output pristine sonic indicators for quiz correct/incorrect choices & interactive diagram triggers
const playDentalSound = (type: 'correct' | 'incorrect' | 'click' | 'shine' | 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    
    const now = ctx.currentTime;
    
    if (type === 'correct') {
      // Elegant crystal dual-tone sound
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        
        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(0.12, start + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.1);
      };
      
      playTone(523.25, now, 0.35); // C5
      playTone(659.25, now + 0.08, 0.45); // E5
      playTone(783.99, now + 0.16, 0.5); // G5
      
    } else if (type === 'incorrect') {
      // Soft gentle buzzer glide
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sawtooth';
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      
      osc.frequency.setValueAtTime(220.00, now); // A3
      osc.frequency.linearRampToValueAtTime(164.81, now + 0.3); // E3
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.35);
      
    } else if (type === 'click') {
      // Clean tick feedback
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.05);
      
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.06);
      
    } else if (type === 'shine') {
      // High glass chime
      const playTone = (freq: number, start: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gainNode.gain.setValueAtTime(vol, start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      };
      playTone(1100, now, 0.02);
      playTone(1400, now + 0.04, 0.025);
      playTone(1700, now + 0.08, 0.03);
    } else if (type === 'success') {
      // Grand celebratory chime
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(0.1, start + 0.025);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration + 0.1);
      };
      playTone(523.25, now, 0.25); // C5
      playTone(659.25, now + 0.08, 0.25); // E5
      playTone(783.99, now + 0.16, 0.25); // G5
      playTone(1046.50, now + 0.24, 0.5); // C6
    }
  } catch (e) {
    console.debug("Web Audio blocked by permissions context:", e);
  }
};



export default function MythsAndFacts() {
  const [activeView, setActiveView] = useState<'arcade' | 'explorer'>('arcade');
  
  // Game & Explorer states
  const [score, setScore] = useState<number>(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<boolean | null>(null);
  const [hasAnsweredCurrentQuiz, setHasAnsweredCurrentQuiz] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [bustedIds, setBustedIds] = useState<string[]>([]); // Tracks which explorer cards the user flipped

  // Deck selector
  const [selectedItemId, setSelectedItemId] = useState<string>('mf_01');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Custom Interactivity States for the 12 Vector Diagrams
  const [pasteSwirlAmount, setPasteSwirlAmount] = useState<'pea' | 'thick'>('thick');
  const [wisdomCondition, setWisdomCondition] = useState<'straight' | 'impacted'>('impacted');
  const [selectedTasteBud, setSelectedTasteBud] = useState<number | null>(null);
  const [babyTeethGuide, setBabyTeethGuide] = useState<'healthy' | 'lost'>('healthy');
  const [loadedImplantPart, setLoadedImplantPart] = useState<'crown' | 'abutment' | 'root' | null>(null);
  const [cavityFoodType, setCavityFoodType] = useState<'sugar' | 'starch'>('starch');
  const [rootAnesthetic, setRootAnesthetic] = useState<boolean>(false);
  const [silentGumScope, setSilentGumScope] = useState<boolean>(false);
  const [partialsSupportSnapped, setPartialsSupportSnapped] = useState<boolean>(false);
  const [activeFlossLevel, setActiveFlossLevel] = useState<number>(0); // 0 = dirty, 1 = flossed once, 2 = sparkling clean
  const [whiteningMethod, setWhiteningMethod] = useState<'scrub' | 'oxygen'>('oxygen');
  const [orthoAgeOrSymmetry, setOrthoAgeOrSymmetry] = useState<number>(50); // slider 0-100 representing crooked -> aligned progress

  // Default deep, evidence-based myths and facts refactored with humorous, easy-to-understand clinical prose!
  const data: MythFactItem[] = [
    {
      id: 'mf_01',
      myth: "Loading your brush with a thick continuous swirl of toothpaste gives you a deeper clean.",
      shortMythLabel: "More Paste = Better?",
      factTitle: "A tiny pea-sized dollop (5mm) is more than enough for adults!",
      factDetail: "Super-thick swirls exist ONLY in television commercials to sell more toothpaste. Using excessive paste creates massive foam which triggers an early spit reflex, causing you to brush for less than the required 2 minutes.",
      punchline: "📺 Commercial logic wants your tube empty. Medical logic wants your enamel safe!",
      category: 'hygiene',
      svgType: 'toothpaste',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1559599141-381d7c373266?auto=format&fit=crop&q=80&w=600&h=400", // Toothbrush close up
      factImageUrl: "https://images.unsplash.com/photo-1620013511676-e8d107a685cb?auto=format&fit=crop&q=80&w=600&h=400" // Mint and clean electric paste setup
    },
    {
      id: 'mf_02',
      myth: "All wisdom teeth are medical timebombs and must be extracted immediately.",
      shortMythLabel: "Wisdom Teeth Hazard?",
      factTitle: "If a wisdom tooth is straight, functional, and clean, leave it!",
      factDetail: "If your wisdom teeth erupt vertically with ideal alignment, have zero decay, do not trap plaque, and are thoroughly disease-free, they can be retained safely under professional checkups.",
      punchline: "🦷 Don't schedule surgery for a tooth that's acting like a model citizen!",
      category: 'clinical',
      svgType: 'wisdom',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600&h=400",
      imageImport: wisdomTeethRealImage,
      factImageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600&h=400", // Dentist checking structured teeth
      factImageImport: clinicalTreatmentRoom
    },
    {
      id: 'mf_03',
      myth: "Full dentures make everything taste like bland cardboard.",
      shortMythLabel: "Denture Taste Loss?",
      factTitle: "Tongue taste buds remain 100% active, restoring complete pleasure!",
      factDetail: "While dentures cover a portion of your upper palate (which holds a minor percentage of taste receptors), the vast majority of taste buds sit directly on your tongue. Modern snug-fitting dentures restore chewing efficiency, which actually enhances flavor!",
      punchline: "🍎 With restored bite stability, your favorite spices and crisp apples taste better than ever!",
      category: 'implants',
      svgType: 'dentures',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600&h=400", // Diagnostics model
      factImageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=600&h=400" // Happy elderly person eating fresh food
    },
    {
      id: 'mf_04',
      myth: "Kids' baby teeth don't need real brushing or fillings because they fall out anyway.",
      shortMythLabel: "Baby Teeth Neglect?",
      factTitle: "Baby teeth hold vital space and guide permanent adult smiles!",
      factDetail: "Neglecting primary teeth leads to early childhood cavities, painful abscesses, and speech blocks. If baby teeth are lost too early, adjacent teeth drift into their spaces, forming a crowded bumper-car bottleneck for adult teeth.",
      punchline: "👶 Treat baby teeth like the architectural foundation for a beautiful adult smile!",
      category: 'hygiene',
      svgType: 'baby_teeth',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600&h=400", // Sweet sugary candies
      factImageUrl: "https://images.unsplash.com/photo-1545063914-a1a6fc821c88?auto=format&fit=crop&q=80&w=600&h=400" // Happy cute kid showing sparkling teeth
    },
    {
      id: 'mf_05',
      myth: "Dental implants are obvious and look like bright metal pegs.",
      shortMythLabel: "Implants Look Fake?",
      factTitle: "Bio-compatible porcelain crowns copy natural tooth enamel flawlessly!",
      factDetail: "Implant technology connects a titanium root beneath your gum with a high-translucency ceramic crown. Dr. Prabhjot Kaur matches the custom crown shade precisely with your adjacent teeth under studio lighting.",
      punchline: "💎 True implants are so stealthy that even your closest friends won't spot them!",
      category: 'implants',
      svgType: 'implants',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600&h=400", // Metallic industrial threads/screws representation
      factImageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600&h=400",
      factImageImport: clinicalTreatmentRoom
    },
    {
      id: 'mf_06',
      myth: "Sweets are the absolute, and only, cause of tooth decay.",
      shortMythLabel: "Sugar is the Only Cavity Maker?",
      factTitle: "Cavities result from acid duration, not just sweet candies!",
      factDetail: "Starchy carbs (like potato chips, crackers, or dried fruits) stick inside teeth ridges far longer than simple table sugar. Acid produced by bacteria feeding on these sticky foods demineralizes enamel over hours. It's about how long food sticks, not just its sweetness.",
      punchline: "🥨 Sticky crackers and constant snacking are often stealthier villains than a single candy bar!",
      category: 'hygiene',
      svgType: 'cavities',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1581798459219-318e76aeec7b?auto=format&fit=crop&q=80&w=600&h=400", // mountain of sticky sweets
      factImageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527b0f76?auto=format&fit=crop&q=80&w=600&h=400" // prebiotic salty wheat crackers
    },
    {
      id: 'mf_07',
      myth: "Root canal treatment is akin to medieval torture and is extremely painful.",
      shortMythLabel: "Root Canal Pain?",
      factTitle: "Root canals actually terminate active pain with zero clinical discomfort!",
      factDetail: "Root canals have a scary reputation from decades ago. Today's high-efficiency local anesthesia blocks nerve pathways completely. The procedure cleanout feels identical to receiving a shallow filling, yet instantly relieves raw nerve pressure.",
      punchline: "🩺 A root canal doesn't create pain; it is the superhero that puts an end to it!",
      category: 'clinical',
      svgType: 'root_canal',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600&h=400", // Scary looking high speed clinical drills
      factImageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600&h=400", // Peaceful dental clinic
      factImageImport: clinicalTreatmentRoom
    },
    {
      id: 'mf_08',
      myth: "If my teeth do not hurt and I feel fine, my oral health is 100% flawless.",
      shortMythLabel: "No Pain = Clear Health?",
      factTitle: "Dangerous oral conditions progress silently with zero early alerts!",
      factDetail: "Cavities, bone tissue loss, and chronic gum disease destroy tissue without transmitting any pain. Once a tooth actually begins a throbbing ache, the decay has already reached down to the living nerve.",
      punchline: "🚨 Pain is a late-stage warning. Waiting for pain is like waiting for your car's engine to smoke before changing the oil!",
      category: 'clinical',
      svgType: 'silent',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=600&h=400", // Unconcerned person
      factImageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600&h=400", // High tech clinician checking scans
      factImageImport: doctorDeskDetails
    },
    {
      id: 'mf_09',
      myth: "Partial dentures weaken and slowly loosen your remaining natural teeth.",
      shortMythLabel: "Partials Damage Teeth?",
      factTitle: "Custom clinical partials protect teeth by sharing chewing pressure!",
      factDetail: "Well-constructed partial dentures take safe anchor support on multiple sturdy teeth while distributing the force of biting across the jawbone. This checks individual tooth overload, preventing remaining teeth from cracking.",
      punchline: "🏗️ Think of partials as structural trusses, bringing reliable balance back to your chewing columns!",
      category: 'implants',
      svgType: 'partials',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1534398079244-67c8bc137f15?auto=format&fit=crop&q=80&w=600&h=400", // Cracked structure mockup
      factImageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600&h=400" // Architectural trusses
    },
    {
      id: 'mf_10',
      myth: "Bleeding gums are typical during brushing, and you should stop cleaning to let them heal.",
      shortMythLabel: "Bleeding? Stop Brushing!",
      factTitle: "Bleeding is a red flag for plaque pileup. Clean more gently, never stop!",
      factDetail: "When gums bleed, it means bacteria are irritating the tissue (gingivitis). Avoiding the area allows plaque to ossify into concrete-like tartar, accelerating gum disease. You must brush gently with a soft brush and floss to relieve the inflammation.",
      punchline: "🩸 If your hands bled when washing them, you wouldn't stop washing hands! Be gentle, keep flushing plaque!",
      category: 'hygiene',
      svgType: 'gums',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1552046122-03184de85e08?auto=format&fit=crop&q=80&w=600&h=400", // messy sink toothbrush view
      factImageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600&h=400" // Dentist flossing model or gentle tools
    },
    {
      id: 'mf_11',
      myth: "Whitening toothpastes bleach deep yellow core tooth shades.",
      shortMythLabel: "Bleaching Pastes?",
      factTitle: "Whitening paste only clears external surface coffee & tea stains!",
      factDetail: "Over-the-counter whitening paste uses abrasive polishing sand to scrape away surface-level food staining. They contain zero oxygen bleach to dissolve internal yellow molecules. Overuse can actually wear down enamel, revealing yellow dentin beneath!",
      punchline: "✨ Surface scrub isn't core whitening. For true intrinsic brightness, professional oxygenating gel is needed.",
      category: 'hygiene',
      svgType: 'whitening',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600&h=400", // Coffee cup stains illustration
      factImageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600&h=400" // Professional studio white smile checkup
    },
    {
      id: 'mf_12',
      myth: "Orthodontics and teeth straightening can only be done in your teenage years.",
      shortMythLabel: "Teens Only Braces?",
      factTitle: "Orthodontic bone reshaping has absolute zero age barriers!",
      factDetail: "Healthy adult bone tissue reacts to pressure the same way adolescent bone tissue does. Clear invisible aligners or tooth-colored ceramic brackets allow adults over 60 to straight-align teeth discreetly with full clinical success.",
      punchline: "🌟 Your smile is a lifetime asset. 40% of alignment patients today are confident adults!",
      category: 'clinical',
      svgType: 'straightening',
      isActuallyFact: false,
      imageUrl: "https://images.unsplash.com/photo-1601921004897-b7d582836990?auto=format&fit=crop&q=80&w=600&h=400", // Traditional raw metallic wires
      factImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=400" // Beautiful confident smiling senior adult
    }
  ];

  const selectedItem = data.find(v => v.id === selectedItemId);

  // Helper for tracking progress
  const totalBustableCount = 12;

  // Handles marking an item as read/busted in the explorer
  const handleBustedCard = (id: string) => {
    if (!bustedIds.includes(id)) {
      setBustedIds(prev => {
        const next = [...prev, id];
        // Play success fanfare if all 12 busted!
        if (next.length === totalBustableCount) {
          playDentalSound('success');
        } else {
          playDentalSound('correct');
        }
        return next;
      });
    } else {
      playDentalSound('click');
    }
    setIsFlipped(!isFlipped);
  };

  // Handles scoring in the game mode
  const handleQuizAnswer = (predictedIsFact: boolean) => {
    if (hasAnsweredCurrentQuiz) return;
    
    const truthOfItem = data[currentQuizIndex].isActuallyFact;
    const answeredCorrectly = predictedIsFact === truthOfItem;
    
    setUserSelectedAnswer(predictedIsFact);
    setHasAnsweredCurrentQuiz(true);
    
    if (answeredCorrectly) {
      setScore(prev => prev + 1);
      playDentalSound('correct');
    } else {
      playDentalSound('incorrect');
    }
  };

  const nextQuizQuestion = () => {
    setHasAnsweredCurrentQuiz(false);
    setUserSelectedAnswer(null);
    if (currentQuizIndex < data.length - 1) {
      playDentalSound('click');
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      playDentalSound('success');
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    playDentalSound('click');
    setScore(0);
    setCurrentQuizIndex(0);
    setHasAnsweredCurrentQuiz(false);
    setUserSelectedAnswer(null);
    setQuizCompleted(false);
  };

  // Calculate badges
  const getBadgeRank = (s: number) => {
    if (s >= 11) return { title: "Dental Sovereign 👑", desc: "Dr. Prabhjot's Enamel Legend! You possess perfect evidence-based oral knowledge.", color: "text-amber-600 bg-amber-50 border-amber-200" };
    if (s >= 8) return { title: "Plaque Assassin 🛡️", desc: "Extremely skilled! You can smell commercial marketing lies a mile away.", color: "text-teal-600 bg-teal-50 border-teal-200" };
    if (s >= 5) return { title: "Smart Brusher 🦷", desc: "Good foundation! You know how to take care of teeth, but some myths caught you off-guard.", color: "text-blue-600 bg-indigo-50 border-indigo-200" };
    return { title: "Novice Flosser 🪥", desc: "A fresh start! We recommend exploring the Interactive Deck below to bust all 12 dental rumors.", color: "text-red-500 bg-red-50 border-red-100" };
  };

  const badgeObj = getBadgeRank(score);

  // SVG Renderers for the visual comparative infographics
  const renderInteractiveGraphic = (type: string) => {
    switch (type) {
      case 'toothpaste':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <line x1="200" y1="10" x2="200" y2="90" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
              <text x="100" y="20" textAnchor="middle" fill="#ef4444" className="font-sans text-[9px] font-bold uppercase tracking-wider">Myth: Ad Swirl</text>
              <path d="M40 70 H 160" stroke="#a8a29e" strokeWidth="3" strokeLinecap="round" />
              <path d="M40 67 C 40 67, 60 45, 80 45 C 110 45, 120 67, 160 67" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
              <path d="M40 62 C 45 30, 125 30, 135 45 C 145 55, 155 62, 160 62" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
              <text x="100" y="85" textAnchor="middle" fill="#ef4444" className="font-sans text-[8px] font-bold">Massive waste, early spitting</text>

              <text x="300" y="20" textAnchor="middle" fill="#0abab5" className="font-sans text-[9px] font-bold uppercase tracking-wider">Fact: Dr. Approved Pea</text>
              <path d="M240 70 H 360" stroke="#a8a29e" strokeWidth="3" strokeLinecap="round" />
              <path d="M240 67 C 240 67, 260 45, 280 45 C 310 45, 320 67, 360 67" stroke="#0abab5" strokeWidth="6" strokeLinecap="round" />
              {pasteSwirlAmount === 'pea' ? (
                <>
                  <circle cx="280" cy="58" r="4.5" fill="#10b981" stroke="#047857" strokeWidth="1" />
                  <path d="M292 48 L 294 52 L 298 54 L 294 56 L 292 60 L 290 56 L 286 54 L 290 52 Z" fill="#b8975a" />
                </>
              ) : (
                <path d="M265 65 C 265 65, 275 35, 285 35 C 295 35, 305 65, 305 65" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" fill="none" />
              )}
              <text x="300" y="85" textAnchor="middle" fill="#0abab5" className="font-sans text-[8px] font-bold">5mm target - efficient & safe</text>
            </svg>
            <div className="flex gap-1.5 text-[10px]">
              <button onClick={() => { setPasteSwirlAmount('pea'); playDentalSound('shine'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${pasteSwirlAmount === 'pea' ? 'bg-[#0abab5] text-white' : 'bg-white text-stone-600'}`}>Recommended Pea Size (5mm)</button>
              <button onClick={() => { setPasteSwirlAmount('thick'); playDentalSound('click'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${pasteSwirlAmount === 'thick' ? 'bg-red-500 text-white' : 'bg-white text-stone-600'}`}>Ad Swirl</button>
            </div>
          </div>
        );
      case 'wisdom':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="20" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Alignment: {wisdomCondition === 'straight' ? '✅ Straight Model Soldier' : '⚠️ Impacted Core'}
              </text>
              <path d="M50 75 H 350" stroke="#cbd5e1" strokeWidth="2" />
              {/* Healthy Standing Teeth representing adjacent molars */}
              <path d="M90 75 C90 55, 105 55, 105 75 Z" fill="#ffffff" stroke="#78716c" strokeWidth="1.5" />
              <path d="M140 75 C140 55, 155 55, 155 75 Z" fill="#ffffff" stroke="#78716c" strokeWidth="1.5" />
              <path d="M190 75 C190 55, 205 55, 205 75 Z" fill="#ffffff" stroke="#78716c" strokeWidth="1.5" />
              
              {wisdomCondition === 'straight' ? (
                <g>
                  <path d="M240 75 C240 55, 255 55, 255 75 Z" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
                  <text x="248" y="40" textAnchor="middle" fill="#059669" className="font-sans text-[8px] font-bold">HEALTHY ERUPTION</text>
                </g>
              ) : (
                <g>
                  <g transform="rotate(-35, 225, 75)">
                    <path d="M225 75 C225 55, 240 55, 240 75 Z" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                  </g>
                  <circle cx="210" cy="68" r="4" fill="#ef4444" className="animate-ping" />
                  <text x="248" y="40" textAnchor="middle" fill="#ef4444" className="font-sans text-[8px] font-bold">COLLIDING ROOT</text>
                </g>
              )}
            </svg>
            <div className="flex gap-1.5 text-[10px]">
              <button onClick={() => { setWisdomCondition('straight'); playDentalSound('shine'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${wisdomCondition === 'straight' ? 'bg-[#0abab5] text-white' : 'bg-white text-stone-600'}`}>Perfect Alignment (Retain)</button>
              <button onClick={() => { setWisdomCondition('impacted'); playDentalSound('click'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${wisdomCondition === 'impacted' ? 'bg-red-500 text-white' : 'bg-white text-stone-600'}`}>Impacted Angle (Extract)</button>
            </div>
          </div>
        );
      case 'dentures':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <line x1="200" y1="10" x2="200" y2="90" stroke="#e7e5e4" strokeWidth="1" strokeDasharray="3 3" />
              
              <text x="100" y="20" textAnchor="middle" fill="#ef4444" className="font-sans text-[9px] font-bold uppercase tracking-wider">Myth: Upper Palate Block</text>
              <rect x="50" y="35" width="100" height="30" rx="4" fill="#fca5a5" opacity="0.3" />
              <text x="100" y="52" textAnchor="middle" fill="#b91c1c" className="font-sans text-[8px] font-bold">UPPER COATED</text>
              
              <text x="300" y="20" textAnchor="middle" fill="#0abab5" className="font-sans text-[9px] font-bold uppercase tracking-wider">Fact: Uncovered Tongue</text>
              <path d="M260 75 Q 300 40 340 75" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" />
              {/* Interactive Taste Bud nodes */}
              {[{x:285, y:62, label:'Salt 🧂'}, {x:300, y:52, label:'Sugar 🍓'}, {x:315, y:62, label:'Acid 🍋'}].map((bud, idx) => (
                <circle 
                  key={idx} cx={bud.x} cy={bud.y} r={selectedTasteBud === idx ? 5 : 3.5} 
                  fill={selectedTasteBud === idx ? '#10b981' : '#dc2626'} stroke="#ffffff" strokeWidth="1" 
                  className="cursor-pointer hover:scale-125" onClick={() => { setSelectedTasteBud(idx); playDentalSound('shine'); }}
                />
              ))}
              {selectedTasteBud !== null ? (
                <text x="300" y="34" textAnchor="middle" fill="#047857" className="font-sans text-[7.5px] font-bold">Flavor receptor completely free!</text>
              ) : (
                <text x="300" y="34" textAnchor="middle" fill="#8c8581" className="font-sans text-[7px] italic">Click a taste bud dot to test flavor release!</text>
              )}
            </svg>
            {selectedTasteBud !== null && (
              <button onClick={() => { setSelectedTasteBud(null); playDentalSound('click'); }} className="text-[9px] text-[#0abab5] underline">Reset Flavor Test</button>
            )}
          </div>
        );
      case 'baby_teeth':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="20" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Space Foundation: {babyTeethGuide === 'healthy' ? '🏆 Healthy Guide' : '⚠️ Squeeze Bottleneck'}
              </text>
              <path d="M50 75 H 350" stroke="#cbd5e1" strokeWidth="2" />
              {babyTeethGuide === 'healthy' ? (
                <>
                  <circle cx="100" cy="75" r="10" fill="#ffffff" stroke="#0abab5" strokeWidth="1.5" />
                  <circle cx="140" cy="75" r="10" fill="#ffffff" stroke="#0abab5" strokeWidth="1.5" />
                  <circle cx="180" cy="75" r="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                  <circle cx="220" cy="75" r="10" fill="#ffffff" stroke="#0abab5" strokeWidth="1.5" />
                  <circle cx="260" cy="75" r="10" fill="#ffffff" stroke="#0abab5" strokeWidth="1.5" />
                  <path d="M180 75 V 90" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="200" y="45" fill="#047857" className="font-sans text-[8px] font-bold">Guiding path reserved</text>
                </>
              ) : (
                <>
                  <circle cx="100" cy="75" r="10" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                  <g transform="rotate(15, 135, 75)"><circle cx="135" cy="75" r="10" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" /></g>
                  <path d="M165 75 C165 65, 195 65, 195 75" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
                  <g transform="rotate(-15, 230, 75)"><circle cx="230" cy="75" r="10" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" /></g>
                  <text x="200" y="45" fill="#b91c1c" className="font-sans text-[8px] font-bold">Lost guide prompts teeth drift & crowding</text>
                </>
              )}
            </svg>
            <div className="flex gap-1.5 text-[10px]">
              <button onClick={() => { setBabyTeethGuide('healthy'); playDentalSound('shine'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${babyTeethGuide === 'healthy' ? 'bg-[#0abab5] text-white' : 'bg-white text-stone-600'}`}>Protect Baby Teeth</button>
              <button onClick={() => { setBabyTeethGuide('lost'); playDentalSound('click'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${babyTeethGuide === 'lost' ? 'bg-red-500 text-white' : 'bg-white text-stone-600'}`}>Early Tooth decay loss</button>
            </div>
          </div>
        );
      case 'implants':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <rect x="50" y="70" width="300" height="20" rx="3" fill="#f5f5f4" stroke="#d6d3d1" />
              <path d="M50 70 Q 200 68 350 70" stroke="#fca5a5" strokeWidth="3" /> {/* Gum */}
              
              {/* Titanium Screw */}
              <g onClick={() => { setLoadedImplantPart('root'); playDentalSound('click'); }} className="cursor-pointer hover:opacity-80">
                <path d="M194 70 L206 70 L203 92 L197 92 Z" fill={loadedImplantPart === 'root' ? '#0ea5e9' : '#cbd5e1'} stroke="#475569" strokeWidth="1" />
              </g>
              {/* Abutment */}
              <g onClick={() => { setLoadedImplantPart('abutment'); playDentalSound('click'); }} className="cursor-pointer hover:opacity-80">
                <rect x="193" y="58" width="14" height="12" fill={loadedImplantPart === 'abutment' ? '#3b82f6' : '#94a3b8'} stroke="#475569" strokeWidth="1" />
              </g>
              {/* Crown */}
              <g onClick={() => { setLoadedImplantPart('crown'); playDentalSound('shine'); }} className="cursor-pointer hover:opacity-80">
                <path d="M185 58 C 185 30, 215 30, 215 58 Z" fill={loadedImplantPart === 'crown' ? '#34d399' : '#fcfaf7'} stroke={loadedImplantPart === 'crown' ? '#047857' : '#0abab5'} strokeWidth="2" />
              </g>

              <g>
                {loadedImplantPart === 'crown' && <text x="300" y="45" textAnchor="middle" fill="#047857" className="font-sans text-[8px] font-bold">Crown: Fits adjecent enamel translucency</text>}
                {loadedImplantPart === 'abutment' && <text x="300" y="45" textAnchor="middle" fill="#2563eb" className="font-sans text-[8px] font-bold">Abutment: Structural mechanical Hex Lock</text>}
                {loadedImplantPart === 'root' && <text x="300" y="45" textAnchor="middle" fill="#0284c7" className="font-sans text-[8px] font-bold">Root: Biocompatible Titanium fusion on jaw</text>}
                {!loadedImplantPart && <text x="300" y="45" textAnchor="middle" fill="#a8a29e" className="font-sans text-[7.5px] italic">Click Crown, Abutment or Screw to inspect!</text>}
              </g>
            </svg>
          </div>
        );
      case 'cavities':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="16" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Erosion Time: {cavityFoodType === 'sugar' ? '🍬 Rapid simple sugar clear (20 mins)' : '🥨 Sticky starch warning (4 hrs)'}
              </text>
              <line x1="40" y1="65" x2="360" y2="65" stroke="#fca5a5" strokeWidth="1" strokeDasharray="3 3" />
              <text x="340" y="60" fill="#ef4444" className="font-sans text-[6.5px] font-bold uppercase">Acid threshold (pH 5.5)</text>

              {cavityFoodType === 'sugar' ? (
                <path d="M50 35 Q 120 90 160 35 T 350 35" stroke="#10b981" strokeWidth="2.5" fill="none" />
              ) : (
                <path d="M50 35 Q 120 85 240 85 T 350 35" stroke="#ef4444" strokeWidth="2.5" fill="none" />
              )}
            </svg>
            <div className="flex gap-1.5 text-[10px]">
              <button onClick={() => { setCavityFoodType('sugar'); playDentalSound('click'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${cavityFoodType === 'sugar' ? 'bg-[#0abab5] text-white' : 'bg-white text-stone-600'}`}>Simple Candy (Rapid)</button>
              <button onClick={() => { setCavityFoodType('starch'); playDentalSound('click'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${cavityFoodType === 'starch' ? 'bg-red-500 text-white' : 'bg-white text-stone-600'}`}>Sticky Crackers (Sustained Erosion)</button>
            </div>
          </div>
        );
      case 'root_canal':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="16" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Pulp state: {rootAnesthetic ? '💡 Silenced Nerve (Healed)' : '⚡ Inflamed Pulsing Nerve'}
              </text>
              <path d="M120 90 Q 150 40 150 30 Q 150 40 180 90 Z" fill="#ffffff" stroke="#0abab5" strokeWidth="1.5" />
              {rootAnesthetic ? (
                <>
                  <path d="M149 35 Q 150 55 145 88 M150 35 Q 150 55 155 88" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <text x="260" y="55" fill="#3b82f6" className="font-sans text-[8px] font-bold">Blue active blocks pain completely</text>
                </>
              ) : (
                <>
                  <path d="M149 35 Q 150 55 145 88 M150 35 Q 150 55 155 88" stroke="#ef4444" strokeWidth="2" fill="none" className="animate-pulse" />
                  <circle cx="150" cy="35" r="6" fill="#ef4444" opacity="0.4" className="animate-ping" />
                  <text x="260" y="55" fill="#ef4444" className="font-sans text-[8px] font-bold">Red pulsing inflamed nerve root</text>
                </>
              )}
            </svg>
            <button onClick={() => { setRootAnesthetic(!rootAnesthetic); playDentalSound(rootAnesthetic ? 'click' : 'shine'); }} className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${rootAnesthetic ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
              {rootAnesthetic ? '⚙️ Reset anatomy' : '💉 Deliver Clinical Anesthetic relief'}
            </button>
          </div>
        );
      case 'silent':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="16" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Clinic inspect: {silentGumScope ? '🔎 Deep scan revealed underlying bone decay!' : '👀 Superficial view looks perfect'}
              </text>
              <path d="M80 70 Q 110 35 110 25 Q 110 35 140 70 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <path d="M140 70 Q 170 35 170 25 Q 170 35 200 70 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <path d="M50 70 Q 200 68 350 70" stroke="#fca5a5" strokeWidth="6" fill="none" /> {/* Gumline pink */}
              {silentGumScope ? (
                <>
                  <circle cx="110" cy="78" r="4.5" fill="#f59e0b" opacity="0.8" />
                  <circle cx="170" cy="78" r="5.5" fill="#f59e0b" opacity="0.8" />
                  <line x1="60" y1="74" x2="340" y2="74" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="270" y="45" fill="#f59e0b" className="font-sans text-[7.5px] font-bold">Unseen pathogens eating bone!</text>
                </>
              ) : (
                <text x="270" y="45" fill="#0abab5" className="font-sans text-[7.5px]">Exterior looks pristine. No pain.</text>
              )}
            </svg>
            <button onClick={() => { setSilentGumScope(!silentGumScope); playDentalSound('click'); }} className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-stone-200">
              {silentGumScope ? 'Close scan' : '🔎 Sweep probe below gum line'}
            </button>
          </div>
        );
      case 'partials':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="16" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Support truss: {partialsSupportSnapped ? '🛠️ shared chewing load' : '⚠️ single anchor tooth breakdown'}
              </text>
              <path d="M40 75 H 360" stroke="#cbd5e1" strokeWidth="3" />
              <rect x="80" y="40" width="18" height="35" rx="2" fill="#ffffff" stroke="#78716c" strokeWidth="1.5" />
              {partialsSupportSnapped ? (
                <rect x="130" y="40" width="120" height="35" rx="3" fill="#d1fae5" stroke="#0abab5" strokeWidth="1.2" />
              ) : (
                <path d="M130 75 Q 190 50 250 75" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
              )}
              <rect x="300" y="40" width="18" height="35" rx="2" fill="#ffffff" stroke="#78716c" strokeWidth="1.5" />
              {partialsSupportSnapped ? (
                <>
                  <line x1="90" y1="40" x2="130" y2="40" stroke="#0abab5" strokeWidth="2" />
                  <line x1="250" y1="40" x2="300" y2="40" stroke="#0abab5" strokeWidth="2" />
                </>
              ) : (
                <path d="M90 15 V 35" stroke="#ef4444" strokeWidth="2.5" />
              )}
            </svg>
            <button onClick={() => { setPartialsSupportSnapped(!partialsSupportSnapped); playDentalSound('shine'); }} className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-stone-200">
              {partialsSupportSnapped ? 'Disconnect partition' : '🏗️ Snap-In Bridge truss system'}
            </button>
          </div>
        );
      case 'gums':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="16" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Gingiva: {activeFlossLevel === 2 ? '💖 Coral Pink & Sturdy' : activeFlossLevel === 1 ? '⚠️ Plaque Cleared' : '🩸 Inflamed & Bleeding'}
              </text>
              <rect x="50" y="65" width="300" height="20" fill="#fca5a5" />
              <path d="M50 65 Q 200 63 350 65" stroke={activeFlossLevel === 2 ? '#fca5a5' : '#ef4444'} strokeWidth="3" />
              <path d="M130 65 Q 145 30 145 25 Q 145 30 160 65 Z" fill="#ffffff" stroke="#0abab5" strokeWidth="1" />
              <path d="M160 65 Q 175 30 175 25 Q 175 30 190 65 Z" fill="#ffffff" stroke="#0abab5" strokeWidth="1" />
              {activeFlossLevel === 0 ? (
                <>
                  <rect x="150" y="52" width="8" height="8" fill="#eab308" rx="1.5" />
                  <circle cx="152" cy="74" r="2.5" fill="#be123c" />
                  <circle cx="155" cy="78" r="2" fill="#be123c" />
                </>
              ) : activeFlossLevel === 1 ? (
                <circle cx="152" cy="70" r="2" fill="#be123c" opacity="0.5" />
              ) : (
                <path d="M260 45 L 264 49 L 274 39" stroke="#10b981" strokeWidth="2" fill="none" />
              )}
            </svg>
            <button onClick={() => { setActiveFlossLevel(prev => Math.min(prev + 1, 2)); playDentalSound('shine'); }} className="px-2 py-0.5 rounded-full text-[10px] bg-[#0abab5] text-white">
              🪡 Slide Dental Floss Between joints (Step {activeFlossLevel}/2)
            </button>
          </div>
        );
      case 'whitening':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="16" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Whitening pathway: {whiteningMethod === 'oxygen' ? '💎 Safe Oxygen Gel' : '⚠️ Abrasive scrub paste'}
              </text>
              <rect x="80" y="38" width="240" height="30" fill="#fef08a" stroke="#e7e5e4" strokeWidth="1" /> {/* yellow dentin */}
              <rect x="80" y="38" width="240" height="8" fill="#ffffff" fillOpacity="0.4" stroke="#e7e5e4" strokeWidth="1" /> {/* outer enamel */}
              {whiteningMethod === 'oxygen' ? (
                <g>
                  <circle cx="120" cy="52" r="1.5" fill="#38bdf8" />
                  <circle cx="160" cy="45" r="2" fill="#38bdf8" />
                  <circle cx="200" cy="52" r="2" fill="#38bdf8" />
                  <text x="200" y="82" textAnchor="middle" fill="#047857" className="font-sans text-[7.5px] font-bold">Oxygen breaks yellow molecules inside safely</text>
                </g>
              ) : (
                <g>
                  <line x1="80" y1="38" x2="320" y2="38" stroke="#ef4444" strokeWidth="1" />
                  <text x="200" y="82" textAnchor="middle" fill="#b91c1c" className="font-sans text-[7.5px] font-bold">Scrubs core enamel without altering yellow dentin layers!</text>
                </g>
              )}
            </svg>
            <div className="flex gap-1.5 text-[10px]">
              <button onClick={() => { setWhiteningMethod('oxygen'); playDentalSound('shine'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${whiteningMethod === 'oxygen' ? 'bg-[#0abab5] text-white' : 'bg-white text-stone-600'}`}>Oxygenating Gel</button>
              <button onClick={() => { setWhiteningMethod('scrub'); playDentalSound('click'); }} className={`px-2 py-0.5 rounded-full font-semibold border ${whiteningMethod === 'scrub' ? 'bg-red-500 text-white' : 'bg-white text-stone-600'}`}>Scruber Paste</button>
            </div>
          </div>
        );
      case 'straightening':
        return (
          <div className="w-full flex flex-col items-center gap-2">
            <svg className="w-full h-24 sm:h-28" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="100" rx="12" fill="#faf8f5" stroke="#e7e5e4" strokeWidth="1" />
              <text x="200" y="16" textAnchor="middle" fill="#78716c" className="font-sans text-[9px] font-bold uppercase tracking-wider">
                Alignment layout: {orthoAgeOrSymmetry === 100 ? '✅ Flawless Symmetry' : '🔄 Transforming Bone remodel'}
              </text>
              {[80, 130, 180, 230, 280].map((baseX, idx) => {
                const rotation = idx % 2 === 0 ? (100 - orthoAgeOrSymmetry) * 0.12 : (orthoAgeOrSymmetry - 100) * 0.08;
                return (
                  <rect 
                    key={idx} x={baseX} y={35} width="18" height="28" rx="2" fill="#ffffff" stroke="#0abab5" strokeWidth="1.5" 
                    transform={`rotate(${rotation}, ${baseX}, 35)`} 
                  />
                );
              })}
              <text x="200" y="82" textAnchor="middle" fill="#0abab5" className="font-sans text-[7.5px] font-bold">Bone remodeling works at ANY age! (Slide to align)</text>
            </svg>
            <input 
              type="range" min="0" max="100" value={orthoAgeOrSymmetry} 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setOrthoAgeOrSymmetry(val);
                if (val === 100) { playDentalSound('shine'); } else if (val % 25 === 0) { playDentalSound('click'); }
              }}
              className="w-48 accent-[#0abab5] cursor-pointer"
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-4 h-24 bg-stone-50 rounded-xl border border-stone-150">
            <span className="text-xl mb-0.5 flex animate-bounce">✨</span>
            <span className="text-xs font-semibold text-[#0abab5]">Interactive Graphic Engaged</span>
            <span className="text-[9px] text-stone-400">Clinical Guide by Dr. Prabhjot Kaur (B.D.S)</span>
          </div>
        );
    }
  };

  return (
    <section className="bg-[#fcfaf7] border-y border-stone-200/60 py-24 px-6 md:px-8 overflow-hidden" id="myths-facts">
      <div className="max-w-7xl mx-auto">
        
        {/* Module Title Introduction */}
        <div className="text-center mb-12">
          <ScrollReveal variant="slide-up" delay={50}>
            <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center justify-center gap-3 mb-3">
              <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
              FAMILY-FRIENDLY CLINICAL INTELLIGENCE
              <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
            </span>
          </ScrollReveal>
          <ScrollReveal variant="slide-up" delay={120}>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] leading-tight mt-2">
              Oral Wellness: <span className="italic font-normal text-[#0abab5]">Bust the Myths!</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="slide-up" delay={180}>
            <p className="text-stone-500 text-xs sm:text-sm max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
              There is a mountain of false advice online. Protect your family's oral well-being with these interactive games & dynamic cards verified by Dr. Prabhjot Kaur (B.D.S).
            </p>
          </ScrollReveal>
        </div>

        {/* Dynamic Mode Controller Switch (Gamified Arcade vs Explorer Deck) */}
        <div className="max-w-md mx-auto flex p-1.5 bg-stone-100 rounded-full border border-stone-200 mb-12" id="myth-mode-switch">
          <button
            onClick={() => {
              setActiveView('arcade');
              restartQuiz();
            }}
            className={`flex-1 py-3 px-5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeView === 'arcade'
                ? 'bg-[#0abab5] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-transparent'
            }`}
          >
            <span className="text-base select-none">🕹️</span>
            Myth-Buster Arcade
          </button>
          
          <button
            onClick={() => setActiveView('explorer')}
            className={`flex-1 py-3 px-5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeView === 'explorer'
                ? 'bg-[#0abab5] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-transparent'
            }`}
          >
            <span className="text-base select-none">📖</span>
            Interactive Deck
          </button>
        </div>

        {/* MAIN DISPLAY FOR VIEW MODES */}
        <div>
          
          {/* VIEW MODE 1: THE GAMIFIED ARCADE CHAMPIONSHIP */}
          {activeView === 'arcade' && (
            <div className="max-w-3xl mx-auto">
              
              {!quizCompleted ? (
                <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-stone-100">
                    <div 
                      className="h-full bg-[#b8975a] transition-all duration-300"
                      style={{ width: `${((currentQuizIndex + 1) / data.length) * 100}%` }}
                    />
                  </div>

                  {/* Header info */}
                  <div className="flex justify-between items-center mb-6 pt-3">
                    <span className="text-[10px] font-mono tracking-wider font-bold text-[#b8975a] uppercase bg-stone-100 py-1.5 px-3 rounded-full flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Question {currentQuizIndex + 1} of {data.length}
                    </span>
                    <span className="text-xs font-bold text-stone-600">
                      Busted score: <span className="font-serif italic text-[#0abab5] text-base">{score}</span>
                    </span>
                  </div>



                  {/* Question box containing the candidate rumor */}
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 mb-8 text-center relative flex flex-col items-center">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 font-mono text-[9px] font-bold py-0.5 px-3 rounded-full uppercase tracking-wider border border-red-200 z-10">
                      Statement Claim
                    </span>
                    
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 leading-snug mt-3">
                      "{data[currentQuizIndex].myth}"
                    </h3>
                  </div>

                  {/* Action decision layout elements */}
                  {!hasAnsweredCurrentQuiz ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleQuizAnswer(false)}
                        className="py-4 px-6 rounded-xl border-2 border-red-200 bg-red-50/20 hover:bg-red-50 hover:border-red-400 text-red-700 font-serif font-bold text-sm sm:text-base cursor-pointer transition-all flex items-center justify-center gap-2 select-none"
                      >
                        <ThumbsDown className="w-5 h-5 shrink-0" />
                        ❌ That is a Silly Myth!
                      </button>

                      <button
                        onClick={() => handleQuizAnswer(true)}
                        className="py-4 px-6 rounded-xl border-2 border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50 hover:border-emerald-400 text-emerald-800 font-serif font-bold text-sm sm:text-base cursor-pointer transition-all flex items-center justify-center gap-2 select-none"
                      >
                        <ThumbsUp className="w-5 h-5 shrink-0" />
                        ✅ That of course is a Real Fact!
                      </button>
                    </div>
                  ) : (
                    // Feedback segment post user answer selection
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-2xl border ${
                        userSelectedAnswer === data[currentQuizIndex].isActuallyFact
                          ? 'bg-emerald-50 border-[#0abab5]/20'
                          : 'bg-red-50/80 border-red-200/50'
                      }`}
                    >
                      <div className="mb-4">
                        {/* Text detail */}
                        <div className="w-full flex-1 flex flex-col justify-center">
                          <div className="flex items-start gap-3 mb-2.5">
                            <div className={`p-1.5 rounded-lg shrink-0 ${
                              userSelectedAnswer === data[currentQuizIndex].isActuallyFact 
                                ? 'bg-[#0abab5] text-white' 
                                : 'bg-red-200 text-red-900'
                            }`}>
                              {userSelectedAnswer === data[currentQuizIndex].isActuallyFact ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : (
                                <X className="w-4 h-4 stroke-[3]" />
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-serif font-bold text-base text-stone-900 leading-tight">
                                {userSelectedAnswer === data[currentQuizIndex].isActuallyFact
                                  ? "Superb! You spotted the dental truth."
                                  : "Oops! You got snagged by the myth."}
                              </h4>
                              
                              <p className="text-[10px] font-mono uppercase tracking-wider text-[#b8975a] font-bold mt-1">
                                Clinical Explanation:
                              </p>
                            </div>
                          </div>

                          {/* Explicit Fact Detail */}
                          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed pl-1">
                            <strong>{data[currentQuizIndex].factTitle}</strong> {data[currentQuizIndex].factDetail}
                          </p>
                        </div>
                      </div>

                      {/* Interactive explanation sticker */}
                      <div className="bg-white/95 border border-stone-150 p-3 rounded-xl text-stone-600 text-[11px] font-sans flex items-center gap-2.5 mb-5 shadow-xs">
                        <span className="text-base shrink-0 select-none">💡</span>
                        <span>{data[currentQuizIndex].punchline}</span>
                      </div>

                      {/* Next button selector */}
                      <button
                        onClick={nextQuizQuestion}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#0abab5] hover:bg-[#07807d] text-white font-semibold text-xs rounded-lg shadow-sm font-sans flex items-center justify-center gap-2 cursor-pointer float-right"
                      >
                        {currentQuizIndex < data.length - 1 ? "Next Misconception" : "Reveal My Score"} 
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="clear-both"></div>

                    </motion.div>
                  )}

                  <div className="mt-8 pt-4 border-t border-stone-150 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#b8975a]" />
                    <p className="text-[10.5px] text-stone-400">
                      All clinical comparative statements have been hand-drafted by Dr. Prabhjot Kaur (B.D.S) to simplify dental care.
                    </p>
                  </div>

                </div>
              ) : (
                // GAME OVER: SHOW THE CERTIFICATE RANK
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center"
                >
                  <div className="w-20 h-20 bg-amber-50 rounded-full border border-amber-200 flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-10 h-10 text-amber-500" />
                  </div>

                  <span className="text-xs uppercase tracking-[3px] font-mono font-bold text-[#b8975a]">
                    ARCADE ACCOMPLISHED!
                  </span>

                  <h3 className="font-serif text-3xl font-bold text-stone-900 mt-2">
                    Your Myth-Busting Score: <span className="text-[#0abab5] italic">{score}</span> / {data.length}
                  </h3>

                  {/* The official looking badge plaque */}
                  <div className={`mt-6 p-6 rounded-2xl border ${badgeObj.color} max-w-md mx-auto`}>
                    <p className="text-[10px] font-mono tracking-widest font-bold uppercase text-stone-500 mb-1">
                      Awarded Rank
                    </p>
                    <h4 className="font-serif text-xl font-bold mb-2">
                      {badgeObj.title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {badgeObj.desc}
                    </p>
                  </div>

                  {/* Encouraging caption */}
                  <p className="text-stone-500 text-xs max-w-md mx-auto mt-6 leading-relaxed">
                    A well-informed patient wastes less money on false cosmetic trends and suffers far fewer cavities. Share this quiz with your family or try exploring our card deck!
                  </p>

                  {/* Action buttons footer */}
                  <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={restartQuiz}
                      className="py-2.5 px-5 bg-[#0abab5] hover:bg-[#088d89] text-white rounded-full text-xs font-semibold cursor-pointer shadow-sm transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Try Playing Again
                    </button>

                    <button
                      onClick={() => setActiveView('explorer')}
                      className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold cursor-pointer border border-stone-250 transition-all flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" /> Explore the 12-Card Deck
                    </button>
                  </div>

                </motion.div>
              )}

            </div>
          )}


          {/* VIEW MODE 2: INTERACTIVE 3D DECK EXPLORER */}
          {activeView === 'explorer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left sidebar directory layout (5 spans) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#b8975a] font-bold block">
                      Deck Progress
                    </span>
                    <span className="text-xs font-bold text-stone-500 font-mono">
                      {bustedIds.length} / {totalBustableCount} Busted
                    </span>
                  </div>

                  {/* Interactive clinical progress slider indicator */}
                  <div className="relative w-full h-2 bg-stone-100 rounded-full overflow-hidden mb-5">
                    <div 
                      className="h-full bg-linear-to-r from-emerald-400 to-[#0abab5] transition-all duration-300 rounded-full"
                      style={{ width: `${(bustedIds.length / totalBustableCount) * 100}%` }}
                    />
                  </div>

                  {bustedIds.length === 12 && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mb-4 text-center text-emerald-800 text-[11px] font-sans flex items-center justify-center gap-2 font-bold"
                    >
                      <Award className="w-4 h-4 text-[#b8975a]" />
                      Glorious! You have successfully busted all 12 dental rumors!
                    </motion.div>
                  )}

                  {/* Listing directory of dental topics */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {data.map((item, index) => {
                      const isSelected = selectedItemId === item.id;
                      const isRead = bustedIds.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setIsFlipped(false); // Reset flip on new item selection
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group overflow-hidden ${
                            isSelected 
                              ? 'border-[#0abab5] bg-[#0abab5]/5 shadow-xs' 
                              : 'border-stone-150 bg-stone-50/20 hover:bg-stone-50 hover:border-stone-250'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className={`p-1 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                              isSelected 
                                ? 'bg-[#0abab5] text-white' 
                                : isRead
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                              {item.id.replace('mf_', '')}
                            </span>
                            
                            <div>
                              <p className={`font-serif text-xs font-bold leading-tight ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                                "{item.shortMythLabel}"
                              </p>
                              <span className="text-[9px] font-mono text-stone-400">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isRead && <span className="text-xs select-none">✅</span>}
                            <ChevronRight className={`w-3.5 h-3.5 mt-0.5 transition-transform ${isSelected ? 'text-[#0abab5] translate-x-1' : 'text-stone-300'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dental Clinic assurance */}
                <div className="bg-[#0abab5] rounded-2xl p-6 text-white border border-[#088d89] shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-[#b8975a] shrink-0" />
                    <h4 className="font-serif font-bold text-base">Wait, are there any real facts?</h4>
                  </div>
                  <p className="text-[11.5px] text-stone-200 leading-relaxed font-sans">
                    Everything you see in this list starts as a deep misconception that has been packaged as a clinical statement. Click <strong>"🔨 Bust This Rumor!"</strong> to see what the actual medical science dictates.
                  </p>
                </div>
              </div>

              {/* Right: The main 3D flip card zone (7 spans) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                
                {/* 3D card layout framing */}
                <div className="perspective-1000 w-full min-h-[500px] flex flex-col">
                  
                  {/* Flip Container */}
                  <div className="relative w-full flex-1 flex flex-col">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedItemId + (isFlipped ? '-back' : '-front')}
                        initial={{ opacity: 0, rotateY: isFlipped ? -45 : 45 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: isFlipped ? 45 : -45 }}
                        transition={{ duration: 0.35 }}
                        className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between flex-1"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        
                        <div>
                          {/* Inner Header */}
                          <div className="flex justify-between items-center border-b border-stone-150 pb-4 mb-4">
                            <div>
                              <span className="text-xs font-serif italic text-stone-500">
                                CARD MODULE INSIGHT #{selectedItemId.replace('mf_','')}
                              </span>
                              <h3 className="font-serif text-lg font-bold text-stone-900 leading-none mt-1">
                                {isFlipped ? "🏥 Clinical Truth" : "🤥 Dental Rumor"}
                              </h3>
                            </div>

                            <span className="text-xs tracking-wider uppercase font-mono font-bold text-stone-400 bg-stone-100 py-1.5 px-3 rounded-full">
                              {selectedItem?.category}
                            </span>
                          </div>

                          {/* FRONT SIDE (MYTH VIEW) */}
                          {!isFlipped ? (
                            <div className="flex flex-col h-full justify-between">
                              <div>
                                <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl relative overflow-hidden mb-5">
                                  <div className="pointer-events-none absolute w-16 h-16 bg-red-100/40 rounded-full top-0 right-0 translate-x-1/3 -translate-y-1/3 blur-md" />
                                  <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 inline-block px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3">
                                    ❌ Widespread Gossip
                                  </span>
                                  <p className="font-serif text-base sm:text-lg font-bold text-red-950 leading-snug">
                                    "{selectedItem?.myth}"
                                  </p>
                                </div>
                                
                                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-sans mb-8 font-medium">
                                  This is a highly popular claim. Many people assume this is how dental clinics operate or how teeth maintain their health. Click below to reveal the actual medical fact.
                                </p>
                              </div>

                              {/* Big actionable button to Flip */}
                              <button
                                onClick={() => handleBustedCard(selectedItemId)}
                                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-serif font-bold text-base rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                              >
                                🔨 BUST THIS DENTAL RUMOR!
                              </button>
                            </div>
                          ) : (
                            // BACK SIDE (FACT VIEW)
                            <div>
                              {/* Full Width Clinical Diagram */}
                              <div className="p-4 bg-stone-50 border border-stone-200/50 rounded-2xl flex items-center justify-center h-48 sm:h-56 overflow-hidden mb-5">
                                {renderInteractiveGraphic(selectedItem?.svgType || '')}
                              </div>

                              <div className="bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl relative overflow-hidden mb-4">
                                <div className="pointer-events-none absolute w-16 h-16 bg-[#0abab5]/5 rounded-full top-0 right-0 translate-x-1/3 -translate-y-1/3 blur-md" />
                                <span className="text-[10px] font-mono font-bold text-[#0abab5] bg-emerald-100 inline-block px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                                  ✅ Verified Clinical Fact
                                </span>
                                <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-snug mb-2 flex items-start gap-1.5">
                                  <Sparkles className="w-5 h-5 text-[#b8975a] shrink-0 mt-0.5 animate-pulse" />
                                  {selectedItem?.factTitle}
                                </h4>
                                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                                  {selectedItem?.factDetail}
                                </p>
                              </div>

                              {/* Helpful comic punchline bubble */}
                              <div className="bg-amber-50/60 border border-amber-200/40 p-3.5 rounded-xl text-stone-600 text-[11px] font-sans flex items-start gap-2.5 mb-6">
                                <span className="text-base select-none mt-0.5 shrink-0">💡</span>
                                <span>{selectedItem?.punchline}</span>
                              </div>

                              {/* Switch back button */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setIsFlipped(false)}
                                  className="py-1.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border border-stone-200"
                                >
                                  ← See Rumor Again
                                </button>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* Sign footer */}
                        <div className="mt-6 pt-4 border-t border-stone-150 flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#b8975a] shrink-0" />
                          <p className="text-[10px] sm:text-[10.5px] text-stone-400 font-sans leading-none">
                            Dental medical content actively checked and verified under BDS principles.
                          </p>
                        </div>

                      </motion.div>
                    </AnimatePresence>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
