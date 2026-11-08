import React from "react";
import { Maximize2 } from "lucide-react";

interface InvitationCardProps {
  id: string;
  pageNumber: number;
  totalPages?: number;
  pageTitle: string;
  imageSrc: string;
  altText: string;
  onOpenZoom?: (pageIndex: number) => void;
  caption?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  id,
  pageNumber,
  totalPages = 7,
  pageTitle,
  imageSrc,
  altText,
  onOpenZoom,
  caption,
}) => {
  return (
    <div
      id={id}
      className="invitation-page-section relative w-full flex flex-col items-center justify-center py-6 sm:py-10"
    >
      {/* Page Label & Number Header (Quiet, elegant editorial typography) */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-3 max-w-[480px]">
        <span className="text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-[0.25em] text-[#8C672A] uppercase">
          {pageTitle}
        </span>
        <span className="text-[10px] font-cinzel text-stone-500 tracking-widest tabular-nums">
          PAGE {pageNumber} OF {totalPages}
        </span>
      </div>

      {/* Main Luxury Invitation Card Container */}
      <div className="group relative w-full max-w-[480px] rounded-2xl sm:rounded-3xl bg-[#FFFDF9] border border-[#DFC9A9] shadow-[0_16px_45px_rgba(50,38,28,0.1)] p-2 sm:p-2.5 transition-all duration-500 hover:shadow-[0_22px_60px_rgba(50,38,28,0.16)]">
        
        {/* Inner Gold Foil Hairline Frame */}
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#FAF7F2]">
          
          {/* Subtle Corner Accents */}
          <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#C9A86A]/70 z-10 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#C9A86A]/70 z-10 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#C9A86A]/70 z-10 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#C9A86A]/70 z-10 pointer-events-none" />

          {/* Full Original Artwork (Strictly uncropped, object-contain, natural aspect ratio preserved) */}
          <div className="relative w-full aspect-[9/16] bg-[#FAF7F2] flex items-center justify-center">
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-contain block select-none pointer-events-none"
              loading={pageNumber <= 2 ? "eager" : "lazy"}
            />

            {/* Hover/Tap Zoom Trigger */}
            {onOpenZoom && (
              <button
                onClick={() => onOpenZoom(pageNumber)}
                className="absolute bottom-3 right-3 p-2 rounded-full bg-[#181109]/80 backdrop-blur-sm text-[#ECC880] border border-[#ECC880]/40 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-black cursor-pointer"
                title="View Full Screen Card"
                aria-label={`View full size ${pageTitle}`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {caption && (
          <p className="text-xs sm:text-sm font-marcellus font-bold text-[#382618] text-center mt-3 px-3 tracking-wide leading-relaxed">
            {caption}
          </p>
        )}
      </div>

      {/* Subtle Botanical Divider between Pages */}
      <div className="my-6 sm:my-8 flex items-center justify-center gap-3 opacity-40">
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
        <span className="text-[11px] font-cinzel text-[#8C672A]">❦</span>
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
      </div>
    </div>
  );
};
