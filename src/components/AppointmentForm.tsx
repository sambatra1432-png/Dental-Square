import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppointmentRequest } from '../types';
import { Send, Copy, Settings, Check, Calendar, Clock, Smile, Sparkles, RefreshCcw, AlertCircle, Phone, ArrowRight } from 'lucide-react';

interface AppointmentFormProps {
  initialService?: string;
  initialMessage?: string;
}

export default function AppointmentForm({ 
  initialService = '', 
  initialMessage = '' 
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentRequest>({
    firstName: '',
    lastName: '',
    phone: '',
    service: '',
    message: '',
    preferredDate: ''
  });
  
  const [selectedSlot, setSelectedSlot] = useState('Morning Slot (10:30 AM - 1:30 PM)');
  const [doctorPhone, setDoctorPhone] = useState('919888568886'); // Default clinic number
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync props from DiagnosticPlanner
  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
    if (initialMessage) {
      setFormData(prev => ({ ...prev, message: initialMessage }));
    }
  }, [initialService, initialMessage]);

  // Robust date formatting to avoid timezone offset shifts
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return 'Not specified';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[parseInt(m, 10) - 1] || m;
      return `${d} ${monthName} ${y}`; // e.g., 28 May 2026
    }
    return dateStr;
  };

  // Safe client-side local today bounds
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Auto-compose message from client to doctor
  const composeClientMessage = () => {
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    return `✨ *New Appointment Request - Dental Square* ✨\n\n` +
           `👤 *Patient:* ${name}\n` +
           `📞 *Contact Number:* ${formData.phone}\n` +
           `📅 *Preferred Date:* ${formatDateString(formData.preferredDate)}\n` +
           `⏰ *Preferred Shift:* ${selectedSlot}\n` +
           `🦷 *Treatment:* ${formData.service || 'General Consultation'}\n` +
           `💬 *Message:* ${formData.message || 'None'}\n\n` +
           `👉 _Sent via Dental Square Website Booking Engine_`;
  };

  // Compile Doctor's automated welcome response
  const composeDoctorAutoReply = () => {
    return `Hello ${formData.firstName}! 🦷✨\n\n` +
           `Thank you for requesting an appointment at *Dental Square*.\n\n` +
           `We have received your enquiry for *${formData.service || 'General Consultation'}* on *${formatDateString(formData.preferredDate)}* during the *${selectedSlot}* shift.\n` +
           `Dr. Prabhjot Kaur's assistants will confirm your consultation slot within the next 30 minutes.\n\n` +
           `📍 *Location:* Booth no. 4-5, Main market, New Amritsar\n` +
           `📞 *Direct Support:* +91 98885 68886\n\n` +
           `_Your beautiful smile starts here!_`;
  };

  const handleWhatsAppSend = () => {
    const formattedPhone = doctorPhone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(composeClientMessage());
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyToClipboard = () => {
    const fullInquiry = `=== APPOINTMENT BOOKING ===\n\n${composeClientMessage()}\n\n=== DOCTOR'S AUTO-REPLY TEMPLATE ===\n\n${composeDoctorAutoReply()}`;
    navigator.clipboard.writeText(fullInquiry).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.firstName || !formData.phone || !formData.preferredDate) {
      setFormError("Please fill in your first name, contact number, and preferred date to register.");
      return;
    }

    setSubmitting(true);
    
    // Smooth submit flow to transition to the beautiful success ticket screen
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 450);
  };

  // Stagger animation container config for form inputs
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="text-stone-900 text-left flex flex-col justify-between font-sans relative"
      >
        {/* Animated celebration/success header */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-stone-200">
          <div className="w-12 h-12 bg-[#0abab5]/10 text-[#0abab5] text-xl rounded-full flex items-center justify-center shrink-0 shadow-xs border border-[#0abab5]/20">
            ✓
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-neutral-950">
              Inquiry Form Received!
            </h3>
            <p className="text-stone-500 text-xs mt-0.5">
              Please click below to send directly to Dr. Kaur's team.
            </p>
          </div>
        </div>

        {/* Dynamic Digital Appointment Ticket */}
        <div className="bg-[#fcfaf7] border border-[#ede8df] rounded-2xl p-5 mb-6 shadow-xs relative overflow-hidden">
          {/* Punch Holes on the ticket card sides */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-white border-r border-[#ede8df] -translate-y-1/2 z-10 hidden xs:block" />
          <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-white border-l border-[#ede8df] -translate-y-1/2 z-10 hidden xs:block" />
          
          <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono pb-3 border-b border-dashed border-stone-200 mb-4">
            <span className="flex items-center gap-1.5 font-bold tracking-widest text-[#0abab5]">
              <Sparkles className="w-3.5 h-3.5" /> DENTAL SQUARE OUTPATIENT
            </span>
            <span className="text-stone-400">AMRITSAR practice</span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2.5 text-xs">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">Patient Name</span>
              <span className="font-semibold text-neutral-900">{formData.firstName} {formData.lastName || ''}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">Contact Number</span>
              <span className="font-semibold text-neutral-900">{formData.phone}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">Preferred Date</span>
              <span className="font-semibold text-neutral-900 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#0abab5] shrink-0" />
                {formatDateString(formData.preferredDate)}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">Time Consultation</span>
              <span className="font-semibold text-neutral-900 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0abab5] shrink-0" />
                {selectedSlot.split(' ')[0]}
              </span>
            </div>
            <div className="col-span-2 pt-2.5 border-t border-stone-200/50">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">Requested Specialty</span>
              <span className="font-medium text-[#0abab5] block">{formData.service || 'General Dental Assessment'}</span>
            </div>
          </div>
        </div>

        {/* Recipient Doctor/Assistant Custom config in success drawer */}
        <div className="bg-stone-50 border border-stone-250/70 rounded-xl p-3.5 mb-6">
          <label className="block text-[9px] font-bold tracking-widest uppercase text-stone-500 mb-1">
            ⚙️ Clinic Destination WhatsApp Line
          </label>
          <div className="flex gap-2.5 items-center">
            <input 
              type="text" 
              placeholder="e.g. 919888568886" 
              value={doctorPhone}
              onChange={(e) => setDoctorPhone(e.target.value.replace(/[^0-9]/g, ''))}
              className="bg-white border border-stone-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-[#0abab5] w-full max-w-[180px] font-mono text-center shadow-2xs"
              title="Add country code (e.g. 91 for India) with no spaces or symbols"
            />
            <span className="text-[9px] text-stone-400">
              Indian Mobile format: <strong>91XXXXXXXXXX</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Buttons to proceed with WhatsApp launch or PC export */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <motion.button 
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleWhatsAppSend}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs py-4 px-4 rounded-xl shadow-md shadow-emerald-700/10 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Send className="w-4 h-4" />
            <span>Send Details on WhatsApp</span>
          </motion.button>

          <motion.button 
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleCopyToClipboard}
            className={`flex items-center justify-center gap-2 border font-sans font-bold text-xs py-4 px-4 rounded-xl transition-all cursor-pointer uppercase tracking-wider ${
              copied 
                ? 'bg-[#0abab5] border-[#0abab5] text-white shadow-xs' 
                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-2xs'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Details!' : 'Copy Ticket to Clipboard'}</span>
          </motion.button>
        </div>

        {/* Safe Guidelines helper text box */}
        <div className="mt-5 text-[10px] text-stone-500 bg-stone-50 p-3.5 rounded-xl border border-stone-200 leading-relaxed font-sans flex items-start gap-2">
          <span>💡</span>
          <span>
            <strong>Next Action:</strong> After clicking <strong>Send Details on WhatsApp</strong>, a chat window will open directly with Dr. Kaur's appointment desk in Amritsar. Submit the pre-filled template message inside WhatsApp to confirm your exact timing!
          </span>
        </div>

        <button 
          onClick={() => {
            setSuccess(false);
            setFormData({ firstName: '', lastName: '', phone: '', service: '', message: '', preferredDate: '' });
          }}
          className="mt-6 self-center text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-[#0abab5] transition-all border-b border-transparent hover:border-[#0abab5]"
        >
          ← Book another reservation slot
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-stone-800 mb-2 font-mono">
              Patient First Name
            </label>
            <input 
              type="text" 
              required
              autoComplete="given-name"
              placeholder="e.g. Sam"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-[#f8f4ee] border border-[#ede8df] text-[#111111] placeholder-[#a2a09b] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#0abab5] focus:ring-2 focus:ring-[#0abab5]/15 focus:bg-white transition-all hover:border-[#0abab5]/30 shadow-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-stone-800 mb-2 font-mono">
              Patient Last Name
            </label>
            <input 
              type="text" 
              autoComplete="family-name"
              placeholder="e.g. Batra"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-[#f8f4ee] border border-[#ede8df] text-[#111111] placeholder-[#a2a09b] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#0abab5] focus:ring-2 focus:ring-[#0abab5]/15 focus:bg-white transition-all hover:border-[#0abab5]/30 shadow-xs"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-xs font-bold tracking-widest uppercase text-stone-800 mb-2 font-mono">
            Contact Number (WhatsApp enabled)
          </label>
          <input 
            type="tel" 
            required
            autoComplete="tel"
            placeholder="e.g. 9812******"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-[#f8f4ee] border border-[#ede8df] text-[#111111] placeholder-[#a2a09b] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#0abab5] focus:ring-2 focus:ring-[#0abab5]/15 focus:bg-white transition-all hover:border-[#0abab5]/30 shadow-xs"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-stone-800 mb-2 font-mono">
              Select Dental Service
            </label>
            <div className="relative">
              <select 
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-[#f8f4ee] border border-[#ede8df] text-[#111111] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#0abab5] focus:ring-2 focus:ring-[#0abab5]/15 focus:bg-white transition-all appearance-none cursor-pointer pr-10 hover:border-[#0abab5]/30 font-medium"
              >
                <option value="">Select a treatment...</option>
                <option value="Consultation">General Dental Consultation</option>
                <option value="Digital 3D Scan">Digital 3D Intraoral Scan</option>
                <option value="Root Canal Treatment">Root Canal Treatment (RCT)</option>
                <option value="Teeth Whitening">Teeth Whitening & Aesthetics</option>
                <option value="Dental Implants">Dental Implants (Permanent Teeth)</option>
                <option value="Orthodontics & Aligner">Braces & Clear Aligners</option>
                <option value="Crowns & Bridges">Crowns & Dental Bridges</option>
                <option value="Paediatric Dentistry">Pediatric (kids) Dentistry</option>
                <option value="Deep Pro Cleaning">Professional Cleaning</option>
                <option value="Fillings">Micro-Fillings & Restorations</option>
                <option value="Gum Treatment">Gum Surgery & Periodontics</option>
                <option value="Regular Check-up">Regular Check-up</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-stone-500 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-stone-800 mb-2 font-mono">
              Preferred Date
            </label>
            <input 
              type="date" 
              required
              min={getTodayDateString()}
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full bg-[#f8f4ee] border border-[#ede8df] text-[#111111] px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#0abab5] focus:ring-2 focus:ring-[#0abab5]/15 focus:bg-white transition-all cursor-pointer font-sans hover:border-[#0abab5]/30"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-xs font-bold tracking-widest uppercase text-stone-800 mb-2.5 font-mono">
            Booking Timeslot Shift
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 font-mono">
            {[
              { id: 'Morning Slot (10:30 AM - 1:30 PM)', label: 'Morning Slot', time: '10:30am - 1:30pm', emoji: '🌅' },
              { id: 'Evening Slot (4:30 PM - 7:30 PM)', label: 'Evening Slot', time: '4:30pm - 7:30pm', emoji: '🌇' }
            ].map((slot) => {
              const isSelected = selectedSlot === slot.id;
              return (
                <motion.button
                  key={slot.id}
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-2xs ${
                    isSelected 
                      ? 'bg-[#0abab5] text-white border-transparent shadow-md shadow-[#0abab5]/10' 
                      : 'bg-[#f8f4ee] border-[#ede8df] hover:border-[#0abab5]/30 text-stone-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">{slot.emoji}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#d4b07a] shadow-xs" />
                    )}
                  </div>
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-wider">{slot.label}</div>
                  <div className={`text-[8px] mt-0.5 font-semibold ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{slot.time}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-xs font-bold tracking-widest uppercase text-stone-800 mb-2 font-mono">
            Remarks or Symptoms (Optional)
          </label>
          <textarea 
            placeholder="Let us know your current dental symptoms, or specific health requests..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-[#f8f4ee] border border-[#ede8df] text-[#111111] placeholder-[#a2a09b] px-4 py-3 rounded-lg text-sm h-28 focus:outline-none focus:border-[#0abab5] focus:ring-2 focus:ring-[#0abab5]/15 focus:bg-white transition-all resize-none hover:border-[#0abab5]/30 shadow-xs"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="border border-stone-200 bg-stone-50 rounded-xl p-4">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center justify-between w-full text-left font-sans text-[10px] font-bold tracking-widest uppercase text-stone-500 hover:text-[#0abab5] transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Destination WhatsApp Channel</span>
            <span className="text-xs">{showSettings ? '▲ Hide' : '▼ Expand'}</span>
          </button>

          {showSettings && (
            <div className="mt-3.5 pt-3 border-t border-stone-200/80 space-y-3 animate-fade-in text-stone-600">
              <p className="text-[10px] leading-relaxed">
                By default, this submits straight to Dr. Kaur's assistant team (+91 98885 68886). To live-test with your own mobile phone, customize the variable below (include country code with no +, symbols, or spaces).
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. 919888568886" 
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="flex-1 bg-white border border-stone-200 text-xs px-3.5 py-2 rounded focus:outline-[#0abab5] font-mono max-w-sm"
                />
                {doctorPhone !== '919888568886' && (
                  <button
                    type="button"
                    onClick={() => setDoctorPhone('919888568886')}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded transition-colors self-start cursor-pointer"
                  >
                    Reset Default Line
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {formError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-xs font-semibold leading-relaxed flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{formError}</span>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="pt-2">
          <motion.button 
            type="submit" 
            disabled={submitting}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.985 }}
            className="w-full py-4 rounded-xl bg-[#0abab5] hover:bg-[#07807d] disabled:bg-stone-300 text-white text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-md shadow-[#0abab5]/15 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Preparing Ticket...' : 'Request Slot & Smile'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </form>
  );
}
