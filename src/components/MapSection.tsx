import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { ClinicDetails, Review } from '../types';
import { MapPin, Star, Heart, Users, Activity, ChevronRight, Award } from 'lucide-react';

// Near Main Market, New Amritsar coords as safe default
const DEFAULT_COORDS = { lat: 31.6225, lng: 74.9140 };

// Geographic coordinate mapper for popular local Amritsar communities
const LOCALITY_COORDS: { [key: string]: { lat: number; lng: number } } = {
  "New Amritsar": { lat: 31.6238, lng: 74.9158 },
  "Ranjit Avenue": { lat: 31.6508, lng: 74.8801 },
  "Lawrence Road": { lat: 31.6425, lng: 74.8770 },
  "Golden Temple Area": { lat: 31.6199, lng: 74.8765 },
  "Majitha Road": { lat: 31.6631, lng: 74.8872 },
  "Putligarh": { lat: 31.6318, lng: 74.8510 },
  "Verka": { lat: 31.6652, lng: 74.9125 },
  "Amritsar Cantt": { lat: 31.6133, lng: 74.8580 },
  "Civil Lines": { lat: 31.6450, lng: 74.8690 },
  "Other / Outer Amritsar": { lat: 31.6350, lng: 74.9200 }
};

function InteractiveGoogleMap({
  clinicAddress,
  localityStats,
  selectedLocality,
  activeReviewMarker,
  setActiveReviewMarker,
  infoOpen,
  setInfoOpen,
  handleLocalityClick
}: {
  clinicAddress: string;
  localityStats: any;
  selectedLocality: string | null;
  activeReviewMarker: Review | null;
  setActiveReviewMarker: (val: Review | null) => void;
  infoOpen: boolean;
  setInfoOpen: (val: boolean) => void;
  handleLocalityClick: (locName: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedLocality) {
      const coords = LOCALITY_COORDS[selectedLocality];
      if (coords) {
        map.panTo(coords);
        map.setZoom(14);
      }
    } else {
      map.panTo(DEFAULT_COORDS);
      map.setZoom(15);
    }
  }, [map, selectedLocality]);

  return (
    <Map
      defaultCenter={DEFAULT_COORDS}
      defaultZoom={15}
      mapId="DENTAL_SQUARE_MAP_ID"
      gestureHandling={'cooperative'}
      disableDefaultUI={false}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Primary clinic marker */}
      <AdvancedMarker
        position={DEFAULT_COORDS}
        onClick={() => {
          setInfoOpen(!infoOpen);
          setActiveReviewMarker(null);
        }}
      >
        <Pin 
          background="#0abab5" 
          glyphColor="#ffffff" 
          borderColor="#07807d"
          scale={1.2}
        />
      </AdvancedMarker>

      {/* Custom patient pins */}
      {localityStats && Object.keys(localityStats).map((locName) => {
        const coords = LOCALITY_COORDS[locName];
        if (!coords) return null;
        
        const isSelected = selectedLocality === locName;
        
        return (
          <AdvancedMarker
            key={locName}
            position={coords}
            onClick={() => handleLocalityClick(locName)}
          >
            <motion.div
              animate={{ scale: isSelected ? 1.25 : 1 }}
              className="cursor-pointer"
            >
              <Pin 
                background={isSelected ? "#b8975a" : "#ede8df"} 
                glyphColor={isSelected ? "#ffffff" : "#b8975a"} 
                borderColor={isSelected ? "#967944" : "#b8975a"}
                scale={0.9}
              />
            </motion.div>
          </AdvancedMarker>
        );
      })}

      {/* Primary Clinic Info Window */}
      {infoOpen && (
        <InfoWindow
          position={DEFAULT_COORDS}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1 max-w-[200px] font-sans text-stone-950">
            <h3 className="font-serif font-bold text-xs text-[#0abab5]">
              Dental Square
            </h3>
            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
              {clinicAddress}
            </p>
            <div className="mt-2 text-[10px] text-zinc-400 font-medium flex items-center gap-1 border-t border-stone-100 pt-1">
              <span>👩‍⚕️ Dr. Prabhjot Kaur (BDS)</span>
            </div>
          </div>
        </InfoWindow>
      )}

      {/* Live Patient Review Info Window Map Placement */}
      {activeReviewMarker && (
        <InfoWindow
          position={LOCALITY_COORDS[activeReviewMarker.locality || "New Amritsar"] || DEFAULT_COORDS}
          onCloseClick={() => setActiveReviewMarker(null)}
        >
          <div className="p-2 max-w-[220px] font-sans text-stone-900 leading-normal">
            <div className="flex items-center gap-1.5 border-b border-stone-100 pb-1.5 mb-1.5">
              <span className="text-[9px] bg-[#0abab5]/10 text-[#0abab5] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Patient Spot
              </span>
              <span className="text-stone-700 font-bold text-[10px] font-mono uppercase tracking-wide">
                {activeReviewMarker.locality}
              </span>
            </div>
            <div className="text-amber-500 text-xs mb-1">
              {"★".repeat(Math.round(activeReviewMarker.rating))}
            </div>
            <p className="text-[11px] text-stone-600 italic font-sans font-medium">
              “{activeReviewMarker.text}”
            </p>
            <div className="mt-2 text-[10px] text-stone-500 font-bold text-right font-sans">
              — {activeReviewMarker.authorName}
            </div>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

export default function MapSection({
  clinicDetails,
  hasValidKey
}: {
  clinicDetails: ClinicDetails | null;
  hasValidKey: boolean;
}) {
  const [infoOpen, setInfoOpen] = useState(true);
  const [activeReviewMarker, setActiveReviewMarker] = useState<Review | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);

  let clinicAddress = "Booth no. 4-5, Main market, New Amritsar, Amritsar, Punjab, India";

  if (clinicDetails?.formattedAddress) {
    clinicAddress = clinicDetails.formattedAddress;
  }

  // Filter reviews containing valid localities
  const localizedReviews = clinicDetails?.reviews?.filter(r => r.locality && LOCALITY_COORDS[r.locality]) || [];

  // Group reviews by locality to show metric density in sidebar
  const localityStats = React.useMemo(() => {
    const stats: { [key: string]: { count: number; reviews: Review[] } } = {};
    
    // Inject custom defaults optionally if no reviews mapped yet
    const fallbackReviews = clinicDetails?.reviews || [];
    fallbackReviews.forEach(r => {
      const loc = r.locality || "New Amritsar";
      if (!stats[loc]) {
        stats[loc] = { count: 0, reviews: [] };
      }
      stats[loc].count += 1;
      stats[loc].reviews.push(r);
    });
    
    return stats;
  }, [clinicDetails]);

  // Handle zooming / panning to locality on map interaction
  const handleLocalityClick = (locName: string) => {
    setSelectedLocality(locName);
    // Find the first review loaded in that locality to set as active marker popup
    const matchingReviews = localityStats[locName]?.reviews || [];
    if (matchingReviews.length > 0) {
      setActiveReviewMarker(matchingReviews[0]);
    }
  };

  const handleResetMapFocus = () => {
    setSelectedLocality(null);
    setActiveReviewMarker(null);
    setInfoOpen(true);
  };

  return (
    <div className="w-full">
      
      {/* Live Google Map Container (Full Width) */}
      <div className="w-full bg-neutral-900 rounded-3xl overflow-hidden border border-stone-800 shadow-inner min-h-[450px] h-[500px] relative group">
        
        {/* If no key details provided, show clean IFrame map */}
        {!hasValidKey ? (
          <iframe 
            title="Dental Square Clinic Map"
            src="https://maps.google.com/maps?q=Dental%20Square%2C%20New%20Amritsar%20Colony%2C%20Amritsar%2C%20Punjab%20143001&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          ></iframe>
        ) : (
          /* Advanced Interactive Marker Pins with API Key support */
          <InteractiveGoogleMap
            clinicAddress={clinicAddress}
            localityStats={localityStats}
            selectedLocality={selectedLocality}
            activeReviewMarker={activeReviewMarker}
            setActiveReviewMarker={setActiveReviewMarker}
            infoOpen={infoOpen}
            setInfoOpen={setInfoOpen}
            handleLocalityClick={handleLocalityClick}
          />
        )}

        {/* Hover guidance card for map interaction */}
        <div className="absolute top-4 left-4 bg-neutral-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 text-white z-10 pointer-events-none max-w-xs transition-opacity group-hover:opacity-100 hidden sm:block">
          <p className="text-[9px] uppercase tracking-widest text-[#b8975a] font-bold font-mono">
            Interactive Coverage Map
          </p>
          <p className="text-[10px] text-stone-300 mt-1 leading-relaxed">
            Patient reviews are geolocated on the map by neighborhood coordinates.
          </p>
        </div>
      </div>

    </div>
  );
}
