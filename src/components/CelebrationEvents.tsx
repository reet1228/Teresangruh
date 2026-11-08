import React, { useState } from "react";
import { Calendar, Clock, MapPin, Sparkles, Shirt, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { WEDDING_DATA, WeddingEvent } from "../data/weddingData";
import { generateGoogleCalendarUrl } from "../utils/calendar";

interface CelebrationEventsProps {
  onOpenCardModal: (pageIndex: number) => void;
}

export const CelebrationEvents: React.FC<CelebrationEventsProps> = ({ onOpenCardModal }) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>("maayra");

  const toggleExpand = (id: string) => {
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  const getPageIndexForEvent = (eventId: string): number => {
    switch (eventId) {
      case "maayra":
        return 3;
      case "sangeet":
        return 4;
      case "carnival":
        return 5;
      case "varmala":
        return 6;
      case "reception_phera":
        return 7;
      default:
        return 1;
    }
  };

  return (
    <section id="celebrations" className="py-24 px-4 sm:px-6 bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADBC7]/50 text-[#8C672A] text-xs font-cinzel font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WEDDING CELEBRATIONS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#342416] font-bold tracking-tight">
            Events &amp; Ceremonies
          </h2>
          <p className="font-marcellus text-sm sm:text-base text-[#6E5947] tracking-wider mt-3">
            Join us in commemorating our traditions, joyous dances, and sacred vows across two magical days.
          </p>
        </div>

        {/* Event Cards Grid / Stack */}
        <div className="space-y-16">
          {WEDDING_DATA.events.map((event, index) => {
            const isExpanded = expandedEventId === event.id;
            const pageIndex = getPageIndexForEvent(event.id);
            const isDarkTheme = event.id === "sangeet" || event.id === "reception_phera";

            return (
              <div
                key={event.id}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-[0_12px_45px_rgba(0,0,0,0.08)] ${
                  isDarkTheme
                    ? "bg-[#0D1525] text-white border-[#2A3B5C]"
                    : "bg-white text-[#2C2117] border-[#E8DCDB]"
                }`}
              >
                {/* Event Container: Split Desktop 2-Column */}
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  
                  {/* Left Column: Original Artwork Showcase */}
                  <div className="lg:col-span-5 relative group overflow-hidden bg-black/5 min-h-[340px] sm:min-h-[420px] flex items-center justify-center p-4 sm:p-6">
                    <img
                      src={event.artwork}
                      alt={event.title}
                      className="max-h-[440px] w-auto max-w-full object-contain rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />

                    {/* Quick Lightbox Trigger overlay */}
                    <button
                      onClick={() => onOpenCardModal(pageIndex)}
                      className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-[#181109]/85 backdrop-blur-md text-[#ECC880] text-xs font-cinzel font-medium tracking-wider flex items-center gap-1.5 shadow-lg hover:bg-black transition-colors"
                      title="Enlarge Original Invitation"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ECC880]" />
                      <span>Original Card</span>
                    </button>
                  </div>

                  {/* Right Column: Event Content & Schedule */}
                  <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                      {/* Ceremony Category Badge */}
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span
                          className={`text-[11px] font-cinzel font-bold tracking-[0.2em] uppercase px-3.5 py-1 rounded-full border ${
                            isDarkTheme
                              ? "bg-[#1E293B] text-[#E5C885] border-[#3B4D6E]"
                              : "bg-[#FDF2F0] text-[#9E3E53] border-[#F2D7DD]"
                          }`}
                        >
                          {event.ceremonyName}
                        </span>

                        <span className={`text-xs font-marcellus tracking-wider ${isDarkTheme ? "text-stone-400" : "text-stone-500"}`}>
                          Day {index < 2 ? "1" : "2"}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3
                        className={`font-script text-4xl sm:text-5xl leading-tight my-2 ${
                          isDarkTheme ? "text-[#E6C687]" : "text-[#6B1B32]"
                        }`}
                      >
                        {event.title}
                      </h3>

                      {event.subTitle && (
                        <p className={`text-xs sm:text-sm font-marcellus tracking-wider mb-4 ${isDarkTheme ? "text-stone-300" : "text-[#614F3D]"}`}>
                          {event.subTitle}
                        </p>
                      )}

                      {/* Event Meta Badges: Date, Time, Venue */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
                        <div className={`flex items-center gap-2.5 p-3 rounded-2xl border ${
                          isDarkTheme ? "bg-white/5 border-white/10" : "bg-[#FAF7F2] border-[#EADBCE]"
                        }`}>
                          <Calendar className="w-4 h-4 text-[#C9A86A] shrink-0" />
                          <div className="text-left">
                            <span className="block text-[10px] uppercase tracking-wider font-cinzel opacity-70">Date</span>
                            <span className="text-xs font-marcellus font-semibold">{event.date}</span>
                          </div>
                        </div>

                        <div className={`flex items-center gap-2.5 p-3 rounded-2xl border ${
                          isDarkTheme ? "bg-white/5 border-white/10" : "bg-[#FAF7F2] border-[#EADBCE]"
                        }`}>
                          <Clock className="w-4 h-4 text-[#C9A86A] shrink-0" />
                          <div className="text-left">
                            <span className="block text-[10px] uppercase tracking-wider font-cinzel opacity-70">Time</span>
                            <span className="text-xs font-marcellus font-semibold">{event.time}</span>
                          </div>
                        </div>

                        <div className={`flex items-center gap-2.5 p-3 rounded-2xl border sm:col-span-2 ${
                          isDarkTheme ? "bg-white/5 border-white/10" : "bg-[#FAF7F2] border-[#EADBCE]"
                        }`}>
                          <MapPin className="w-4 h-4 text-[#C9A86A] shrink-0" />
                          <div className="text-left">
                            <span className="block text-[10px] uppercase tracking-wider font-cinzel opacity-70">Venue</span>
                            <span className="text-xs font-marcellus font-semibold">{event.venue} — Dennisons Beach Resort</span>
                          </div>
                        </div>

                        {event.dressCode && (
                          <div className={`flex items-center gap-2.5 p-3 rounded-2xl border sm:col-span-2 ${
                            isDarkTheme ? "bg-white/5 border-white/10" : "bg-[#FAF7F2] border-[#EADBCE]"
                          }`}>
                            <Shirt className="w-4 h-4 text-[#C9A86A] shrink-0" />
                            <div className="text-left">
                              <span className="block text-[10px] uppercase tracking-wider font-cinzel opacity-70">Dress Code</span>
                              <span className="text-xs font-marcellus font-medium">{event.dressCode}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className={`text-xs sm:text-sm font-sans leading-relaxed my-4 ${
                        isDarkTheme ? "text-stone-300" : "text-[#544434]"
                      }`}>
                        {event.description}
                      </p>

                      {/* Expandable Schedule Agenda */}
                      {event.schedule && (
                        <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                          <button
                            onClick={() => toggleExpand(event.id)}
                            className={`w-full flex items-center justify-between text-xs font-cinzel font-semibold tracking-wider py-2 transition-colors ${
                              isDarkTheme ? "text-[#E6C687] hover:text-white" : "text-[#7D5A2B] hover:text-[#4A3215]"
                            }`}
                          >
                            <span>Detailed Ceremony Timeline</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {isExpanded && (
                            <div className="space-y-2 mt-2 pt-2">
                              {event.schedule.map((item, sIdx) => (
                                <div
                                  key={sIdx}
                                  className={`flex items-start gap-3 p-2.5 rounded-xl text-xs ${
                                    isDarkTheme ? "bg-white/5" : "bg-[#FAF7F2]"
                                  }`}
                                >
                                  <span className="font-cinzel font-bold text-[#C9A86A] shrink-0 whitespace-nowrap">
                                    {item.time}
                                  </span>
                                  <div className="flex-1">
                                    <span className="font-medium block">{item.activity}</span>
                                    <span className="text-[11px] opacity-70 block">{item.location}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          const url = generateGoogleCalendarUrl(
                            `${event.title} - Ruchika & Sanyam Wedding`,
                            `${event.title} (${event.ceremonyName}) at ${event.venue}.\n#tereSAngRUh Wedding`,
                            `${event.venue}, Dennisons Beach Resort, Kumta, Karnataka`,
                            event.isoDate,
                            event.isoDate
                          );
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-cinzel font-semibold tracking-wider transition-all shadow-sm ${
                          isDarkTheme
                            ? "bg-[#E6C687] text-[#140E08] hover:bg-[#F2D79D]"
                            : "bg-[#3B291A] text-[#FAF7F2] hover:bg-[#523A25]"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Add Event to Calendar</span>
                      </button>

                      <button
                        onClick={() => onOpenCardModal(pageIndex)}
                        className={`text-xs font-cinzel tracking-wider underline underline-offset-4 ${
                          isDarkTheme ? "text-stone-300 hover:text-white" : "text-[#7D5A2B] hover:text-black"
                        }`}
                      >
                        View Full Card ({event.ceremonyName})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
