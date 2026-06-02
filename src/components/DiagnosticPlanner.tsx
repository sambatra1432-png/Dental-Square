import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Brain, Stethoscope, AlertTriangle, ArrowRight, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  analysis: string;
  assessmentPoints: string[];
  matchedService: string;
  careTips: string;
  isFallback?: boolean;
}

interface DiagnosticPlannerProps {
  onPlanPreFilled: (service: string, message: string) => void;
}

const COMMON_CONCERNS = [
  { id: 'pain', label: 'Toothache / Sensitivity', text: 'Sharp pain in molar when drinking cold water' },
  { id: 'bleeding', label: 'Bleeding / Sore Gums', text: 'My gums bleed slightly when brushing' },
  { id: 'align', label: 'Crooked / Crowded Teeth', text: 'Interested in invisible alignment braces' },
  { id: 'yellowing', label: 'Yellow / Stained Teeth', text: 'Need aesthetic smile brightening and cleaning' },
  { id: 'gap', label: 'Missing Tooth / Gap', text: 'Need a permanent implant replacement for a missing tooth' }
];

export default function DiagnosticPlanner({ onPlanPreFilled }: DiagnosticPlannerProps) {
  const [concern, setConcern] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSmartConsult = async (inputText: string) => {
    const queryText = inputText || concern;
    if (!queryText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ concern: queryText }),
      });

      if (!response.ok) {
        throw new Error('Dental feedback model temporarily unavailable. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreFillInquiry = () => {
    if (!result) return;
    const trackingMsg = `Hello Dr. Kaur, I used your website's virtual dental advisor regarding my concern: "${concern || 'Dental Enquiry'}". It suggested the ${result.matchedService} service. I'd like to book an active consultation.`;
    onPlanPreFilled(result.matchedService, trackingMsg);
  };

  return (
    <section className="bg-stone-950 border-t border-stone-900 py-24 px-4 md:px-8 relative overflow-hidden" id="advisor">
      {/* Decorative radial glare background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0abab5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0abab5]/10 border border-[#0abab5]/20 text-[#0abab5] px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Brain className="w-3.5 h-3.5 animate-pulse" />
            Empathetic Technology
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-100 font-medium tracking-tight mb-4">
            Virtual AI Dental Advisor
          </h2>
          <p className="text-stone-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Describe your oral concerns or symptoms below. Receive instant custom guidance and treatment suggestions aligned with Dr. Prabhjot Kaur's care team.
          </p>
        </div>

        {/* Input & Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interaction Form Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900/60 backdrop-blur-md border border-stone-850 p-6 rounded-2xl">
              <h3 className="text-xs font-mono text-[#b8975a] uppercase tracking-wider mb-3">
                Select a standard concern
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {COMMON_CONCERNS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setConcern(item.text);
                      handleSmartConsult(item.text);
                    }}
                    className="text-xs bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-stone-750 text-stone-300 px-3.5 py-2 rounded-full transition-all text-left cursor-pointer active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative border-t border-stone-800 pt-5">
                <label className="block text-xs font-mono text-[#0abab5] uppercase tracking-widest mb-3" htmlFor="custom-concern">
                  Or describe in your words
                </label>
                <textarea
                  id="custom-concern"
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="e.g. My tooth hurts slightly when chewing sweet things, and gums feel tender..."
                  className="w-full h-32 bg-stone-950 border border-stone-850 rounded-xl px-4 py-3 text-stone-200 text-sm focus:outline-none focus:border-[#0abab5] transition-all placeholder:text-stone-600 resize-none"
                />
                
                <button
                  onClick={() => handleSmartConsult('')}
                  disabled={loading || !concern.trim()}
                  className="w-full mt-4 bg-[#0abab5] disabled:bg-stone-800 text-stone-950 disabled:text-stone-600 py-3.5 rounded-xl text-xs font-mono font-bold tracking-wider hover:bg-[#089692] uppercase cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Consulting Dr. Kaur's Virtual Desk...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Get AI Consultation
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-stone-900/30 border border-stone-900 p-4 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-stone-500 leading-relaxed font-mono">
                Disclaimer: The virtual advisor output is purely educational and does not constitute technical medical diagnosis. Always secure an in-person diagnostic evaluation.
              </p>
            </div>
          </div>

          {/* Results Outcome Column */}
          <div className="lg:col-span-7 bg-stone-900/30 border border-stone-850/80 rounded-2xl min-h-[380px] flex flex-col relative overflow-hidden transition-all duration-300 p-6 md:p-8">
            
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-20 text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-2 border-stone-800 border-t-[#0abab5] animate-spin" />
                    <HeartPulse className="w-6 h-6 text-[#0abab5] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h4 className="text-stone-200 font-serif text-lg mb-2">Analyzing Clinical Concern</h4>
                  <p className="text-xs text-stone-400 max-w-xs font-mono">
                    Integrating response details, matching standard medical services, and evaluating clinical care tips...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !loading && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <Stethoscope className="w-10 h-10 text-stone-700 mb-4 stroke-1" />
                <h4 className="text-stone-300 font-serif text-base mb-1">Advisor Standby</h4>
                <p className="text-xs max-w-xs leading-relaxed font-mono">
                  Input your exact symptoms or click one of the pre-loaded buttons to model a virtual care assessment.
                </p>
              </div>
            )}

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-red-400">
                <AlertTriangle className="w-10 h-10 mb-4 text-red-500/80 stroke-1" />
                <h4 className="text-stone-300 font-serif text-base mb-1">Assessment Timeout</h4>
                <p className="text-xs max-w-xs leading-relaxed font-mono">
                  {error}
                </p>
              </div>
            )}

            {result && !loading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 border-b border-stone-850 pb-4 mb-4">
                    <span className="text-[10px] font-mono text-[#0abab5] bg-[#0abab5]/10 border border-[#0abab5]/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Dr. Prabhjot's Virtual AI Advisor
                    </span>
                    {result.isFallback && (
                      <span className="text-[9px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded-md">
                        Fallback Mode
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-stone-300 text-sm leading-relaxed font-sans italic">
                      "{result.analysis}"
                    </p>

                    <div>
                      <h4 className="text-xs font-mono text-[#b8975a] uppercase tracking-wider mb-2">Key Considerations:</h4>
                      <ul className="space-y-2">
                        {result.assessmentPoints.map((pt, i) => (
                          <li key={i} className="flex gap-2.5 items-start text-xs text-stone-300 font-mono leading-relaxed">
                            <span className="text-[#0abab5] mt-1 shrink-0">■</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-stone-950 border border-stone-850/80 rounded-xl p-4 flex gap-4 items-center">
                      <div className="p-2.5 rounded-lg bg-[#0abab5]/5 border border-[#0abab5]/10 text-[#0abab5]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">SUGGESTED TREATMENT MATCH</span>
                        <h5 className="text-sm font-serif text-white font-medium truncate">{result.matchedService}</h5>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl">
                      <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono text-[10px] tracking-wider uppercase mr-1">[Care Guidance]:</strong>
                        {result.careTips}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-850 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[10px] font-mono text-stone-500 leading-relaxed">
                    Ready to schedule? Click below to pre-select this treatment.
                  </div>
                  <button
                    onClick={handlePreFillInquiry}
                    className="inline-flex items-center gap-2 bg-[#0abab5] hover:bg-[#089692] text-stone-950 font-mono text-xs font-bold uppercase py-3 px-5 rounded-xl cursor-pointer self-end sm:self-auto transition-all active:scale-95"
                  >
                    Book Slot for {result.matchedService}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
