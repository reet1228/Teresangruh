import React from "react";
import { Eye, Heart } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface InvitationMessageProps {
  onOpenCardModal: (pageIndex: number) => void;
}

export const InvitationMessage: React.FC<InvitationMessageProps> = ({ onOpenCardModal }) => {
  return (
    <section id="invitation" className="relative py-20 px-4 sm:px-6 bg-[#FAF7F2] overflow-hidden">
      {/* Decorative watercolor and arch background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "url('/assets/illustrations/invitation_bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Ornate Frame Card */}
        <div className="relative p-6 sm:p-12 rounded-3xl bg-white/85 backdrop-blur-sm border border-[#E5D7C5] shadow-[0_12px_40px_rgba(181,139,53,0.08)] text-center">
          
          {/* Subtle floral top corner accents */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-10 sm:w-16 h-[1px] bg-[#D4AF37]/50" />
            <div className="w-2 h-2 rounded-full bg-[#BA9045]" />
            <span className="w-10 sm:w-16 h-[1px] bg-[#D4AF37]/50" />
          </div>

          {/* Religious Invocations */}
          <div className="space-y-1 mb-8">
            <p className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#966F2C] uppercase">
              SHREE JIRAWALA PARSHWANATH NAMAHA
            </p>
            <p className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#966F2C] uppercase">
              SHREE MUNISUVRAT SWAMI NAMAHA
            </p>
            <p className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#966F2C] uppercase">
              SHREE AMBE MATAYA NAMAHA
            </p>
          </div>

          {/* Grandparent & Family Invitation Text */}
          <div className="space-y-3 mb-8 max-w-lg mx-auto">
            <p className="font-marcellus text-sm sm:text-base font-bold tracking-[0.1em] text-[#3D2C1C] uppercase leading-relaxed">
              {WEDDING_DATA.grandparentBlessing.inviter}
            </p>
            <p className="font-marcellus text-xs sm:text-sm text-[#614F3D] tracking-wider uppercase leading-relaxed">
              {WEDDING_DATA.grandparentBlessing.message}
            </p>
          </div>

          {/* BRIDE BLOCK */}
          <div className="my-6">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#8C672A] uppercase">
                SOU.KA.
              </span>
              <h2 className="font-script text-4xl sm:text-5xl text-[#6B1B32] drop-shadow-sm">
                Ruchika
              </h2>
            </div>
            <div className="text-[11px] sm:text-xs font-marcellus text-[#5C4837] tracking-wider space-y-1 mt-2">
              <p>[ D\o {WEDDING_DATA.brideFamilyDetails.parents} ]</p>
              <p>[ GD\o {WEDDING_DATA.brideFamilyDetails.grandparents} ]</p>
            </div>
          </div>

          {/* WITH DIVIDER */}
          <div className="my-5 flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-[#E0D0BA]" />
            <span className="font-script text-2xl sm:text-3xl text-[#9C7532] italic">
              with
            </span>
            <span className="w-12 h-[1px] bg-[#E0D0BA]" />
          </div>

          {/* GROOM BLOCK */}
          <div className="my-6">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#8C672A] uppercase">
                CHI.
              </span>
              <h2 className="font-script text-4xl sm:text-5xl text-[#6B1B32] drop-shadow-sm">
                Sanyam
              </h2>
            </div>
            <div className="text-[11px] sm:text-xs font-marcellus text-[#5C4837] tracking-wider space-y-1 mt-2">
              <p>[ S\o {WEDDING_DATA.groomFamilyDetails.parents} ]</p>
              <p>[ GS\o {WEDDING_DATA.groomFamilyDetails.grandparents} ]</p>
            </div>
          </div>

          {/* View Original Card Button */}
          <div className="mt-8 pt-6 border-t border-[#EFE5D7] flex items-center justify-center">
            <button
              onClick={() => onOpenCardModal(2)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FAF3EA] border border-[#E2D2BD] text-xs font-cinzel font-semibold tracking-wider text-[#694E34] hover:bg-[#F2E5D5] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>View Original Invitation Card (Page 2)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
