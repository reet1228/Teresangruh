import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface CurtainEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
}

export const CurtainEnvelope: React.FC<CurtainEnvelopeProps> = ({ isOpen, onOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompletelyGone, setIsCompletelyGone] = useState(false);

  const handleOpenClick = () => {
    if (isAnimating || isOpen) return;
    setIsAnimating(true);

    // Trigger luxury rose and gold confetti shower
    try {
      const count = 120;
      const defaults = {
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#C96D80", "#F4E8D1", "#ECC880", "#E8A598", "#FFFFFF"],
      };

      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.6),
        spread: 60,
        startVelocity: 45,
      });
      confetti({
        ...defaults,
        particleCount: Math.floor(count * 0.4),
        spread: 100,
        decay: 0.91,
        scalar: 0.9,
      });
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          spread: 120,
          startVelocity: 35,
        });
      }, 350);
    } catch {
      // ignore
    }

    // Call onOpen to trigger music & website visibility
    onOpen();

    // After animation finishes, hide the overlay completely from DOM
    setTimeout(() => {
      setIsCompletelyGone(true);
    }, 1600);
  };

  if (isCompletelyGone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${
        isOpen ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {/* Background Dimmer */}
      <div 
        className={`absolute inset-0 bg-[#0B0907] transition-opacity duration-1000 ${
          isOpen ? "opacity-0" : "opacity-95"
        }`} 
      />

      {/* LEFT DOOR / CURTAIN */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#21150C] border-r border-[#D4AF37]/40 shadow-2xl transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] z-10 flex items-center justify-end overflow-hidden ${
          isOpen ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(20, 13, 7, 0.92), rgba(38, 24, 14, 0.82)), url('/assets/illustrations/royal_door_closed.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
        }}
      >
        {/* Left inner ornamental border */}
        <div className="absolute inset-y-4 right-3 w-[85%] border-y border-l border-[#D4AF37]/30 rounded-l-2xl pointer-events-none" />
        <div className="mr-6 opacity-40 hidden sm:block">
          <div className="w-16 h-48 border-r-2 border-dashed border-[#D4AF37]/40" />
        </div>
      </div>

      {/* RIGHT DOOR / CURTAIN */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 bg-[#21150C] border-l border-[#D4AF37]/40 shadow-2xl transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] z-10 flex items-center justify-start overflow-hidden ${
          isOpen ? "translate-x-full" : "translate-x-0"
        }`}
        style={{
          backgroundImage: `linear-gradient(to left, rgba(20, 13, 7, 0.92), rgba(38, 24, 14, 0.82)), url('/assets/illustrations/royal_door_closed.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >
        {/* Right inner ornamental border */}
        <div className="absolute inset-y-4 left-3 w-[85%] border-y border-r border-[#D4AF37]/30 rounded-r-2xl pointer-events-none" />
        <div className="ml-6 opacity-40 hidden sm:block">
          <div className="w-16 h-48 border-l-2 border-dashed border-[#D4AF37]/40" />
        </div>
      </div>

      {/* CENTER MONOGRAM SEAL & INVITATION CARD (ANIMATES OUT ON CLICK) */}
      <div
        className={`relative z-20 max-w-sm sm:max-w-md w-[90%] mx-auto text-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isOpen ? "scale-90 opacity-0 -translate-y-12" : "scale-100 opacity-100 translate-y-0"
        }`}
      >
        {/* Royal Arch Card Container */}
        <div className="relative p-7 sm:p-9 rounded-3xl bg-[#1B140E]/95 border-2 border-[#D4AF37] shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md">
          {/* Subtle Corner Accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ECC880]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ECC880]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ECC880]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ECC880]" />

          {/* Religious Opening Symbol */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1px] bg-[#D4AF37]/60" />
            <span className="text-[11px] font-cinzel tracking-[0.25em] text-[#ECC880] uppercase">
              SHREE GANESHAYA NAMAHA
            </span>
            <span className="w-6 h-[1px] bg-[#D4AF37]/60" />
          </div>

          {/* Monogram Seal */}
          <div className="mx-auto my-4 w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#8C682A] via-[#ECC880] to-[#8C682A] shadow-xl flex items-center justify-center relative group">
            <div className="w-full h-full rounded-full bg-[#140D07] flex flex-col items-center justify-center border border-[#ECC880]/40">
              <span className="font-cinzel text-2xl font-bold tracking-tight text-gold-gradient">
                RS
              </span>
              <span className="text-[8px] font-sans text-stone-300 tracking-widest uppercase">
                WEDDING
              </span>
            </div>
            {/* Pulsing ring */}
            <div className="absolute -inset-1 rounded-full border border-[#D4AF37]/30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          </div>

          {/* Invitation Invitation Intro */}
          <p className="font-marcellus text-xs uppercase tracking-[0.2em] text-[#D4AF37]/90 mb-1">
            Together with our families
          </p>

          {/* Couple Names */}
          <h1 className="font-script text-4xl sm:text-5xl text-[#F9EBD7] drop-shadow-md my-2">
            Ruchika & Sanyam
          </h1>

          <p className="font-marcellus text-xs sm:text-sm text-stone-300 tracking-wider mb-2">
            Request the pleasure of your company
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-[1px] w-10 bg-[#D4AF37]/40" />
            <span className="text-xs font-cinzel text-[#ECC880] tracking-widest font-semibold">
              #tereSAngRUh
            </span>
            <span className="h-[1px] w-10 bg-[#D4AF37]/40" />
          </div>

          <p className="text-[11px] font-sans text-stone-400 uppercase tracking-widest mb-6">
            10TH – 11TH DECEMBER 2026 · KUMTA, KARNATAKA
          </p>

          {/* OPEN INVITATION BUTTON */}
          <button
            onClick={handleOpenClick}
            disabled={isAnimating}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#9C7532] via-[#ECC880] to-[#9C7532] text-[#160E07] font-cinzel font-bold text-sm tracking-[0.15em] shadow-[0_0_25px_rgba(236,200,128,0.4)] hover:shadow-[0_0_35px_rgba(236,200,128,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 uppercase group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#4A320F] group-hover:rotate-12 transition-transform" />
            <span>OPEN INVITATION</span>
            <Heart className="w-3.5 h-3.5 fill-[#4A320F] text-[#4A320F]" />
          </button>
        </div>
      </div>
    </div>
  );
};
