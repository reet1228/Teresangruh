import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download, Sparkles } from "lucide-react";

interface ArtworkModalProps {
  isOpen: boolean;
  pageIndex: number;
  onClose: () => void;
  onPageChange: (newPage: number) => void;
}

const PAGE_TITLES: { [key: number]: string } = {
  1: "Wedding Cover — Shree Ganeshaya Namaha",
  2: "Sacred Invocations & Family Invitation",
  3: "Veera Maayra Bharan Aayo (Maayra Ceremony)",
  4: "Starlit Symphony (Sangeet)",
  5: "Love Fiesta (Carnival)",
  6: "Vows by the Sea (Baraat & Varmala)",
  7: "Musical Moonlight & Promise of Forever (Reception & Phera)",
  8: "Divine Blessings & Vinay Vinanti",
  9: "Special Invites, Mithi Manwar & RSVP",
};

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  isOpen,
  pageIndex,
  onClose,
  onPageChange,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        if (pageIndex > 1) onPageChange(pageIndex - 1);
      }
      if (e.key === "ArrowRight") {
        if (pageIndex < 9) onPageChange(pageIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, pageIndex, onClose, onPageChange]);

  if (!isOpen) return null;

  const currentImageSrc = `/assets/optimized/page_0${pageIndex}.webp`;
  const currentTitle = PAGE_TITLES[pageIndex] || `Invitation Page ${pageIndex}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentImageSrc;
    link.download = `Ruchika_Sanyam_Wedding_Page_0${pageIndex}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl max-h-[95vh] flex flex-col rounded-3xl bg-[#1A130C] border border-[#D4AF37]/50 shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/20 bg-[#140E08]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ECC880]" />
            <span className="text-xs sm:text-sm font-cinzel font-semibold text-[#ECC880] tracking-wider truncate max-w-xs sm:max-w-md">
              {currentTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Download Original Card"
            >
              <Download className="w-4 h-4 text-[#ECC880]" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Artwork Viewer with Navigation Arrows */}
        <div className="relative flex-1 flex items-center justify-center p-4 overflow-y-auto max-h-[75vh]">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(Math.max(1, pageIndex - 1))}
            disabled={pageIndex <= 1}
            className={`absolute left-4 z-20 p-3 rounded-full bg-[#1A130C]/80 border border-[#D4AF37]/40 text-white shadow-xl hover:bg-black transition-all ${
              pageIndex <= 1 ? "opacity-30 cursor-not-allowed" : "hover:scale-110 cursor-pointer"
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 text-[#ECC880]" />
          </button>

          {/* Page Image */}
          <div className="max-w-md mx-auto my-auto flex items-center justify-center">
            <img
              src={currentImageSrc}
              alt={currentTitle}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-[#D4AF37]/30"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(Math.min(9, pageIndex + 1))}
            disabled={pageIndex >= 9}
            className={`absolute right-4 z-20 p-3 rounded-full bg-[#1A130C]/80 border border-[#D4AF37]/40 text-white shadow-xl hover:bg-black transition-all ${
              pageIndex >= 9 ? "opacity-30 cursor-not-allowed" : "hover:scale-110 cursor-pointer"
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5 text-[#ECC880]" />
          </button>
        </div>

        {/* Bottom Page Thumbnails Bar */}
        <div className="p-3 sm:p-4 bg-[#140E08] border-t border-[#D4AF37]/20 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded-full text-xs font-cinzel font-semibold transition-all whitespace-nowrap ${
                pageIndex === pageNum
                  ? "bg-gradient-to-r from-[#BA9045] to-[#ECC880] text-[#160E07] shadow-md scale-105"
                  : "bg-white/5 text-stone-400 hover:text-white hover:bg-white/10"
              }`}
            >
              Page {pageNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
