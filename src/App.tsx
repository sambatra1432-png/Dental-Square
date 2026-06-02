import React, { useState, useEffect, useRef } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ClinicDetails } from './types';
import ReviewsSection from './components/ReviewsSection';
import MapSection from './components/MapSection';
import AppointmentForm from './components/AppointmentForm';
import InteractiveHeroBackground from './components/InteractiveHeroBackground';
import ScrollReveal from './components/ScrollReveal';
import ThreeDTooth from './components/ThreeDTooth';
import InteractiveDoctorCard from './components/InteractiveDoctorCard';
import TeethCleanGame from './components/TeethCleanGame';
import QuotesSection from './components/QuotesSection';
import MythsAndFacts from './components/MythsAndFacts';
import InteractiveTreatmentDemo from './components/InteractiveTreatmentDemo';
import TeethFacts from './components/TeethFacts';
import TreatmentMicroAnimation from './components/TreatmentMicroAnimation';
import ClinicPhotoGallery from './components/ClinicPhotoGallery';
import DiagnosticPlanner from './components/DiagnosticPlanner';
// @ts-ignore
import doctorProfilePortrait from './assets/images/IMG_3034.JPG (2).jpeg';

const defaultHeroImage = 'https://drive.google.com/thumbnail?id=1UmPIIo68SWm9RudhyYnxAPMEvNOlyfry&sz=w1600';
import { 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Phone, 
  Menu, 
  X, 
  Award, 
  CheckCircle2, 
  Key,
  FlameKindling,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  User,
  Camera,
  MessageSquare,
  Bot
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

const CATEGORY_META = {
  all: {
    badge: '🌿 Complete Clinical Roster',
    desc: 'Explore the full spectrum of dental classifications managed by Dr. Prabhjot Kaur inside our ultra-sanitized Amritsar practice.'
  },
  maintain: {
    badge: '🧹 Preserve Oral Hygiene & Health',
    desc: 'Preventive procedures, deep ultrasonic cleanings, paediatric safety and composite sealants to maintain pristine long-term gum health.'
  },
  protect: {
    badge: '🔬 Reinforce Strong Foundations',
    desc: 'Advanced clinical rescue protocols. Includes painless endodontic root canal treatments, prosthodontic reconstructions, crowns, and root replacements.'
  },
  enhance: {
    badge: '✨ Polish Smiles & Alignment',
    desc: 'Art meets medical science. High-aesthetic clinical bleaching, advanced smile-whitening treatments, and comfortable invisible clear aligners.'
  }
};

export default function App() {
  const doctorSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: doctorSectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth scroll custom parallax scaling & translate transforms
  const doctorY = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const doctorScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.15]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [clinicDetails, setClinicDetails] = useState<ClinicDetails | null>(null);
  const [heroImg, setHeroImg] = useState<string>(defaultHeroImage);
  const [activeCategory, setActiveCategory] = useState<'all' | 'maintain' | 'protect' | 'enhance'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');
  const [selectedTreatmentForDemo, setSelectedTreatmentForDemo] = useState<string | null>(null);
  
  const [plannerService, setPlannerService] = useState('');
  const [plannerMessage, setPlannerMessage] = useState('');

  // Load custom real picture from localStorage if uploaded by user
  useEffect(() => {
    const customImg = localStorage.getItem('realClinicHeroImage');
    if (customImg) {
      setHeroImg(customImg);
    }
  }, []);

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('realClinicHeroImage', base64String);
        setHeroImg(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetHeroImage = () => {
    localStorage.removeItem('realClinicHeroImage');
    setHeroImg(defaultHeroImage);
  };



  // Handle scroll progress and header glassmorphic states
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      }
      
      // Dynamic header styling trigger
      setIsScrolled(window.scrollY > 40);

      // Default home/top behavior
      if (window.scrollY < 180) {
        setActiveHash('#home');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active scroll spy sections
  useEffect(() => {
    const sections = ['home', 'about', 'services', 'photos', 'process', 'testimonials', 'advisor', 'contact'];
    
    const observers = sections.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHash(`#${id}`);
            }
          });
        },
        {
          rootMargin: '-25% 0px -65% 0px', // Triggers nicely when entering main viewport view area
        }
      );
      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs?.observer && obs?.element) {
          obs.observer.unobserve(obs.element);
        }
      });
    };
  }, []);

  const handleDetailsFetched = (details: ClinicDetails) => {
    setClinicDetails(details);
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] font-sans text-stone-900 selection:bg-[#0abab5]/20 selection:text-[#0abab5]">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-[#b8975a] z-[10002] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ${
        isScrolled 
          ? 'h-16 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm' 
          : 'h-20 bg-white/95 backdrop-blur-xs border-b border-stone-200/50'
      }`}>
        <div className="max-w-7xl mx-auto h-full px-6 md:px-8 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-neutral-950 leading-none">
                Dental<span className="text-[#0abab5]">Square</span>
              </span>
              <span className="text-[7.5px] font-mono tracking-[4.5px] uppercase text-[#b8975a] font-bold mt-1 shadow-xs">New Amritsar</span>
            </div>
          </a>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <a 
              href="tel:+919888568886" 
              className="inline-flex items-center gap-1.5 bg-[#fcfaf7] hover:bg-white border border-[#ede8df] text-[#111111] hover:text-[#0abab5] hover:border-[#0abab5]/30 px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-mono font-bold tracking-wide transition-all shadow-2xs hover:scale-[1.03] active:scale-95 duration-250"
            >
              <Phone className="w-3 h-3 text-[#0abab5]" />
              <span className="whitespace-nowrap">9888568886</span>
            </a>

            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="inline-flex items-center justify-center bg-neutral-950 hover:bg-[#0abab5] text-white p-2.5 rounded-lg transition-all shadow-md hover:scale-105 active:scale-95 duration-300"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* AnimatePresence for smooth Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Drawer Overlay Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs z-[9998]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Modern Slide-out Menu Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220, mass: 1 }}
              className="fixed top-0 right-0 bottom-0 w-[50%] min-w-[250px] max-w-[50%] bg-[#faf8f4] border-l border-stone-200 z-[9999] shadow-2xl flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
            >
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 leading-none">
                      Dental<span className="text-[#0abab5]">Square</span>
                    </span>
                    <span className="text-[7.5px] font-mono tracking-[4.5px] uppercase text-[#b8975a] font-bold mt-2.5 leading-none shadow-xs">Menu & features</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-stone-500 hover:text-[#0abab5] p-2 hover:bg-stone-200/40 rounded-full transition-colors active:scale-90"
                    aria-label="Close menu drawer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="h-px bg-stone-200/80 w-full" />

                {/* Nav Links List */}
                <motion.div 
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.05
                      }
                    }
                  }}
                  className="flex flex-col gap-3.5"
                >
                  <span className="text-[9px] font-bold tracking-widest text-[#b8975a] uppercase font-mono mb-0.5">Clinical Sections</span>
                  
                  <motion.a 
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    href="#about" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200/45 hover:border-[#0abab5]/20 hover:shadow-xs transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0abab5]/10 group-hover:text-[#0abab5]">
                        <User className="w-5 h-5 text-[#b8975a]" />
                      </span>
                      <span className="font-serif text-base font-bold text-stone-800 group-hover:text-[#0abab5] transition-colors">Meet Dr. Prabhjot Kaur</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#0abab5] group-hover:translate-x-1 transition-all" />
                  </motion.a>
                  
                  <motion.a 
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    href="#services" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200/45 hover:border-[#0abab5]/20 hover:shadow-xs transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0abab5]/10 group-hover:text-[#0abab5]">
                        <ShieldCheck className="w-5 h-5" />
                      </span>
                      <span className="font-serif text-base font-bold text-stone-800 group-hover:text-[#0abab5] transition-colors">Treatments & Services</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#0abab5] group-hover:translate-x-1 transition-all" />
                  </motion.a>

                  <motion.a 
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    href="#photos" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200/45 hover:border-[#0abab5]/20 hover:shadow-xs transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0abab5]/10 group-hover:text-[#0abab5]">
                        <Camera className="w-5 h-5" />
                      </span>
                      <span className="font-serif text-base font-bold text-stone-800 group-hover:text-[#0abab5] transition-colors">Explore Our Clinic</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#0abab5] group-hover:translate-x-1 transition-all" />
                  </motion.a>

                  <motion.a 
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    href="#process" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200/45 hover:border-[#0abab5]/20 hover:shadow-xs transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0abab5]/10 group-hover:text-[#0abab5]">
                        <Clock className="w-5 h-5" />
                      </span>
                      <span className="font-serif text-base font-bold text-stone-800 group-hover:text-[#0abab5] transition-colors">Patient Workflow</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#0abab5] group-hover:translate-x-1 transition-all" />
                  </motion.a>

                  <motion.a 
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    href="#testimonials" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200/45 hover:border-[#0abab5]/20 hover:shadow-xs transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#0abab5]/10 group-hover:text-[#0abab5]">
                        <MessageSquare className="w-5 h-5" />
                      </span>
                      <span className="font-serif text-base font-bold text-stone-800 group-hover:text-[#0abab5] transition-colors">Patient Reviews</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#0abab5] group-hover:translate-x-1 transition-all" />
                  </motion.a>

                  <motion.a 
                    variants={{
                      hidden: { opacity: 0, x: 25 },
                      show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                    }}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    href="#advisor" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="group flex items-center justify-between p-3 rounded-2xl bg-[#0abab5]/5 hover:bg-[#0abab5]/10 border border-[#0abab5]/20 hover:border-[#0abab5]/35 hover:shadow-xs transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#0abab5]/10 text-[#0abab5] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0abab5]/20 transition-all duration-300">
                        <Bot className="w-5 h-5" />
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="font-serif text-base font-bold text-[#0abab5]">AI Dental Advisor</span>
                        <span className="text-[7.5px] bg-[#0abab5] text-white px-1.5 py-0.5 rounded font-mono font-bold uppercase animate-pulse">Live</span>
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#0abab5] group-hover:translate-x-1 transition-all" />
                  </motion.a>
                </motion.div>
              </div>

              {/* Quick Contact & Quick Actions */}
              <div className="flex flex-col gap-4 mt-8 sm:mt-12">
                <div className="h-px bg-stone-200/80 w-full mb-2" />
                
                <motion.a 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="w-full py-3.5 text-center bg-[#0abab5] hover:bg-[#07807d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#0abab5]/15"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment
                </motion.a>
                
                <motion.a 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href="tel:+919888568886" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="w-full py-3.5 text-center bg-[#b8975a] hover:bg-[#967944] text-[#ffffff] rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#b8975a]/15"
                >
                  <Phone className="w-4 h-4" /> Call: +91 98885 68886
                </motion.a>
                
                <div className="text-center mt-2">
                  <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest leading-none">Booth no. 4-5, Main Market, New Amritsar</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-20" id="home"></div>

      {/* Hero Section */}
      <header className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] overflow-hidden">
        <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:px-20 bg-gradient-to-tr from-[#faf8f4] via-[#f8f5ed] to-[#fbfaf6] relative overflow-hidden">
          {/* Interactive physics particles backdrop */}
          <InteractiveHeroBackground />

          {/* Decorative premium glowing orbs to remove flat white spaces */}
          <div className="absolute top-1/4 -right-16 w-80 h-80 bg-[#d4b07a]/8 rounded-full filter blur-[100px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-[#0abab5]/6 rounded-full filter blur-[120px] pointer-events-none" />
          
          {/* Subtle dotted and grid wallpaper textures */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#0abab5 1.2px, transparent 1.2px)`, backgroundSize: '20px 20px' }} />
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.01] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #0abab5 1px, transparent 1px), linear-gradient(to bottom, #0abab5 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />
          
          <ScrollReveal variant="slide-right" duration={1000} className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#b8975a]/10 border border-[#b8975a]/30 text-[#b8975a] text-[9px] font-mono font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-xs animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#b8975a]" />
              <span>✦ 20+ Years Clinical Heritage ✦</span>
            </div>
            
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[3px] uppercase text-[#0abab5] mb-6 block">
              <span className="w-8 h-[2px] bg-[#0abab5]"></span>
              Dental Square — New Amritsar
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-950 leading-[1.1] mb-6">
              Your Smile<br />Deserves <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#0abab5] via-[#b8975a] to-[#0abab5] bg-[length:200%_auto] hover:bg-right transition-all duration-1000">Expert</span><br />Care.
            </h1>
            <p className="text-[#555555] text-sm sm:text-base leading-relaxed max-w-lg mb-10">
              Led by <strong className="text-[#0abab5] border-b-2 border-[#b8975a]/20 pb-0.5 font-bold">Dr. Prabhjot Kaur</strong>, Dental Square delivers compassionate, completely sterilized, painless clinical oral treatments designed with the highest standards of safety.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a 
                href="#contact" 
                className="bg-[#0abab5] hover:bg-[#07807d] text-white px-8 py-4.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all shadow-lg shadow-[#0abab5]/20 hover:-translate-y-0.5 hover-shine-effect"
              >
                Schedule Consultation
              </a>

              <a 
                href="#services" 
                className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-800 hover:text-[#0abab5] px-4 py-3.5 transition-all font-semibold"
              >
                Our Treatments <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#b8975a]" />
              </a>
            </div>

            {/* Premium Scroll-Reactive Indicator */}
            <div className={`mt-14 hidden sm:block transition-all duration-750 ${isScrolled ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
              <a href="#about" className="inline-flex items-center gap-3 text-[10px] font-bold tracking-[3px] uppercase text-[#b8975a] hover:text-[#0abab5] transition-colors">
                <span className="flex items-center justify-center w-6 h-9 border-2 border-[#b8975a]/30 rounded-full relative shrink-0">
                  <span className="w-1 h-2 bg-[#0abab5] rounded-full absolute top-1.5 animate-[bounce_1.5s_infinite]" />
                </span>
                <span>Discover Dental Square</span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        <div className="relative overflow-hidden bg-[#0d2121] flex flex-col justify-center items-center py-20 px-8 text-white min-h-[350px] group/hero">
          {/* Real clinic photo background shown in glorious full color, perfectly clear and bright! */}
          <img 
            src={heroImg} 
            alt="Dental Square Clinic store front in New Amritsar" 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-90 scale-[1.02] filter brightness-[1.02] saturate-[1.03] transition-all duration-1000 group-hover/hero:scale-105"
          />
          {/* Gentle, cinematic gradient to naturally blend the real photo and keep elements highly readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/40 to-transparent z-0 pointer-events-none" />

          {/* Premium Luxury Inset Frame */}
          <div className="absolute inset-4 border border-white/10 rounded-2xl pointer-events-none z-10 transition-all duration-500 group-hover/hero:inset-5 group-hover/hero:border-[#b8975a]/30" />
          <div className="absolute inset-5 border border-dashed border-white/5 rounded-2xl pointer-events-none z-10 select-none" />

          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `radial-gradient(ellipse at center, #ffffff 1px, transparent 1px)`, backgroundSize: '28px 28px' }}></div>

          {/* Elegant Luxury Caption Card */}
          <ScrollReveal variant="scale-up" duration={1000} delay={200} className="relative z-10 select-none max-w-sm w-full mx-auto px-4">
            <div className="bg-neutral-950/45 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group/quote hover:bg-neutral-950/55 hover:border-[#b8975a]/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer">
              {/* Subtle top light bar */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#0abab5]/80 to-transparent" />
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-[#b8975a] transition-transform duration-500 group-hover/quote:scale-110">
                  <ThreeDTooth />
                </div>
                <p className="font-serif text-base md:text-lg italic font-medium tracking-wide text-stone-200 group-hover/quote:text-[#dfca9c] transition-colors duration-300 leading-relaxed drop-shadow-sm">
                  "Behind every confident smile is a great dentist"
                </p>
                <div className="mt-4 flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0abab5] animate-pulse" />
                  <span className="text-[9px] uppercase tracking-wider text-stone-300 font-mono font-medium">Dental Square Amritsar</span>
                </div>
              </div>
            </div>
          </ScrollReveal>



          {/* Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/70 backdrop-blur-md border-t border-white/10 grid grid-cols-3 divide-x divide-white/5 relative z-20">
            <div className="py-6 text-center group/stat hover:bg-white/5 transition-all duration-300 cursor-pointer">
              <div className="font-serif text-xl md:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#dfca9c] via-[#b8975a] to-[#dfca9c] leading-tight select-none">2+ Decades</div>
              <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-stone-300 font-mono font-medium mt-1 select-none">Clinical Practice</div>
            </div>
            <div className="py-6 text-center group/stat hover:bg-white/5 transition-all duration-300 cursor-pointer">
              <div className="font-serif text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#dfca9c] via-[#b8975a] to-[#dfca9c] leading-tight select-none">5K+</div>
              <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-stone-300 font-mono font-medium mt-1 select-none">Satisfied Patients</div>
            </div>
            <div className="py-6 text-center group/stat hover:bg-white/5 transition-all duration-300 cursor-pointer">
              <div className="font-serif text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#dfca9c] via-[#b8975a] to-[#dfca9c] leading-tight select-none">100%</div>
              <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-stone-300 font-mono font-medium mt-1 select-none">Sterilized Safety</div>
            </div>
          </div>
        </div>
      </header>

      {/* Infinite Specialty Marquee */}
      <div className="bg-neutral-950/95 py-6 overflow-hidden border-y border-stone-800 relative z-20 shadow-lg">
        <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-30 z-0"></div>
        <div className="whitespace-nowrap flex animate-[scroll_35s_linear_infinite] marquee-mask relative z-10 hover:[animation-play-state:paused] cursor-pointer">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-14 text-white/85 text-[10px] font-mono tracking-[4px] uppercase select-none font-semibold">
              <span className="flex items-center gap-2">🦷 Root Canal Specialists</span>
              <span className="text-[#b8975a] text-sm font-bold">✦</span>
              <span className="flex items-center gap-2">✨ Laser Teeth Whitening</span>
              <span className="text-[#b8975a] text-sm font-bold">✦</span>
              <span className="flex items-center gap-2">🔬 Permanent Bio-Implants</span>
              <span className="text-[#b8975a] text-sm font-bold">✦</span>
              <span className="flex items-center gap-2">🛡️ 100% Autoclave Sterilized</span>
              <span className="text-[#b8975a] text-sm font-bold">✦</span>
              <span className="flex items-center gap-2">😁 Clear Aligners & Ortho</span>
              <span className="text-[#b8975a] text-sm font-bold">✦</span>
              <span className="flex items-center gap-2">🧒 Painless Pediatric Care</span>
              <span className="text-[#b8975a] text-sm font-bold">✦</span>
              <span className="flex items-center gap-2">📸 Advanced 3D Digital Scan</span>
              <span className="text-[#b8975a] text-sm font-bold">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* About The Doctor */}
      <section ref={doctorSectionRef} className="py-24 px-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center overflow-hidden" id="about">
        <ScrollReveal variant="slide-right" duration={1000} className="relative md:col-span-5 lg:col-span-4">
          <InteractiveDoctorCard />
        </ScrollReveal>

        {/* Real Profile Portrait container next to her card */}
        <ScrollReveal variant="slide-up" duration={1000} className="md:col-span-3 lg:col-span-3">
          <div className="relative group rounded-3xl overflow-hidden aspect-[3/4.2] border border-stone-200 bg-stone-100 shadow-xl hover:shadow-2xl transition-all duration-500">
            <motion.img 
              src="https://drive.google.com/thumbnail?id=1-PuEJ7YmmwoetH45HgDN8vufUziRVQ0t&sz=w1200" 
              alt="Dr. Prabhjot Kaur (BDS)" 
              referrerPolicy="no-referrer"
              style={{ y: doctorY, scale: doctorScale }}
              className="w-full h-full object-cover origin-center"
            />
            
            {/* Elegant overlay details card */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white pt-12">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#d4b07a] uppercase mb-0.5 block">
                Official Portrait
              </span>
              <h4 className="text-sm font-bold tracking-wide text-white font-serif">
                Dr. Prabhjot Kaur
              </h4>
              <p className="text-[10px] text-stone-300 font-sans mt-0.5">
                Dental Surgeon
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-col justify-center md:col-span-4 lg:col-span-5">
          <ScrollReveal variant="slide-left" delay={50}>
            <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center gap-3 mb-3">
              <span className="w-6 h-[1.5px] bg-[#b8975a]"></span> About the Surgeon
            </span>
          </ScrollReveal>
          <ScrollReveal variant="slide-left" delay={155}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-950 mb-6">
              In pursuit of <br /><span className="italic font-normal text-[#0abab5]">Oral Perfection</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="text-reveal" delay={260}>
            <div className="space-y-4 text-stone-600 text-sm md:text-base leading-relaxed">
              <p>
                Dr. Prabhjot Kaur is widely regarded as one of the most reliable and trusted general dentists in Amritsar, bringing over two decades of clinical practice directly to New Amritsar.
              </p>
              <p>
                At <span className="inline-flex items-center gap-1.5 bg-[#0abab5]/10 px-2.5 py-0.5 rounded-md border border-[#0abab5]/25 text-[#0abab5] font-bold hover:bg-[#0abab5]/20 transition-all duration-300 select-none shadow-sm cursor-help hover:scale-105">Dental Square</span>, her mission centres on delivering comprehensive dental care with precision, compassion, and a commitment to excellence for the entire family.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="bg-neutral-950 text-white py-24" id="services">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <ScrollReveal variant="slide-up" delay={50}>
                <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center gap-3 mb-3">
                  <span className="w-6 h-[1.5px] bg-[#b8975a]"></span> Our Expertise
                </span>
              </ScrollReveal>
              <ScrollReveal variant="slide-up" delay={160}>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-none">
                  Comprehensive <em className="not-italic text-[#0abab5]">Dental</em> Services
                </h2>
              </ScrollReveal>
            </div>
          </div>

          {/* Interactive Categories Filter Panel - Maintain, Protect, Enhance */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-10 bg-neutral-900/60 p-2 border border-stone-800 rounded-2xl max-w-3xl mx-auto shadow-inner relative z-10">
            {[
              { id: 'all', title: 'Show All', icon: null },
              { id: 'maintain', title: 'Maintain', icon: CheckCircle2 },
              { id: 'protect', title: 'Protect', icon: ShieldCheck },
              { id: 'enhance', title: 'Enhance', icon: Sparkles }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 relative cursor-pointer outline-none select-none transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryIndicator"
                      className="absolute inset-0 bg-[#0abab5] rounded-xl shadow-lg shadow-[#0abab5]/20 z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center justify-center gap-2 font-mono tracking-widest transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-stone-400 hover:text-stone-200'
                  }`}>
                    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                    <span>{cat.title}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Active Category Meta Explanation */}
          <div className="text-center mb-12 max-w-2xl mx-auto px-4 overflow-hidden min-h-[96px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <p className="text-[#b8975a] text-xs font-semibold tracking-[3px] uppercase mb-1.5 font-sans">
                  {CATEGORY_META[activeCategory].badge}
                </p>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-sans">
                  {CATEGORY_META[activeCategory].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-stone-850 rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl shadow-black/35 transition-all duration-300">
            <AnimatePresence mode="popLayout">
              {[
                { icon: '🧹', name: 'Professional Cleaning', category: 'maintain', label: 'Maintain', text: 'Deep cleaning using high-speed advanced ultrasonic equipment to break calculus and maintain impeccable periodontal health.', highlight: 'Biannual Standard' },
                { icon: '🧒', name: 'Pediatric (kids) Dentistry', category: 'maintain', label: 'Maintain', text: 'Gentle, friendly, anxiety-free therapeutic and preventive procedures customized especially for child patients.', highlight: 'Kids Anxiety-Free' },
                { icon: '🪥', name: 'Micro-Fillings', category: 'maintain', label: 'Maintain', text: 'Biocompatible composite dental fillings blending flawlessly into real tooth structures with pristine adhesion.', highlight: 'Mercury-Free' },
                { icon: '📸', name: 'Digital Teeth Scanning', category: 'maintain', label: 'Maintain', text: 'Ultra-advanced 3D intraoral digital mapping of your teeth structure instantly. Radiation-free, comfortable, and eliminates the need for messy traditional clay impressions.', highlight: '3D Intraoral Scan' },
                
                { icon: '🔬', name: 'Root Canal Treatment', category: 'protect', label: 'Protect', text: 'Highly sophisticated, fully-sterilized painless RCTs using specialized endodontic tech to salvage and restore natural teeth structure.', highlight: 'Painless Rotary' },
                { icon: '👑', name: 'Crowns & Bridges', category: 'protect', label: 'Protect', text: 'Custom-designed metal-free monolithic zirconia restorations matching real tooth translucency, fit, and chewing strength.', highlight: 'Digital CAD/CAM' },
                { icon: '🫦', name: 'Gum Surgery', category: 'protect', label: 'Protect', text: 'Surgical periodontal interventions restoring bone foundations and correcting gingival structures to halt gum recession.', highlight: 'Laser-Assisted' },
                { icon: '🦷', name: 'Dental Implants', category: 'protect', label: 'Protect', text: 'Premium, bio-compatible implant replacements mimicking natural root frameworks. Guaranteed strength and longevity.', highlight: 'Bone-Integrated' },
                
                { icon: '✨', name: 'Teeth Whitening', category: 'enhance', label: 'Enhance', text: 'Gentle, rapid clinical bleaching and laser-activated aesthetic whitening solutions to give you a natural, radiant dental shade.', highlight: 'Laser Whitening' },
                { icon: '😁', name: 'Braces & Orthodontics', category: 'enhance', label: 'Enhance', text: 'Advanced alignment treatments including functional metal/ceramic brackets and state-of-the-art transparent clear aligners.', highlight: 'Invisible Aligners' },
              ]
              .filter(srv => activeCategory === 'all' || srv.category === activeCategory)
              .map((srv, index) => (
                <motion.div 
                  key={srv.name}
                  layout
                  initial={{ opacity: 0, scale: 0.93, y: 35 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  exit={{ opacity: 0, scale: 0.93, y: -35 }}
                  whileHover={{ 
                    scale: 1.025, 
                    y: -5,
                    zIndex: 20,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 28,
                    delay: (index % 3) * 0.07, // Graceful column-based stagger to animate on scroll
                    layout: { type: 'spring', stiffness: 350, damping: 30 }
                  }}
                  className="h-full border border-stone-850/40 md:border border-stone-850/40 bg-neutral-900 flex rounded-xl overflow-hidden"
                >
                  <div className="p-9 hover:bg-stone-900/40 transition-all duration-300 relative group h-full flex flex-col justify-between overflow-hidden hover-shine-effect w-full">
                    {/* Luxury dynamic hover accent bar */}
                    <div className="absolute top-0 left-0 w-[4px] h-0 bg-gradient-to-b from-[#b8975a] to-[#0abab5] group-hover:h-full transition-all duration-500 ease-out" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 inline-block">{srv.icon}</div>
                        <div className="px-2.5 py-1 rounded text-[8px] uppercase tracking-widest font-mono font-bold bg-[#111111] text-[#b8975a] border border-stone-800">
                          {srv.label}
                        </div>
                      </div>
                      
                      <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#d4b07a] transition-colors">{srv.name}</h3>
                      
                      <TreatmentMicroAnimation treatmentName={srv.name} />

                      <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-4 font-sans">{srv.text}</p>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTreatmentForDemo(srv.name);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950/80 hover:bg-[#0abab5] border border-stone-800 hover:border-emerald-700/50 text-[#b8975a] hover:text-white rounded-lg text-[9px] font-mono font-bold tracking-widest uppercase transition-all mb-5 cursor-pointer outline-none hover:scale-102 active:scale-98"
                      >
                        Try Animation & Sim 🪄
                      </button>
                    </div>

                    <div className="pt-4 border-t border-stone-850/80 flex items-center justify-between text-[9px] font-mono font-semibold tracking-wider text-stone-500 group-hover:text-[#b8975a] transition-colors mt-auto">
                      <span>Clinical Standard</span>
                      <span className="text-white px-2 py-0.5 rounded bg-stone-950/60 border border-stone-800 text-[8px]">{srv.highlight}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Interactive Cute Dental Minigame */}
      <TeethCleanGame />

      {/* Interactive Cute Dental Surprising Facts Deck */}
      <TeethFacts />

      {/* Dentistry Myths vs Facts Block */}
      <MythsAndFacts />

      {/* Real Clinic Photos Gallery */}
      <ClinicPhotoGallery />

      {/* Inspirational Dental Quotes Display */}
      <QuotesSection />

      {/* Work Process / Steps Panel */}
      <section className="bg-[#ede8df] py-24 px-6 md:px-8 overflow-hidden" id="process">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollReveal variant="slide-up" delay={50}>
              <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center justify-center gap-3 mb-3">
                <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
                Patient Journey
                <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
              </span>
            </ScrollReveal>
            <ScrollReveal variant="slide-up" delay={160}>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#111111] mt-3">
                Simple, <span className="italic font-normal text-[#0abab5]">Anxiety-Free</span> Visits
              </h2>
            </ScrollReveal>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { num: '01', title: 'Schedule Slot', desc: 'Secure an appointment online via our consultation request form or directly over a phone call.' },
              { num: '02', title: 'Consultation', desc: 'Dr. Prabhjot Kaur initiates a comprehensive visual and digital check-up of your dental health.' },
              { num: '03', title: 'Customized Plan', desc: 'Get a clear, transparent dental action draft tailored precisely to your clinical state and comfort.' },
              { num: '04', title: 'Treatment & Smile', desc: 'Relish high-precision, painless clinical treatment and walk out with restored safety & confidence.' },
            ].map((step, idx) => (
              <ScrollReveal 
                key={idx} 
                variant="fade-up" 
                delay={idx * 150} 
                duration={800}
                className="w-full flex"
              >
                <div className="bg-white/60 hover:bg-white p-8 rounded-2xl border border-stone-200/40 hover:border-stone-300/60 shadow-xs transition-all flex flex-col items-center text-center group w-full">
                  <div className="w-14 h-14 rounded-full border border-[#b8975a] flex items-center justify-center text-lg font-serif font-bold text-[#b8975a] mb-6 group-hover:bg-[#b8975a] group-hover:text-white transition-colors">
                    {step.num}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Frequently Asked Questions */}
      <section className="bg-[#fcfaf7] py-24 px-6 md:px-8 border-t border-stone-200" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <ScrollReveal variant="slide-up" delay={50}>
              <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center justify-center gap-3 mb-3">
                <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
                Patient Information
                <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
              </span>
            </ScrollReveal>
            <ScrollReveal variant="slide-up" delay={160}>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#111111] mt-3">
                Frequently Asked <span className="italic font-normal text-[#0abab5]">Questions</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="text-reveal" delay={270}>
              <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto mt-4 leading-relaxed">
                Have doubts about dental schedules, treatment timelines, or options? Explore clear answers straight from Dr. Kaur's clinical desk.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How long does a root canal treatment (RCT) take?",
                a: "A typical Root Canal Treatment usually takes between 30 to 90 minutes and can often be completed in a single session. However, depending on the severity of the infection, complexity of the canal, or restoration needs, it can require two short appointments to ensure flawless sterilization and absolute root safety."
              },
              {
                q: "Is the clinic open on public holidays?",
                a: "Our physical clinic is generally closed on major public Indian holidays to allow our medical staff a healthy rest. However, for active patients experiencing sudden severe dental emergencies, we actively support direct WhatsApp diagnostic triage and telemedicine consultation."
              },
              {
                q: "Is the root canal procedure painful?",
                a: "Not at all. With modern local anesthetics and advanced technical rotary endodontics, patient discomfort is minimized. Root canals feel no different than receiving standard composite dental fillings. Dr. Prabhjot Kaur is committed to advanced, highly-sanitized, pain-free treatments."
              },
              {
                q: "What types of braces/aligner orthodontic treatments are available?",
                a: "We offer standard metal braces, cosmetic ceramic brackets, and state-of-the-art transparent clear aligners (invisible braces). Invisible aligners are highly popular due to their custom-fit, comfortable hygiene routine, and completely transparent look."
              },
              {
                q: "How often should I get scaling and polishing treatment?",
                a: "We recommended a professional scaling and deep ultrasonic polishing treatment every 6 months. This preventive cleaning removes calcified plaque build-up, freshens breath, and safeguards the soft gum tissue from periodontal disease."
              },
              {
                q: "How should I care for my gums and teeth after an extraction or surgery?",
                a: "For the first 24 hours, avoid rinsing vigorously, spitting, drinking through a straw, or smoking to keep the healing blood clot intact. Eat soft, cool or lukewarm foods, take your prescribed anti-inflammatories on schedule, and gently hold a cold compress against the cheek to suppress swelling. Resume gentle brushing active next day."
              },
              {
                q: "Are children's baby teeth worth treating if they fall out anyway?",
                a: "Yes, absolutely. Baby teeth hold critical spacing guide paths for permanent adult teeth, assist children in comfortable nutrition/chewing, and are vital for language and clear speech development. Untreated dental cavities in primary teeth can trigger intense infections, early loss, and direct structural damage to permanent teeth under development."
              },
              {
                q: "What should I do immediately during a sudden dental trauma or emergency?",
                a: "If a natural permanent tooth is knocked out, handle it strictly by the top crown (never hold the roots). Gently rinse under clean water without scrubbing, reinsert it into the socket if possible, or carry it in a glass of cold milk / sterile saline. Contact our clinic immediately on WhatsApp; treatment within 60 minutes offers the highest chance of saving the tooth."
              },
              {
                q: "How can I prevent chronic bad breath (halitosis) effectively?",
                a: "Chronic halitosis is often caused by sulfur-producing bacteria residing on the tongue, below the gum lines, and tucked between teeth. To handle it, brush twice daily, utilize floss or water irrigators to remove trapped decaying food debris, clean your tongue regularly using a dedicated scraper, and stay fully hydrated. Routine scaling every six months is key."
              },
              {
                q: "Is it safe to seek dental treatments during pregnancy or other general medical conditions?",
                a: "Yes, essential dental treatments and routine cleanings are safe and highly recommended during pregnancy to control high hormone-induced gum swelling (pregnancy gingivitis). For medical conditions like high blood pressure, diabetes, or blood thinner therapies, kindly inform Dr. Prabhjot Kaur before starting so we can coordinate safely with your primary physician."
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-2xs transition-all duration-300 hover:border-stone-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left py-5 px-6 sm:px-8 flex justify-between items-center gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                  >
                    <span className="font-serif font-bold text-[#111111] text-sm sm:text-base leading-snug">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-[#0abab5]/10 hover:bg-[#0abab5]/20 flex items-center justify-center text-[#0abab5] transition-transform duration-300 ${isOpen ? 'rotate-180': ''}`}>
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    </div>
                  </button>

                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-stone-100 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="py-5 px-6 sm:px-8 text-stone-600 text-xs sm:text-sm leading-relaxed bg-[#ede8df]/15">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Patient Reviews from Google Maps */}
      {hasValidKey ? (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
          <ReviewsSection 
            hasValidKey={hasValidKey} 
            onDetailsFetched={handleDetailsFetched} 
          />
        </APIProvider>
      ) : (
        <ReviewsSection 
          hasValidKey={hasValidKey} 
          onDetailsFetched={handleDetailsFetched} 
        />
      )}

      {/* Prominent Working Map Section right before Booking */}
      <section className="bg-neutral-900 py-24 border-y border-stone-800" id="map">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <ScrollReveal variant="slide-up" delay={50}>
              <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center justify-center gap-3 mb-3">
                <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
                Find Us Easily
                <span className="w-6 h-[1.5px] bg-[#b8975a]"></span>
              </span>
            </ScrollReveal>
            <ScrollReveal variant="slide-up" delay={160}>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
                Our Location in <span className="italic font-normal text-[#0abab5]">New Amritsar</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="text-reveal" delay={270}>
              <p className="text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
                Dental Square is situated in the main market of New Amritsar. View our real-time interactive clinic location below for easy driving directions.
              </p>
            </ScrollReveal>
          </div>

          <div className="rounded-3xl overflow-hidden border border-stone-800 shadow-2xl relative">
            {hasValidKey ? (
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
                <MapSection clinicDetails={clinicDetails} hasValidKey={hasValidKey} />
              </APIProvider>
            ) : (
              <MapSection clinicDetails={clinicDetails} hasValidKey={hasValidKey} />
            )}
          </div>
        </div>
      </section>

      {/* Virtual AI Dental Advisor Section */}
      <DiagnosticPlanner 
        onPlanPreFilled={(service, message) => {
          setPlannerService(service);
          setPlannerMessage(message);
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
          }
        }} 
      />

      {/* Interactive Contact & Booking section */}
      <section className="bg-neutral-950 text-white py-24 overflow-hidden" id="contact">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal variant="slide-right" duration={1000} className="w-full">
            <span className="text-xs tracking-[4px] uppercase font-semibold text-[#b8975a] flex items-center gap-3 mb-3">
              <span className="w-6 h-[1.5px] bg-[#b8975a]"></span> Patient Interactive Entry
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Book Your <em className="not-italic text-[#0abab5]">Visit</em> Today
            </h2>

            {/* Urgent Same-Day Emergency Relief Banner */}
            <div className="mb-6 bg-red-910/5 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3.5 max-w-md">
              <span className="text-xl shrink-0 mt-0.5 animate-pulse">🚨</span>
              <div>
                <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider mb-0.5">Urgent Dental Emergency?</h4>
                <p className="text-stone-300 text-[10.5px] leading-relaxed">
                  Severe toothaches, chipped crowns, or acute swelling? We reserve multiple priority same-day relief slots. State your emergency below or call immediately!
                </p>
              </div>
            </div>

            {/* Direct Clinic Information & Address */}
            <div className="space-y-8 bg-neutral-900/60 p-8 border border-stone-850 rounded-3xl animate-fade-in mb-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#0abab5]/15 text-[#0abab5] border border-[#0abab5]/20 rounded-lg flex items-center justify-center text-xl shrink-0">
                  📍
                </div>
                <div>
                  <h4 className="text-[11px] font-bold tracking-widest text-[#d4b07a] uppercase mb-1">Clinic Address</h4>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    Dental Square Clinic<br />
                    Booth no. 4-5, Main market, New Amritsar<br />
                    Amritsar, Punjab, India (143001)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#0abab5]/15 text-[#0abab5] border border-[#0abab5]/20 rounded-lg flex items-center justify-center text-xl shrink-0">
                  🕒
                </div>
                <div>
                  <h4 className="text-[11px] font-bold tracking-widest text-[#d4b07a] uppercase mb-1">Working Slots</h4>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    <strong>Monday – Saturday:</strong> 10:30 AM – 1:30 PM &amp; 4:30 PM – 7:30 PM<br />
                    <strong>Sunday:</strong> Under Appointment Consultation only
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#0abab5]/15 text-[#0abab5] border border-[#0abab5]/20 rounded-lg flex items-center justify-center text-xl shrink-0">
                  🦷
                </div>
                <div>
                  <h4 className="text-[11px] font-bold tracking-widest text-[#d4b07a] uppercase mb-1">Direct Contact</h4>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed flex flex-col gap-1 mt-0.5">
                    <span className="flex items-center gap-1.5">
                      <span>Mob / WhatsApp:</span>
                      <a 
                        href="https://wa.me/919888568886" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white hover:text-[#d4b07a] transition-colors underline underline-offset-4 decoration-stone-600 font-mono font-semibold"
                      >
                        +91 98885 68886
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-left" duration={1000} className="bg-white text-stone-900 p-8 md:p-12 rounded-3xl border border-stone-200 shadow-xl shadow-black/10 w-full animate-fade-in">
            <h3 className="font-serif text-2xl font-bold mb-1.5 text-neutral-950">
              Request Booking
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mb-8 leading-relaxed">
              Dr. Prabhjot Kaur's care assistants will confirm your reservation timeframe.
            </p>
            <AppointmentForm 
              initialService={plannerService} 
              initialMessage={plannerMessage} 
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-stone-900 py-12 px-6 text-center text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-serif text-lg font-bold text-white tracking-tight">
            Dental<span className="text-[#0abab5]">Square</span>
          </div>
          <p className="text-xs text-stone-600 font-sans">
            &copy; {new Date().getFullYear()} Dental Square, Amritsar. Managed by Dr. Prabhjot Kaur (BDS). All Patient rights protected.
          </p>
          <ul className="flex gap-4.5 text-xs text-stone-500 uppercase tracking-wider font-semibold">
            <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact Slot</a></li>
          </ul>
        </div>
      </footer>

      {/* Interactive Treatment Animations & Walkthrough Simulator modal */}
      <AnimatePresence>
        {selectedTreatmentForDemo && (
          <InteractiveTreatmentDemo
            treatmentName={selectedTreatmentForDemo}
            onClose={() => setSelectedTreatmentForDemo(null)}
          />
        )}
      </AnimatePresence>



      {/* Scroll-Reactive Floating Controls */}
      <div className="fixed bottom-6 right-6 z-[49] flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        {/* Floating Appointment Button */}
        <a 
          href="#contact" 
          className="bg-[#0abab5] hover:bg-[#07807d] text-white h-12 px-4 md:px-6 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#0abab5]/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 border border-white/10 shrink-0"
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>Book & Smile</span>
        </a>

        {/* Floating Call Button */}
        <a 
          href="tel:+919888568886" 
          className="bg-[#b8975a] hover:bg-[#967944] text-white h-12 px-4 md:px-6 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-[#b8975a]/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 border border-white/10 shrink-0"
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>Call to get a smile</span>
        </a>

        {/* Tactile Back to Top Button */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`h-12 w-12 bg-neutral-900 text-[#d4b07a] hover:text-white border border-[#b8975a]/30 hover:border-[#b8975a] flex items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0 ${
            isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
          }`}
          aria-label="Scroll back to top"
          title="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
