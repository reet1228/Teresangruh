import React from "react";
import { HeartHandshake, Sparkles } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

export const GiftSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-[#FAF7F2]">
      <div className="max-w-2xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E9DDCF] shadow-[0_6px_25px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
          {/* Subtle floral emblem */}
          <div className="w-12 h-12 rounded-full mx-auto mb-4 bg-[#FAF2E6] border border-[#E5D7C5] flex items-center justify-center text-[#9C7532]">
            <HeartHandshake className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-cinzel font-semibold text-[#8C672A] tracking-[0.2em] uppercase mb-2">
            <Sparkles className="w-3 h-3" />
            <span>{WEDDING_DATA.giftPolicy.title}</span>
            <Sparkles className="w-3 h-3" />
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl text-[#342416] font-bold mb-3">
            Blessings Only
          </h3>

          <p className="font-marcellus text-xs sm:text-sm text-[#635140] leading-relaxed max-w-lg mx-auto">
            {WEDDING_DATA.giftPolicy.message}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#E0D0BA]" />
            <span className="font-script text-xl text-[#8C672A]">No Boxed Gifts, Please</span>
            <span className="w-8 h-[1px] bg-[#E0D0BA]" />
          </div>
        </div>
      </div>
    </section>
  );
};
