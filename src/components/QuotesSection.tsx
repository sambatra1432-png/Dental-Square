import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Quote, ChevronLeft, ChevronRight, Heart, Smile } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface DentalQuote {
  text: string;
  author: string;
  role: string | null;
  accent: string;
}

const QUOTES: DentalQuote[] = [
  {
    text: "The art of clinical dentistry is the preservation of nature’s most subtle and beautiful sculpture—your smile.",
    author: "Dr. Prabhjot Kaur",
    role: "Lead Surgeon at Dental Square",
    accent: "Preservation & Precision"
  },
  {
    text: "A dentist gets to the root of every problem.",
    author: "Classic Dental Saying",
    role: "Endodontic Wisdom",
    accent: "Getting to the Root"
  },
  {
    text: "Every tooth in a person’s head is more valuable than a diamond, representing both vital health and timeless confidence.",
    author: "Miguel de Cervantes",
    role: "Don Quixote",
    accent: "Timeless Value"
  },
  {
    text: "Ignore your teeth and they will go away.",
    author: "Witty Preventive Proverb",
    role: "Actionable Reminder",
    accent: "Daily Habit Loop"
  },
  {
    text: "A genuine, warm smile is the universal language of kindness, breaking boundaries before a single word is spoken.",
    author: "William Arthur Ward",
    role: "Philosopher & Author",
    accent: "Universal Connection"
  },
  {
    text: "You don't have to brush all your teeth, just the ones you want to keep.",
    author: "Humorous Dental Maxim",
    role: "The Ultimate Golden Rule",
    accent: "Essential Choices"
  },
  {
    text: "Let your smile change the world with its warmth and confidence, but never let the world dim your unique sparkle.",
    author: "Inspirational Proverb",
    role: "Clinical Desk Wisdom",
    accent: "Confidence & Resilience"
  },
  {
    text: "Meticulous oral healthcare with conservative procedures is where clinical science meets premium artistic craftsmanship.",
    author: "Dental Square Philosophy",
    role: "Quality Mandate",
    accent: "Artistic Craftsmanship"
  }
];

export default function QuotesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
  };

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Check if drag was mostly horizontal and exceeded threshold of 50px
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swiped left, show next quote
          handleNext();
        } else {
          // Swiped right, show previous quote
          handlePrev();
        }
      }
    }
    
    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <section className="bg-neutral-950 text-white py-24 px-6 md:px-8 border-t border-stone-900 relative overflow-hidden" id="clinic-quotes">
      {/* Decorative ambient blurred radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0abab5]/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Subtle micro pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(ellipse at center, #ffffff 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header decoration */}
        <div className="text-center mb-16">
          <ScrollReveal variant="slide-up" delay={50}>
            <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center justify-center gap-3 mb-3">
              <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
              Words We Live By
              <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
            </span>
          </ScrollReveal>
          <ScrollReveal variant="slide-up" delay={165}>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Inspirational <em className="not-italic text-[#0abab5]">Oral Aesthetics</em> & Dental Quotes
            </h2>
          </ScrollReveal>
        </div>

        {/* Carousel Box */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="bg-neutral-900/45 border border-stone-800/80 rounded-3xl p-8 md:p-14 backdrop-blur-md relative shadow-2xl cursor-grab active:cursor-grabbing select-none"
        >
          
          {/* Giant decorative cute smile */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10 text-[#0abab5]/20 pointer-events-none animate-pulse">
            <Smile className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
          </div>

          <div className="min-h-[220px] md:min-h-[160px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Accent Tag */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0abab5]/15 text-[#b8975a] border border-[#b8975a]/10 text-[10px] font-mono tracking-widest uppercase font-semibold">
                  <Sparkles className="w-3 h-3 text-[#b8975a]" />
                  {QUOTES[activeIndex].accent}
                </span>

                {/* Main Quote Text */}
                <blockquote className="font-serif text-lg md:text-2xl lg:text-3xl font-medium leading-relaxed md:leading-snug text-stone-100 select-none">
                  “{QUOTES[activeIndex].text}”
                </blockquote>

                {/* Quote Author Details */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-[#b8975a]" />
                  <div>
                    <cite className="not-italic font-bold text-[#b8975a] text-sm md:text-base font-sans tracking-wide block">
                      {QUOTES[activeIndex].author}
                    </cite>
                    {QUOTES[activeIndex].role && (
                      <span className="text-xs text-stone-400 font-medium block">
                        {QUOTES[activeIndex].role}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive controls and dots */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-800/60">
            
            {/* Dots */}
            <div className="flex gap-2">
              {QUOTES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAutoplay(false);
                    setActiveIndex(idx);
                  }}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                    idx === activeIndex ? 'w-6 bg-[#b8975a]' : 'w-2 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Go to quote ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-stone-850 hover:border-stone-700 bg-neutral-900 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Previous Quote"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-stone-850 hover:border-stone-700 bg-neutral-900 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Next Quote"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

        {/* Small motivational note footer with heartbeat heart animation */}
        <div className="text-center mt-12 flex items-center justify-center gap-1.5 text-stone-500 text-[10px] font-mono tracking-widest uppercase">
          <span>We take care of your teeth with</span>
          <motion.span
            animate={{ scale: [1, 1.22, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          >
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </motion.span>
          <span>and professional pride at Dental Square</span>
        </div>

      </div>
    </section>
  );
}
