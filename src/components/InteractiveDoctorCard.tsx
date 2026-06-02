import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Award, Sparkles, Heart } from 'lucide-react';

export default function InteractiveDoctorCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showDirectQuote, setShowDirectQuote] = useState(false);
  const [verifiedSign, setVerifiedSign] = useState(false);

  // Fallback tap/touch effect for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const px = touch.clientX - rect.left;
    const py = touch.clientY - rect.top;
    setSpotlight({ x: px, y: py });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const px = touch.clientX - rect.left;
    const py = touch.clientY - rect.top;
    setSpotlight({ x: px, y: py });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    
    // Relative position inside the card (0 to width/height)
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setSpotlight({ x: px, y: py });

    // Center origin coordinates (-width/2 to width/2)
    const cx = px - rect.width / 2;
    const cy = py - rect.height / 2;

    // Direct proportional tilt angles
    const maxTilt = 10; // degrees
    const rx = -(cy / (rect.height / 2)) * maxTilt;
    const ry = (cx / (rect.width / 2)) * maxTilt;

    setTilt({ x: rx, y: ry });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Trigger a brief verified animation for clinical authority
  useEffect(() => {
    const timer = setTimeout(() => {
      setVerifiedSign(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative group/doctor-outer w-full isolate select-none perspective-1000">
      {/* Absolute high-contrast dynamic backdrop aura behind the entire column */}
      <div 
        className={`absolute -inset-4 rounded-[40px] opacity-0 blur-3xl pointer-events-none transition-all duration-700 bg-gradient-to-tr from-[#ede8df] via-[#b8975a]/12 to-[#0abab5]/20 ${
          isHovered ? 'scale-110 opacity-100 -rotate-2' : ''
        }`} 
      />

      {/* Main card wrapper */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        whileTap={{ scale: 0.98, rotateX: 3, rotateY: -3 }}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
          transition: isHovered 
            ? 'transform 0.08s ease-out, box-shadow 0.5s ease' 
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`bg-[#0abab5] text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-teal-500/10 cursor-pointer z-10 transition-all ${
          isHovered 
            ? 'shadow-[0_45px_80px_-15px_rgba(45,106,106,0.35)] border-white/20' 
            : 'shadow-[#0abab5]/15'
        }`}
        title="Hover or Tap to feel the 3D depth and reveal verified credentials!"
      >
        {/* Dynamic moving cursor specular reflection spotlight */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/doctor-outer:opacity-100 transition-opacity duration-300 z-10" 
          style={{
            background: `radial-gradient(circle 220px at ${spotlight.x}px ${spotlight.y}px, rgba(212, 176, 122, 0.22), transparent 85%)`
          }}
        />

        {/* Ambient subtle grids */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: `radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)`, 
            backgroundSize: '24px 24px' 
          }} 
        />

        {/* Huge decorative brand insignia badge */}
        <div className="absolute -top-16 -right-16 text-[180px] font-serif opacity-[0.035] select-none font-bold transition-transform duration-700 group-hover/doctor-outer:scale-110 group-hover/doctor-outer:rotate-12">
          ✦
        </div>

        {/* Live clinicial schedule heartbeat label */}
        <div className="flex items-center justify-between mb-6 relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-950/40 border border-[#b8975a]/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#d4b07a] select-none">
              In-Clinic &amp; Booking Active
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#d4b07a]">
            <Heart className={`w-3.5 h-3.5 transition-all duration-300 ${isHovered ? 'scale-125 stroke-[2.5px] fill-[#d4b07a]' : 'opacity-80'}`} />
          </div>
        </div>

        {/* Doctor bio headers */}
        <div className="relative z-20 transition-transform duration-500 group-hover/doctor-outer:translate-x-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-3xl md:text-4xl font-extrabold tracking-wide mb-1 text-white select-none">
              Dr. Prabhjot Kaur
            </h3>
            {verifiedSign && (
              <span 
                className="text-[9px] font-mono tracking-widest text-[#d4b07a] border border-[#d4b07a]/40 rounded px-1.5 py-0.5 bg-yellow-950/20 font-bold select-none animate-bounce"
                title="Google My Business & BDS Licensed Amritsar"
              >
                ✔ LICENSED
              </span>
            )}
          </div>

          <p className="text-xs uppercase tracking-[4px] text-[#d4b07a] mb-8 font-bold font-mono">
            BDS · Dental Surgeon
          </p>
        </div>

        {/* Clinical details */}
        <ul className="space-y-4.5 relative z-20">
          {[
            { text: "Your trusted partner in", bold: "lifelong oral health", rest: "" },
            { text: "Over", bold: "20+ years of clinical experience", rest: "in painless dental treatments" },
            { text: "Dedicated to delivering outstanding oral healthcare using", bold: "modern techniques and patient first approach", rest: "" }
          ].map((item, idx) => (
            <li 
              key={idx} 
              style={{
                transitionDelay: `${idx * 40}ms`
              }}
              className="flex gap-3.5 text-[13px] md:text-sm text-stone-100 leading-relaxed transition-all duration-300 group-hover/doctor-outer:translate-x-2"
            >
              <CheckCircle2 className="w-5 h-5 text-[#d4b07a] shrink-0 mt-0.5 transition-transform group-hover/doctor-outer:scale-110 group-hover/doctor-outer:text-white" />
              <span>
                {item.text} <strong className="font-bold text-white tracking-wide">{item.bold}</strong>{item.rest ? ` ${item.rest}` : ""}
              </span>
            </li>
          ))}
        </ul>

        {/* Interactive interactive prompt banner on bottom */}
        <div className="mt-8 pt-6 border-t border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-20">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowDirectQuote(!showDirectQuote);
            }}
            className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#d4b07a] hover:text-white transition-colors cursor-pointer select-none bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full"
          >
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>{showDirectQuote ? "Hide Clinician Motto" : "Show Direct Motto 💬"}</span>
          </motion.button>

          <span className="text-[9px] font-mono text-stone-300/80 uppercase tracking-widest hidden md:inline">
            ✦ Precision Oral Architecture
          </span>
        </div>

        {showDirectQuote && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-950/30 border border-[#b8975a]/10 text-stone-200 text-xs italic font-serif leading-relaxed animate-fade-in relative z-20 shrink-0">
            "My primary clinical philosophy has always been centered around patient comfort first. Dentistry is a beautiful blend of art, material science, and true human empathy."
            <span className="block text-[9px] font-mono font-bold tracking-widest text-[#d4b07a] uppercase mt-2.5 not-italic">— Dr. Prabhjot Kaur</span>
          </div>
        )}
      </motion.div>

      {/* Parallax Floating gold badge that reacts against tilt coordinates */}
      <div 
        style={{
          transform: `translate3d(${-tilt.y * 1.5}px, ${-tilt.x * 1.5}px, 40px) scale(${isHovered ? 1.08 : 1})`,
          transition: isHovered 
            ? 'transform 0.1s ease-out' 
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#b8975a] text-white rounded-full flex flex-col items-center justify-center shadow-lg shadow-[#b8975a]/30 z-20 pointer-events-none select-none text-center px-2 animate-fade-in"
      >
        <Award className="w-4 h-4 text-white mb-1 grid place-items-center" />
        <span className="font-serif text-[10px] font-black leading-tight uppercase block">Over 2 Decades</span>
        <span className="text-[7px] uppercase tracking-widest mt-1 opacity-90 font-bold">Of Clinical Practice</span>
      </div>
    </div>
  );
}
