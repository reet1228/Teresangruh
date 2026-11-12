import React, { useState, useEffect } from "react";
import { WEDDING_DATA } from "../data/weddingData";

interface NavbarProps {
  onRsvpClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRsvpClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Gold Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#BA9045] via-[#ECC880] to-[#BA9045] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (1 Action) */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DCCB] shadow-sm py-3"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <a
            href="#cover"
            className="text-base sm:text-lg font-cinzel font-bold tracking-wider text-[#352516] whitespace-nowrap shrink-0 hover:text-[#916E34] transition-colors"
          >
            Ruchika &amp; Sanyamji
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden sm:flex items-center gap-6 text-[11px] tracking-[0.2em] uppercase font-marcellus text-[#5C4A3A]">
            <a href="#cover" className="hover:text-[#916E34] transition-colors whitespace-nowrap shrink-0">
              Cover
            </a>
            <a href="#invitation" className="hover:text-[#916E34] transition-colors whitespace-nowrap shrink-0">
              Invite
            </a>
            <a href="#celebrations" className="hover:text-[#916E34] transition-colors whitespace-nowrap shrink-0">
              Ceremonies
            </a>
            <a href="#event-details" className="hover:text-[#916E34] transition-colors whitespace-nowrap shrink-0">
              Itinerary
            </a>
            <a href="#rsvp" className="hover:text-[#916E34] transition-colors whitespace-nowrap shrink-0">
              RSVP
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRsvpClick}
              className="px-4 py-1.5 text-xs font-cinzel font-semibold tracking-wider text-[#1F140A] bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] rounded-full hover:shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 border border-[#C29E57]"
            >
              RSVP
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
