import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2, Camera, MapPin } from 'lucide-react';

interface ClinicPhoto {
  id: string;
  source: string;
  title: string;
  category: string;
  description: string;
  tab: 'clinical' | 'lounge' | 'art';
}

const CLINIC_PHOTOS: ClinicPhoto[] = [
  {
    id: 'photo_reception',
    source: 'https://drive.google.com/thumbnail?id=1o3EzIeE5mTzjUiQJEmkAdoPLiXilcSCG&sz=w1200',
    title: 'Clinical Consultation Table',
    category: 'Consultation Desk',
    description: 'Sleek consultation workspace with comfortable leather chairs, perfect for diagnostic analysis and personal treatment planning with Dr. Prabhjot Kaur.',
    tab: 'clinical'
  },
  {
    id: 'photo_column',
    source: 'https://drive.google.com/thumbnail?id=1Szn1GLVtDy1I64Jx13h4IOm0g6Jhn1Dx&sz=w1200',
    title: 'Operatory Chair & Clinic Treatment Room',
    category: 'Clinical Suite',
    description: 'Professional dental operatory workspace featuring a modern electromechanical patient chair and sterile setup designed for patient comfort.',
    tab: 'clinical'
  },
  {
    id: 'photo_frosted',
    source: 'https://drive.google.com/thumbnail?id=1NiajD5c3Ecj8enxwXEC8nyycaUB-DqKu&sz=w1200',
    title: 'Frosted Glass Lobby & Doorway',
    category: 'Lobby Partition',
    description: 'Interior view facing the secure glass doorway with frosted privacy stripes and a hanging "CLOSED" sign leading into the workspace.',
    tab: 'lounge'
  },
  {
    id: 'photo_doctor_desk',
    source: 'https://drive.google.com/thumbnail?id=1uKa5k38PeeNLXJHTISeaQOi_Obr433Wd&sz=w1200',
    title: 'Consultation Desk & Case Planning Area',
    category: 'Consultation Desk',
    description: "Dr. Prabhjot Kaur's diagnostic consultation desk displaying patient treatment planners, clinical charts, and standard dentist nameplate.",
    tab: 'clinical'
  },
  {
    id: 'photo_treatment',
    source: 'https://drive.google.com/thumbnail?id=1TGcPo1mtfML7toTT7NeglyJpTna_TWXa&sz=w1200',
    title: 'Main Entrance & Lobby',
    category: 'Main Entrance',
    description: 'The welcoming main entrance of Dental Square in Amritsar, featuring pristine glass partitions, patient-first alignment, and comfortable lobby spacing.',
    tab: 'lounge'
  },
  {
    id: 'photo_waiting_room',
    source: 'https://drive.google.com/thumbnail?id=1C0MwlBtVe3rgYC6CddvRFx71U0jPhKbX&sz=w1200',
    title: 'Comfortable Waiting Lounge',
    category: 'Waiting Room',
    description: 'Inviting waiting lounge with cushioned armchairs, clean modern styling, and split air-conditioning designed to provide a relaxing environment for patients.',
    tab: 'lounge'
  },
  {
    id: 'photo_benches',
    source: 'https://drive.google.com/thumbnail?id=1-SC5URe8SYQSZ1NuN6pID7p670w1RIMD&sz=w1200',
    title: 'Inner Patient Seating Spot & Wall Accent',
    category: 'Sitting Lounge',
    description: 'Calming inner waiting area featuring comfortable traditional wood benches, frosted dividers, and a "Dream Smile" layout on the rear wall.',
    tab: 'lounge'
  },
  {
    id: 'photo_decor_sculpture',
    source: 'https://drive.google.com/thumbnail?id=1-W0hOCnGhzUwycLajIBMR02ugyPNDid0&sz=w1200',
    title: 'Decorative Tooth Art & Clinical Accent',
    category: 'Clinic Decor',
    description: 'An elegant golden dental sculpture accented by clean, modern clinic wall styling, symbolizing our refined care and precision.',
    tab: 'lounge'
  }
];

export default function ClinicPhotoGallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'clinical' | 'lounge'>('all');

  const filteredPhotos = CLINIC_PHOTOS.filter(photo => {
    if (activeTab === 'all') return true;
    return photo.tab === activeTab;
  });

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
      } else if (e.key === 'Escape') {
        setSelectedIdx(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, filteredPhotos.length]);

  return (
    <section className="bg-[#0f0f10] text-stone-100 py-24 px-4 md:px-8 border-t border-stone-900 overflow-hidden" id="photos">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#0abab5]/10 border border-[#0abab5]/20 text-[#0abab5] px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              <span>Original Space Gallery</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight">
              A Glimpse Into Dental Square
            </h2>
            <p className="text-stone-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Explore authentic, unedited photos of our clinic interiors and beautiful dentistry-inspired details in New Amritsar. Click any card to expand.
            </p>
          </div>

        </div>

        {/* Minimal High-Contrast Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-12 border-b border-stone-900 pb-6">
          {[
            { id: 'all', label: 'All Frames' },
            { id: 'clinical', label: 'Clinical Rooms' },
            { id: 'lounge', label: 'Lounge & Waiting' }
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as 'all' | 'clinical' | 'lounge');
                  setSelectedIdx(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  isTabActive
                    ? 'bg-[#0abab5] text-stone-950 font-bold shadow-lg shadow-[#0abab5]/10'
                    : 'bg-stone-950 border border-stone-850 text-stone-400 hover:text-white hover:border-stone-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Elegant Asymmetrical Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => {
            // Determine custom grid spans for dynamic aesthetic layout spacing
            let gridSpanClass = "aspect-[4/3] lg:col-span-1";
            if (activeTab === 'all') {
              if (idx === 0) {
                gridSpanClass = "lg:col-span-2 aspect-[16/10]";
              } else if (idx === 1) {
                gridSpanClass = "aspect-[4/5] lg:row-span-2";
              } else if (idx === 5) {
                gridSpanClass = "lg:col-span-2 aspect-[16/10]";
              }
            } else {
              // Graceful layouts for category tabs
              if (idx === 0) {
                gridSpanClass = "lg:col-span-2 aspect-[16/10]";
              }
            }

            return (
              <div 
                key={photo.id}
                onClick={() => setSelectedIdx(idx)}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-stone-850 bg-stone-950 ${gridSpanClass} shadow-xl hover:shadow-[#0abab5]/5 transition-all duration-500`}
              >
                <img 
                  src={photo.source} 
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <p className="text-[10px] font-mono text-[#0abab5] uppercase tracking-wider font-bold mb-1">{photo.category}</p>
                    <h3 className="text-lg font-semibold text-white">{photo.title}</h3>
                  </div>
                </div>
                <div className="absolute top-4 right-4 p-2 bg-black/60 rounded-full border border-stone-850 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Immersive Dark-Mode Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && filteredPhotos[selectedIdx] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl p-4 md:p-6 cursor-zoom-out select-none"
          >
            {/* Top Bar inside Lightbox */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center justify-between z-10 cursor-default"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#0abab5] uppercase tracking-wider font-bold">
                  {filteredPhotos[selectedIdx].category}
                </span>
                <h3 className="text-sm md:text-lg font-medium text-white max-w-sm sm:max-w-md truncate">
                  {filteredPhotos[selectedIdx].title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedIdx(null)}
                className="p-3 rounded-full hover:bg-stone-900 border border-transparent hover:border-stone-850 text-stone-400 hover:text-white transition-all outline-none cursor-pointer"
                aria-label="Close photo viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Core with Large Active Photo */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex-1 flex items-center justify-center relative my-4 sm:my-6 max-h-[70vh] cursor-default"
            >
              {/* Previous Slide Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
                }}
                className="absolute left-2 sm:left-4 z-10 p-3 sm:p-4 rounded-full bg-stone-900/80 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
                aria-label="Previous view"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex items-center justify-center p-2 cursor-zoom-out"
                  onClick={() => setSelectedIdx(null)}
                >
                  <img 
                    src={filteredPhotos[selectedIdx].source} 
                    alt={filteredPhotos[selectedIdx].title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-stone-800 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next Slide Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIdx((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
                }}
                className="absolute right-2 sm:right-4 z-10 p-3 sm:p-4 rounded-full bg-stone-900/80 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
                aria-label="Next view"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Bottom Panel containing tiny Thumbnails & Pager */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex flex-col items-center gap-4 z-10 cursor-default"
            >
              {/* Indicator Pager (e.g. 3 / 9) */}
              <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
                <span>Photo {selectedIdx + 1} of {filteredPhotos.length}</span>
                <span className="text-stone-700">|</span>
                <button 
                  onClick={() => setSelectedIdx(null)}
                  className="text-stone-300 hover:text-[#0abab5] uppercase tracking-wider text-[11px] font-bold underline decoration-[#0abab5]/30 underline-offset-4 transition-colors cursor-pointer"
                  title="Click to minimize full photo view"
                >
                  Exit Full Screen
                </button>
              </div>

              {/* Minimal horizontal scrolling thumbnail bar */}
              <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-1 px-4">
                {filteredPhotos.map((pt, idx) => {
                  const isActive = idx === selectedIdx;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`relative w-14 sm:w-16 aspect-[4/3] rounded-lg overflow-hidden border transition-all flex-shrink-0 cursor-pointer ${
                        isActive 
                          ? 'border-[#0abab5] scale-105 ring-2 ring-[#0abab5]/30' 
                          : 'border-stone-800 opacity-50 hover:opacity-100'
                      }`}
                      aria-label={`Jump to photo ${idx + 1}`}
                    >
                      <img 
                        src={pt.source} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
