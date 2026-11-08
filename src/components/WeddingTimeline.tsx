import React from "react";
import { Sparkles, Clock, MapPin } from "lucide-react";

interface TimelineEntry {
  day: string;
  date: string;
  time: string;
  title: string;
  ceremony: string;
  venue: string;
  iconTag: string;
  highlight?: boolean;
}

const TIMELINE_DATA: TimelineEntry[] = [
  {
    day: "Day 1",
    date: "10th December 2026",
    time: "03:00 PM Onwards",
    title: "Veera maayra bharan aayo",
    ceremony: "MAAYRA CEREMONY",
    venue: "Banquet Hall",
    iconTag: "Lotus Blessings",
  },
  {
    day: "Day 1",
    date: "10th December 2026",
    time: "07:00 PM Onwards",
    title: "Starlit Symphony",
    ceremony: "SANGEET & COCKTAIL",
    venue: "Beach Deck",
    iconTag: "Music & Stars",
  },
  {
    day: "Day 2",
    date: "11th December 2026",
    time: "10:00 AM Onwards",
    title: "Love Fiesta",
    ceremony: "CARNIVAL BRUNCH",
    venue: "Poolside Lawn",
    iconTag: "Poolside Sunshine",
  },
  {
    day: "Day 2",
    date: "11th December 2026",
    time: "03:00 PM",
    title: "Baraat Procession",
    ceremony: "ROYAL BARAAT",
    venue: "Reception Lobby",
    iconTag: "Dhol & Celebrations",
  },
  {
    day: "Day 2",
    date: "11th December 2026",
    time: "05:00 PM",
    title: "Baraat Swagat",
    ceremony: "TRADITIONAL SWAGAT",
    venue: "Beachside Entrance",
    iconTag: "Warm Welcomes",
  },
  {
    day: "Day 2",
    date: "11th December 2026",
    time: "06:00 PM",
    title: "Vows by the sea",
    ceremony: "VARMALA CEREMONY",
    venue: "Beachside Mandap",
    iconTag: "Garland Exchange",
    highlight: true,
  },
  {
    day: "Day 2",
    date: "11th December 2026",
    time: "07:00 PM Onwards",
    title: "Musical Moonlight",
    ceremony: "WEDDING RECEPTION",
    venue: "Poolside",
    iconTag: "Royal Dinner",
  },
  {
    day: "Day 2",
    date: "11th December 2026",
    time: "Midnight - 03:00 AM",
    title: "Promise of Forever",
    ceremony: "SACRED PHERAS",
    venue: "Poolside Mantap",
    iconTag: "Seven Sacred Vows",
    highlight: true,
  },
];

export const WeddingTimeline: React.FC = () => {
  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 bg-[#FAF7F2] relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADBC7]/50 text-[#8C672A] text-xs font-cinzel font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ORDER OF EVENTS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#342416] font-bold tracking-tight">
            Wedding Itinerary
          </h2>
          <p className="font-marcellus text-sm sm:text-base text-[#6E5947] tracking-wider mt-3">
            A chronological guide to our festivities, processions, and holy rituals.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line (hidden on mobile, centered on desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#E0D0BA] via-[#BA9045] to-[#E0D0BA]" />

          {/* Left Vertical Line on mobile */}
          <div className="md:hidden absolute left-5 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#E0D0BA] via-[#BA9045] to-[#E0D0BA]" />

          {/* Timeline Nodes */}
          <div className="space-y-10 sm:space-y-12">
            {TIMELINE_DATA.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className="relative flex flex-col md:flex-row items-start md:items-center"
                >
                  {/* Desktop Left Side */}
                  <div
                    className={`hidden md:block w-1/2 pr-12 text-right ${
                      isEven ? "" : "invisible"
                    }`}
                  >
                    {isEven && (
                      <div className="p-6 rounded-2xl bg-white border border-[#E9DDCF] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                        <div className="inline-block text-[10px] font-cinzel font-bold text-[#916E34] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FAF2E6] mb-2">
                          {item.day} · {item.date}
                        </div>
                        <h4 className="font-script text-3xl text-[#6B1B32]">{item.title}</h4>
                        <p className="font-cinzel text-xs font-bold tracking-widest text-[#2E1E12] uppercase mt-1">
                          {item.ceremony}
                        </p>
                        <div className="flex items-center justify-end gap-3 text-xs font-marcellus text-[#634E3C] mt-3">
                          <span className="flex items-center gap-1 font-semibold text-[#8C672A]">
                            <Clock className="w-3.5 h-3.5" />
                            {item.time}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.venue}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Marker Node in Center */}
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-md bg-white transition-transform hover:scale-110 ${
                        item.highlight
                          ? "border-[#B88E3E] ring-4 ring-[#F4E4CB]"
                          : "border-[#C9A86A]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${
                          item.highlight ? "bg-[#B88E3E]" : "bg-[#8C672A]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Desktop Right Side / Mobile Card */}
                  <div
                    className={`w-full md:w-1/2 pl-14 md:pl-12 text-left ${
                      !isEven ? "" : "md:invisible"
                    }`}
                  >
                    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E9DDCF] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
                      <div className="inline-block text-[10px] font-cinzel font-bold text-[#916E34] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FAF2E6] mb-2">
                        {item.day} · {item.date}
                      </div>
                      <h4 className="font-script text-3xl text-[#6B1B32]">{item.title}</h4>
                      <p className="font-cinzel text-xs font-bold tracking-widest text-[#2E1E12] uppercase mt-1">
                        {item.ceremony}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-marcellus text-[#634E3C] mt-3">
                        <span className="flex items-center gap-1 font-semibold text-[#8C672A]">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.venue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
