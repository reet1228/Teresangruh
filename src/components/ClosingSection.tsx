import React from "react";
import { RotateCcw, Share2, Heart, ArrowUp } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface ClosingSectionProps {
  onReplayInvitation: () => void;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ onReplayInvitation }) => {
  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      `Join us in celebrating the wedding of Ruchika & Sanyam (#tereSAngRUh) on 10th - 11th December 2026 at Dennisons Beach Resort, Kumta, Karnataka!\nView the digital invitation: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-24 px-4 sm:px-6 bg-[#160F09] text-white overflow-hidden text-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-[#312013]/60 via-[#160F09] to-[#120B06] pointer-events-none" />

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Monogram Seal */}
        <div className="w-20 h-20 rounded-full mx-auto mb-6 p-[1.5px] bg-gradient-to-tr from-[#916E34] via-[#ECC880] to-[#916E34] flex items-center justify-center shadow-2xl">
          <div className="w-full h-full rounded-full bg-[#1A120B] flex flex-col items-center justify-center border border-[#ECC880]/30">
            <span className="font-cinzel text-xl font-bold text-gold-gradient">
              RS
            </span>
          </div>
        </div>

        {/* Closing Quote */}
        <p className="font-marcellus text-xs uppercase tracking-[0.25em] text-[#ECC880] mb-3">
          {WEDDING_DATA.closingMessage.quote}
        </p>

        <h3 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#FAF7F2] tracking-wide mb-6 leading-relaxed">
          &ldquo;{WEDDING_DATA.closingMessage.main}&rdquo;
        </h3>

        <div className="my-6">
          <p className="font-script text-4xl sm:text-5xl text-[#ECC880]">
            With love, Ruchika &amp; Sanyam
          </p>
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/5 border border-[#ECC880]/30 text-xs font-cinzel font-bold text-[#ECC880] tracking-widest">
            {WEDDING_DATA.couple.hashtag}
          </div>
        </div>

        {/* Action Buttons: Replay & Share */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onReplayInvitation}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-xs font-bold tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Invitation Opening</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-cinzel text-xs font-bold tracking-wider hover:bg-[#1EBE5D] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-stone-300 hover:text-white text-xs font-cinzel font-semibold tracking-wider transition-colors"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
            <span>Top</span>
          </button>
        </div>

        {/* Footer Credit & Traditional Blessing */}
        <div className="mt-16 pt-8 border-t border-white/10 text-[11px] font-sans text-stone-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <span>Celebrating with love &amp; gratitude</span>
            <Heart className="w-3 h-3 text-[#E8A598] fill-[#E8A598]" />
          </p>
          <p>© 2026 Ruchika &amp; Sanyam · All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};
