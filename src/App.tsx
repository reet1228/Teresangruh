/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Heart } from "lucide-react";
import { CurtainEnvelope } from "./components/CurtainEnvelope";
import { Navbar } from "./components/Navbar";
import { AudioPlayer } from "./components/AudioPlayer";
import { InvitationCard } from "./components/InvitationCard";
import { UnifiedEventDetails } from "./components/UnifiedEventDetails";
import { UnifiedRSVP } from "./components/UnifiedRSVP";
import { UnifiedThankYou } from "./components/UnifiedThankYou";
import { ArtworkModal } from "./components/ArtworkModal";
import { RSVPModal } from "./components/RSVPModal";
import { HostRSVPAdminModal } from "./components/HostRSVPAdminModal";

gsap.registerPlugin(ScrollTrigger);

const INVITATION_PAGES = [
  {
    id: "cover",
    pageNumber: 1,
    title: "WEDDING COVER",
    imageSrc: "/assets/optimized/page_01.webp",
    altText: "Ruchika & Sanyam Wedding Cover — #tereSAngRUh",
    caption: "Shree Ganeshaya Namaha · Ruchika weds Sanyam · 10th – 11th December 2026",
  },
  {
    id: "invitation",
    pageNumber: 2,
    title: "WEDDING INVITATION",
    imageSrc: "/assets/optimized/page_02.webp",
    altText: "Sacred Invocations & Family Invitation of Ruchika and Sanyam",
    caption: "Shree Jirawala Parshwanath Namaha · Family Blessings & Sacred Invocations",
  },
  {
    id: "celebrations",
    pageNumber: 3,
    title: "MAAYRA CEREMONY",
    imageSrc: "/assets/optimized/page_03.webp",
    altText: "Veera Maayra Bharan Aayo — Maayra Ceremony Invitation",
    caption: "Veera maayra bharan aayo · 10th December 2026 · 03:00 PM Onwards at Banquet Hall",
  },
  {
    id: "sangeet",
    pageNumber: 4,
    title: "STARLIT SYMPHONY (SANGEET)",
    imageSrc: "/assets/optimized/page_04.webp",
    altText: "Starlit Symphony Sangeet Invitation",
    caption: "Starlit Symphony · 10th December 2026 · 07:00 PM Onwards at Beach Deck",
  },
  {
    id: "carnival",
    pageNumber: 5,
    title: "LOVE FIESTA (CARNIVAL)",
    imageSrc: "/assets/optimized/page_05.webp",
    altText: "Love Fiesta Carnival Invitation",
    caption: "Love Fiesta · 11th December 2026 · 10:00 AM Onwards at Poolside Lawn",
  },
  {
    id: "varmala",
    pageNumber: 6,
    title: "BARAAT & VARMALA",
    imageSrc: "/assets/optimized/page_06.webp",
    altText: "Vows by the Sea — Baraat & Varmala Invitation",
    caption: "Vows by the sea · 11th December 2026 · Baraat 3:00 PM · Swagat 5:00 PM · Varmala 6:00 PM",
  },
  {
    id: "reception",
    pageNumber: 7,
    title: "RECEPTION & PHERA",
    imageSrc: "/assets/optimized/page_07.webp",
    altText: "Musical Moonlight Reception & Promise of Forever Phera Invitation",
    caption: "Musical Moonlight Reception (7:00 PM) & Promise of Forever Phera (Midnight Onwards)",
  },
];

export default function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [autoPlayMusic, setAutoPlayMusic] = useState(false);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isHostAdminOpen, setIsHostAdminOpen] = useState(false);

  // Zoom / Lightbox modal for detailed view
  const [cardModalState, setCardModalState] = useState<{
    isOpen: boolean;
    pageIndex: number;
  }>({
    isOpen: false,
    pageIndex: 1,
  });

  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  // Check URL query parameters (?admin, ?host) to open host portal
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("admin") || params.has("host") || params.has("rsvp-admin")) {
        setIsHostAdminOpen(true);
      }
    } catch {}

    // Discreet keyboard shortcut: Ctrl+Shift+H or Cmd+Shift+H opens Host Portal
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "H" || e.key === "h")) {
        e.preventDefault();
        setIsHostAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Trigger when visitor clicks "OPEN INVITATION"
  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
    setAutoPlayMusic(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Replay invitation curtain animation
  const handleReplayInvitation = () => {
    setIsInvitationOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const handleOpenZoom = (pageIndex: number) => {
    setCardModalState({ isOpen: true, pageIndex });
  };

  // GSAP scroll-triggered smooth page reveals
  useEffect(() => {
    if (!isInvitationOpen) return;

    const ctx = gsap.context(() => {
      const pageCards = document.querySelectorAll(".invitation-page-section");
      pageCards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.88, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, mainContainerRef);

    return () => ctx.revert();
  }, [isInvitationOpen]);

  return (
    <div
      ref={mainContainerRef}
      className="min-h-screen bg-[#FAF7F2] text-[#2C241D] relative font-sans selection:bg-[#E8D3B9] selection:text-[#3B2C1A] overflow-x-hidden"
    >
      {/* Background Subtle Watermark Paper Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0 mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 15%, rgba(247, 236, 222, 0.7) 0%, rgba(250, 247, 242, 0.95) 100%)",
        }}
      />

      {/* Decorative Fixed Side Floral Accents (Desktop only, subtle & elegant) */}
      <div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 w-28 h-96 pointer-events-none opacity-20 z-0 select-none">
        <div className="w-full h-full border-r border-[#C9A86A]/40 rounded-r-full" />
      </div>
      <div className="hidden xl:block fixed right-4 top-1/2 -translate-y-1/2 w-28 h-96 pointer-events-none opacity-20 z-0 select-none">
        <div className="w-full h-full border-l border-[#C9A86A]/40 rounded-l-full" />
      </div>

      {/* Opening Curtain / Royal Carved Doors Envelope */}
      <CurtainEnvelope
        isOpen={isInvitationOpen}
        onOpen={handleOpenInvitation}
      />

      {/* Persistent Floating Audio Player */}
      <AudioPlayer autoPlayTrigger={autoPlayMusic} />

      {/* Floating Top Navbar with Scroll Progress */}
      <Navbar onRsvpClick={() => setIsRsvpModalOpen(true)} />

      {/* MASTER CONTINUOUS INVITATION BOOK CONTAINER */}
      <main className="relative z-10 w-full max-w-[540px] mx-auto px-3 sm:px-5 pt-20 pb-12 flex flex-col items-center">
        
        {/* INVITATION INTRO BANNER */}
        <div className="w-full text-center py-4 mb-4 animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <span className="w-6 h-[1px] bg-[#C9A86A]/60" />
            <span className="text-[10px] font-cinzel tracking-[0.25em] text-[#8C672A] font-bold uppercase">
              SHREE GANESHAYA NAMAHA
            </span>
            <span className="w-6 h-[1px] bg-[#C9A86A]/60" />
          </div>
          <h1 className="font-script text-3xl sm:text-4xl text-[#6B1B32] font-bold drop-shadow-xs">
            Ruchika &amp; Sanyam
          </h1>
          <p className="text-[10px] font-cinzel text-[#4A3828] font-bold tracking-[0.2em] uppercase mt-0.5">
            #tereSAngRUh · 10th – 11th December 2026
          </p>

          {/* Centered RSVP Button (Bigger & Prominent) */}
          <div className="mt-4 sm:mt-5 flex justify-center">
            <button
              onClick={() => setIsRsvpModalOpen(true)}
              className="px-9 py-3.5 sm:px-12 sm:py-4 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-sm sm:text-base font-bold tracking-[0.2em] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#C29E57] ring-4 ring-[#ECC880]/30 flex items-center gap-2.5 cursor-pointer"
            >
              <span>RSVP NOW</span>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#1F140A] text-[#1F140A]" />
            </button>
          </div>
        </div>

        {/* SEQUENCE OF COMPLETE ORIGINAL INVITATION PAGES (Pages 1 to 7) */}
        {INVITATION_PAGES.map((page) => (
          <InvitationCard
            key={page.id}
            id={page.id}
            pageNumber={page.pageNumber}
            totalPages={7}
            pageTitle={page.title}
            imageSrc={page.imageSrc}
            altText={page.altText}
            caption={page.caption}
            onOpenZoom={handleOpenZoom}
          />
        ))}

        {/* PAGE 8: UNIFIED EVENT DETAILS & CEREMONY TIMINGS */}
        <UnifiedEventDetails id="event-details" />

        {/* PAGE 9: AUTHENTIC RSVP & CONTACTS */}
        <UnifiedRSVP
          id="rsvp"
          onOpenRsvpModal={() => setIsRsvpModalOpen(true)}
        />

        {/* PAGE 10: FINAL GREETING & REPLAY INVITATION */}
        <UnifiedThankYou
          id="thank-you"
          onReplayInvitation={handleReplayInvitation}
          onOpenHostAdmin={() => setIsHostAdminOpen(true)}
        />
      </main>

      {/* Lightbox Modal for Viewing Individual Cards in Zoom */}
      <ArtworkModal
        isOpen={cardModalState.isOpen}
        pageIndex={cardModalState.pageIndex}
        onClose={() => setCardModalState((prev) => ({ ...prev, isOpen: false }))}
        onPageChange={(pageIndex) => setCardModalState({ isOpen: true, pageIndex })}
      />

      {/* Interactive RSVP Form Dialog */}
      <RSVPModal
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
      />

      {/* Private Host / Admin Portal (Password-protected for host only) */}
      <HostRSVPAdminModal
        isOpen={isHostAdminOpen}
        onClose={() => setIsHostAdminOpen(false)}
      />
    </div>
  );
}
