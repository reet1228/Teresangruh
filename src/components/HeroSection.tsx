import React from "react";
import { Calendar, MapPin, Sparkles, Eye } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface HeroSectionProps {
  onOpenCardModal: (pageIndex: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenCardModal }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-between pt-24 pb-12 px-4 overflow-hidden bg-[#FAF7F2]"
    >
      {/* Subtle watercolor paper texture & floral gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 20%, rgba(247, 226, 212, 0.6) 0%, rgba(250, 247, 242, 0.9) 70%)"
        }}
      />

      {/* Top Auspicious Invocation */}
      <div className="relative z-10 text-center max-w-xl mx-auto mt-4 animate-fade-in">
        <div className="inline-flex items-center justify-center gap-3 mb-2">
          <span className="w-8 h-[1px] bg-[#C9A86A]/70" />
          <span className="text-[11px] sm:text-xs font-cinzel tracking-[0.25em] text-[#8C672A] font-semibold uppercase">
            SHREE GANESHAYA NAMAHA
          </span>
          <span className="w-8 h-[1px] bg-[#C9A86A]/70" />
        </div>
      </div>

      {/* Main Couple Emblem & Visual Card Display */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center text-center">
        {/* Monogram Artwork Wreath from Video / Page 1 */}
        <div className="relative mb-6 group cursor-pointer" onClick={() => onOpenCardModal(1)}>
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-[0_15px_35px_rgba(181,139,53,0.18)] border-4 border-[#FAF7F2] ring-2 ring-[#D4AF37]/40 transition-transform duration-500 group-hover:scale-105">
            <img
              src="/assets/illustrations/monogram_palace.jpg"
              alt="Ruchika & Sanyamji Monogram Artwork"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-[#251A10]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-cinzel tracking-wider gap-1.5">
              <Eye className="w-4 h-4 text-[#ECC880]" />
              <span>View Invite Card</span>
            </div>
          </div>
          {/* Subtle decorative gold badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#BA9045] via-[#E6C57F] to-[#BA9045] text-[#241708] text-[10px] font-cinzel font-bold tracking-[0.2em] px-4 py-1 rounded-full shadow-md whitespace-nowrap">
            WEDDING CELEBRATION
          </div>
        </div>

        {/* Couple Names */}
        <div className="mb-3">
          <p className="font-script text-5xl sm:text-6xl md:text-7xl text-[#6B1B32] tracking-wide leading-none drop-shadow-sm">
            Ruchika
          </p>
          <p className="font-marcellus text-sm sm:text-base text-[#8C6B37] tracking-[0.3em] uppercase my-1">
            WEDS
          </p>
          <p className="font-script text-5xl sm:text-6xl md:text-7xl text-[#6B1B32] tracking-wide leading-none drop-shadow-sm">
            Sanyamji
          </p>
        </div>

        {/* Wedding Hashtag */}
        <div className="my-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF0E6] border border-[#E4D1BA] shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
          <span className="font-cinzel text-xs sm:text-sm font-bold text-[#8A5A29] tracking-widest">
            {WEDDING_DATA.couple.hashtag}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
        </div>

        {/* Dates & Venue details */}
        <div className="mt-4 space-y-1.5 font-marcellus text-[#4A3B2C]">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold">
            <Calendar className="w-4 h-4 text-[#B88E3E]" />
            <span>{WEDDING_DATA.couple.datesSummary}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm tracking-[0.15em] uppercase text-[#614F3D]">
            <MapPin className="w-4 h-4 text-[#B88E3E]" />
            <span>{WEDDING_DATA.venue.name}, {WEDDING_DATA.venue.city}, {WEDDING_DATA.venue.state}</span>
          </div>
        </div>

        {/* Action Button to explore invite */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#invitation"
            className="px-6 py-2.5 rounded-full bg-[#3B291A] text-[#FAF7F2] font-cinzel text-xs tracking-[0.15em] font-semibold hover:bg-[#523A25] transition-all duration-200 shadow-md"
          >
            Read Invitation
          </a>
          <button
            onClick={() => onOpenCardModal(1)}
            className="px-5 py-2.5 rounded-full bg-white/80 border border-[#D9C4A7] text-[#5C4530] font-cinzel text-xs tracking-[0.15em] font-semibold hover:bg-[#FAF0E4] transition-all duration-200 shadow-sm flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#9C7532]" />
            <span>Original Card</span>
          </button>
        </div>
      </div>

      {/* Bottom Palace Dome & Botanical Illustration from Original Invitation */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-6 pointer-events-none">
        <img
          src="/assets/optimized/page_01.webp"
          alt="Royal Palace Archway & Flowers"
          className="w-full h-32 sm:h-44 object-cover object-bottom rounded-t-3xl opacity-90 shadow-sm mask-radial"
          style={{
            maskImage: "linear-gradient(to top, black 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 50%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
};
