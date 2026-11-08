import React, { useState, useEffect } from "react";
import { Calendar, Download, Sparkles } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";
import { generateGoogleCalendarUrl, downloadIcsFile } from "../utils/calendar";

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(WEDDING_DATA.couple.targetDateIST).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(
      "Ruchika & Sanyam Wedding (#tereSAngRUh)",
      `Official Wedding Celebration of Ruchika & Sanyam #tereSAngRUh.\nDates: 10th - 11th December 2026\nVenue: Dennisons Beach Resort, Kumta, Karnataka`,
      "Dennisons Beach Resort, Kumta, Karnataka, India",
      "2026-12-10T15:00:00+05:30",
      "2026-12-12T04:00:00+05:30"
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadIcs = () => {
    downloadIcsFile(
      "Ruchika & Sanyam Wedding (#tereSAngRUh)",
      "Official Wedding Celebration of Ruchika & Sanyam #tereSAngRUh at Dennisons Beach Resort, Kumta, Karnataka.",
      "Dennisons Beach Resort, Kumta, Karnataka, India",
      "2026-12-10T15:00:00+05:30",
      "2026-12-12T04:00:00+05:30",
      "Ruchika_Sanyam_Wedding.ics"
    );
  };

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="relative py-20 px-4 bg-[#F5EDE1] overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#EADCC7]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#E8CDB2]/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADBC7]/60 text-[#8C672A] text-xs font-cinzel font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE COUNTDOWN BEGINS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl text-[#342416] tracking-wide font-bold">
            Until We Say &ldquo;I Do&rdquo;
          </h2>
          <p className="font-marcellus text-xs sm:text-sm text-[#6E5947] tracking-[0.2em] uppercase mt-2">
            10TH DECEMBER 2026 · KUMTA, KARNATAKA
          </p>
        </div>

        {/* Live Countdown Display */}
        {timeLeft.isPast ? (
          <div className="p-8 max-w-md mx-auto rounded-3xl bg-white/90 border border-[#D9C4A7] shadow-xl text-center">
            <h3 className="font-script text-4xl text-[#6B1B32] mb-2">Happily Married!</h3>
            <p className="font-marcellus text-sm text-[#5C4530]">
              Thank you for blessing Ruchika &amp; Sanyam with your love and presence.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto mb-10">
            {timeUnits.map((unit, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center p-5 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#E3D1BA] shadow-[0_8px_25px_rgba(181,139,53,0.1)] transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Circular Gold Accent Ring */}
                <div className="absolute -inset-[1px] rounded-3xl border border-[#D4AF37]/30 pointer-events-none group-hover:border-[#D4AF37]/70 transition-colors" />

                {/* Number with Tabular Figures */}
                <span className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#342416] tabular-nums tracking-tight">
                  {String(unit.value).padStart(2, "0")}
                </span>

                {/* Unit Label */}
                <span className="text-[10px] sm:text-xs font-marcellus font-semibold text-[#8C672A] tracking-[0.25em] mt-2 uppercase">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add to Calendar Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleAddToGoogleCalendar}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B291A] text-[#FAF7F2] font-cinzel text-xs font-semibold tracking-wider hover:bg-[#523A25] transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4 text-[#ECC880]" />
            <span>Add to Google Calendar</span>
          </button>

          <button
            onClick={handleDownloadIcs}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 border border-[#D9C4A7] text-[#4A3828] font-cinzel text-xs font-semibold tracking-wider hover:bg-white transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-[#9C7532]" />
            <span>Download .ICS File (Apple / Outlook)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
