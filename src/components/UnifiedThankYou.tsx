import React from "react";
import { RotateCcw, Share2, Heart, ArrowUp, Lock } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface UnifiedThankYouProps {
  id?: string;
  onReplayInvitation: () => void;
  onOpenHostAdmin?: () => void;
}

export const UnifiedThankYou: React.FC<UnifiedThankYouProps> = ({
  id = "thank-you",
  onReplayInvitation,
  onOpenHostAdmin,
}) => {
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Official Wedding Invitation — Ruchika & Sanyamji (#tereSAngRUh)\n10th – 11th December 2026 at Dennisons Beach Resort, Kumta, Karnataka.\nView the digital invitation: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id={id} className="invitation-page-section relative w-full flex flex-col items-center justify-center py-6 sm:py-10 pb-20">
      {/* Page Header */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-3 max-w-[480px]">
        <span className="text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-[0.25em] text-[#8C672A] uppercase">
          GRATITUDE &amp; BLESSINGS
        </span>
        <span className="text-[10px] font-cinzel text-stone-500 tracking-widest tabular-nums">
          FINAL GREETING
        </span>
      </div>

      {/* Main Luxury Card Container */}
      <div className="w-full max-w-[480px] rounded-2xl sm:rounded-3xl bg-[#FFFDF9] border border-[#DFC9A9] shadow-[0_16px_45px_rgba(50,38,28,0.1)] p-5 sm:p-7 text-center">
        
        {/* Inner Card Frame */}
        <div className="border border-[#D4AF37]/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-[#FAF7F2] relative overflow-hidden">
          
          {/* Corner gold ornaments */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C9A86A]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C9A86A]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C9A86A]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C9A86A]" />

          {/* Monogram Seal */}
          <div className="w-16 h-16 rounded-full mx-auto mb-4 p-[1.5px] bg-gradient-to-tr from-[#8C682A] via-[#ECC880] to-[#8C682A] shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#FAF7F2] flex flex-col items-center justify-center border border-[#ECC880]/50">
              <span className="font-cinzel text-lg font-bold text-gold-gradient">
                RS
              </span>
            </div>
          </div>

          <p className="font-marcellus text-[11px] uppercase tracking-[0.25em] text-[#8C672A] mb-2">
            WE AWAIT YOUR GRACIOUS PRESENCE
          </p>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#342416] leading-relaxed mb-4">
            &ldquo;Your presence will make our celebration even more special.&rdquo;
          </h3>

          <div className="my-5">
            <p className="font-script text-4xl sm:text-5xl text-[#6B1B32]">
              With love, Ruchika &amp; Sanyamji
            </p>
            <div className="mt-2.5 inline-block px-3.5 py-1 rounded-full bg-[#FAF0E4] border border-[#E2D0B9] text-xs font-cinzel font-bold text-[#8C672A] tracking-widest">
              {WEDDING_DATA.couple.hashtag}
            </div>
          </div>

          <p className="font-marcellus text-xs font-bold text-[#5A4533] tracking-wide mt-2">
            Dennisons Beach Resort · Kumta, Karnataka
          </p>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-[#EDE1D2] flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={onReplayInvitation}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#3B291A] text-[#FAF7F2] font-cinzel text-xs font-bold tracking-wider hover:bg-[#523A25] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Invitation</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] text-white font-cinzel text-xs font-bold tracking-wider hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-white border border-[#D9C4A7] text-[#5C4530] font-bold hover:bg-[#FAF4EB] transition-colors"
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer info & discreet host portal access */}
        <div className="mt-5 text-[11px] font-sans font-bold text-stone-500 text-center flex items-center justify-center gap-1.5">
          <span>Celebrating eternal union with blessings &amp; love</span>
          <Heart className="w-3 h-3 text-[#B88E3E] fill-[#B88E3E]" />
          {onOpenHostAdmin && (
            <button
              onClick={onOpenHostAdmin}
              className="ml-1 text-stone-400 hover:text-[#8C672A] transition-colors p-1 cursor-pointer"
              title="Host / Organizer Portal"
              aria-label="Host Portal"
            >
              <Lock className="w-3 h-3 opacity-50 hover:opacity-100" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
