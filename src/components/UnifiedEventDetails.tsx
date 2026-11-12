import React from "react";
import { Calendar, Clock, MapPin, Sparkles, Plus } from "lucide-react";
import { generateGoogleCalendarUrl, downloadIcsFile } from "../utils/calendar";

interface UnifiedEventDetailsProps {
  id?: string;
}

const CEREMONIES = [
  {
    name: "Veera maayra bharan aayo",
    subName: "MAAYRA CEREMONY",
    date: "10th December 2026",
    time: "03:00 PM Onwards",
    venue: "At Banquet Hall",
    isoStart: "2026-12-10T15:00:00+05:30",
    isoEnd: "2026-12-10T17:30:00+05:30",
  },
  {
    name: "Starlit Symphony",
    subName: "SANGEET",
    date: "10th December 2026",
    time: "07:00 PM Onwards",
    venue: "At Beach Deck",
    isoStart: "2026-12-10T19:00:00+05:30",
    isoEnd: "2026-12-10T23:30:00+05:30",
  },
  {
    name: "Love Fiesta",
    subName: "CARNIVAL",
    date: "11th December 2026",
    time: "10:00 AM Onwards",
    venue: "At Poolside Lawn",
    isoStart: "2026-12-11T10:00:00+05:30",
    isoEnd: "2026-12-11T13:30:00+05:30",
  },
  {
    name: "Vows by the sea",
    subName: "BARAAT, SWAGAT & VARMALA",
    date: "11th December 2026",
    time: "3:00 PM Baraat · 5:00 PM Swagat · 6:00 PM Varmala",
    venue: "Reception Lobby & Beachside",
    isoStart: "2026-12-11T15:00:00+05:30",
    isoEnd: "2026-12-11T18:30:00+05:30",
  },
  {
    name: "Musical Moonlight",
    subName: "RECEPTION",
    date: "11th December 2026",
    time: "7:00 PM Onwards",
    venue: "At Poolside",
    isoStart: "2026-12-11T19:00:00+05:30",
    isoEnd: "2026-12-11T23:00:00+05:30",
  },
  {
    name: "Promise of Forever",
    subName: "PHERA",
    date: "11th December 2026",
    time: "Midnight – 3:00 AM Onwards",
    venue: "At Poolside Mantap",
    isoStart: "2026-12-12T00:00:00+05:30",
    isoEnd: "2026-12-12T03:30:00+05:30",
  },
];

export const UnifiedEventDetails: React.FC<UnifiedEventDetailsProps> = ({ id = "event-details" }) => {
  const handleAddAllToCalendar = () => {
    const url = generateGoogleCalendarUrl(
      "Ruchika & Sanyamji Wedding Celebration (#tereSAngRUh)",
      "Official Wedding Celebration of Ruchika & Sanyamji at Dennisons Beach Resort, Kumta, Karnataka.\nEvents: Maayra, Sangeet, Carnival, Varmala, Reception, and Sacred Pheras.",
      "Dennisons Beach Resort, Kumta, Karnataka 581343",
      "2026-12-10T15:00:00+05:30",
      "2026-12-12T04:00:00+05:30"
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadIcs = () => {
    downloadIcsFile(
      "Ruchika & Sanyamji Wedding (#tereSAngRUh)",
      "Official Wedding Celebration of Ruchika & Sanyamji at Dennisons Beach Resort, Kumta, Karnataka.",
      "Dennisons Beach Resort, Kumta, Karnataka 581343",
      "2026-12-10T15:00:00+05:30",
      "2026-12-12T04:00:00+05:30",
      "Ruchika_Sanyamji_Wedding.ics"
    );
  };

  return (
    <div id={id} className="invitation-page-section relative w-full flex flex-col items-center justify-center py-6 sm:py-10">
      {/* Page Header */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-3 max-w-[480px]">
        <span className="text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-[0.25em] text-[#8C672A] uppercase">
          WEDDING ITINERARY
        </span>
        <span className="text-[10px] font-cinzel text-stone-500 tracking-widest tabular-nums">
          EVENT DETAILS
        </span>
      </div>

      {/* Unified Wedding Invitation Card Container */}
      <div className="w-full max-w-[480px] rounded-2xl sm:rounded-3xl bg-[#FFFDF9] border border-[#DFC9A9] shadow-[0_16px_45px_rgba(50,38,28,0.1)] p-5 sm:p-7">
        
        {/* Inner Card Frame */}
        <div className="border border-[#D4AF37]/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 bg-[#FAF7F2] text-center relative overflow-hidden">
          
          {/* Corner gold ornaments */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C9A86A]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C9A86A]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C9A86A]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C9A86A]" />

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center gap-2 text-[10px] font-cinzel font-semibold tracking-[0.2em] text-[#8C672A] uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>DENNISONS BEACH RESORT, KUMTA</span>
              <Sparkles className="w-3 h-3" />
            </div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#352516] tracking-tight">
              Ceremonies &amp; Timings
            </h3>
            <p className="font-marcellus text-xs font-bold text-[#5A4533] mt-1 tracking-wider">
              10th – 11th December 2026
            </p>
          </div>

          {/* List of all events in unified format */}
          <div className="space-y-4 text-left">
            {CEREMONIES.map((ceremony, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#EADBCE] shadow-xs hover:border-[#C9A86A] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-script text-2xl sm:text-3xl font-bold text-[#6B1B32] leading-tight">
                      {ceremony.name}
                    </h4>
                    <span className="block text-[10px] font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase mt-0.5">
                      {ceremony.subName}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const url = generateGoogleCalendarUrl(
                        `${ceremony.name} (${ceremony.subName})`,
                        `Wedding celebration of Ruchika & Sanyamji #tereSAngRUh at ${ceremony.venue}.`,
                        `${ceremony.venue}, Dennisons Beach Resort, Kumta, Karnataka`,
                        ceremony.isoStart,
                        ceremony.isoEnd
                      );
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                    className="p-1.5 rounded-lg border border-[#D9C4A7] text-[#8C672A] hover:bg-[#FAF4EB] transition-colors shrink-0"
                    title="Add to Google Calendar"
                    aria-label={`Add ${ceremony.name} to calendar`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#F2E7DC] flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-marcellus font-bold text-[#453424]">
                  <div className="flex items-center gap-1 font-bold text-[#8C672A]">
                    <Clock className="w-3 h-3" />
                    <span>{ceremony.time}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold">
                    <Calendar className="w-3 h-3 text-[#A88C65]" />
                    <span>{ceremony.date}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3 text-[#A88C65]" />
                    <span>{ceremony.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Calendar Export */}
          <div className="mt-6 pt-5 border-t border-[#EDE1D2] flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={handleAddAllToCalendar}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#3B291A] text-[#FAF7F2] font-cinzel text-xs font-semibold tracking-wider hover:bg-[#523A25] transition-colors shadow-xs"
            >
              Add All to Google Calendar
            </button>
            <button
              onClick={handleDownloadIcs}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-white border border-[#D9C4A7] text-[#4A3828] font-cinzel text-xs font-semibold tracking-wider hover:bg-[#FAF4EB] transition-colors shadow-xs"
            >
              Download .ICS (Apple)
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Botanical Divider */}
      <div className="my-6 sm:my-8 flex items-center justify-center gap-3 opacity-40">
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
        <span className="text-[11px] font-cinzel text-[#8C672A]">❦</span>
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A86A] to-transparent" />
      </div>
    </div>
  );
};
