import React from "react";
import { MapPin, Navigation, Plane, Train, Sparkles, ExternalLink } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

export const VenueSection: React.FC = () => {
  return (
    <section id="venue" className="py-24 px-4 sm:px-6 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADBC7]/50 text-[#8C672A] text-xs font-cinzel font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DESTINATION RESORT</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#342416] font-bold tracking-tight">
            The Wedding Venue
          </h2>
          <p className="font-marcellus text-sm sm:text-base text-[#6E5947] tracking-wider mt-3">
            Where golden sands meet royal celebrations on the shores of Karnataka.
          </p>
        </div>

        {/* Venue Showcase Card */}
        <div className="rounded-3xl bg-white border border-[#E9DDCF] shadow-[0_12px_45px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left side: Venue Information & Travel Info */}
            <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase mb-2">
                  <MapPin className="w-4 h-4 text-[#C9A86A]" />
                  <span>KUMTA, KARNATAKA</span>
                </div>

                <h3 className="font-cinzel text-2xl sm:text-3xl text-[#2E1E12] font-bold mb-3">
                  {WEDDING_DATA.venue.name}
                </h3>

                <p className="font-marcellus text-xs sm:text-sm text-[#7D6652] leading-relaxed mb-6">
                  {WEDDING_DATA.venue.description}
                </p>

                {/* Address block */}
                <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#EDE2D4] mb-6 text-left">
                  <span className="block text-[11px] font-cinzel font-bold text-[#916E34] uppercase tracking-wider mb-1">
                    Official Address
                  </span>
                  <p className="font-marcellus text-xs sm:text-sm text-[#453424]">
                    {WEDDING_DATA.venue.addressString}
                  </p>
                </div>

                {/* Travel guide cards */}
                <div className="space-y-3">
                  <span className="block text-[11px] font-cinzel font-bold text-[#916E34] uppercase tracking-wider">
                    How to Reach
                  </span>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#EBE0D2]">
                    <Plane className="w-4 h-4 text-[#8C672A] shrink-0 mt-0.5" />
                    <div className="text-left text-xs">
                      <span className="font-cinzel font-semibold text-[#2F1F13] block">By Air</span>
                      <span className="text-stone-600 font-sans">{WEDDING_DATA.venue.nearestAirport}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#EBE0D2]">
                    <Train className="w-4 h-4 text-[#8C672A] shrink-0 mt-0.5" />
                    <div className="text-left text-xs">
                      <span className="font-cinzel font-semibold text-[#2F1F13] block">By Train</span>
                      <span className="text-stone-600 font-sans">{WEDDING_DATA.venue.nearestStation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Get Directions */}
              <div className="mt-8 pt-6 border-t border-[#EDE1D2] flex flex-wrap items-center gap-4">
                <a
                  href={WEDDING_DATA.venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-xs font-bold tracking-wider hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#C29E57]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>

                <span className="text-xs font-marcellus text-stone-500">
                  Coordinates verified from invitation
                </span>
              </div>
            </div>

            {/* Right side: Embedded Map Preview */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full bg-stone-100 border-t lg:border-t-0 lg:border-l border-[#EDE1D2]">
              <iframe
                title="Dennisons Beach Resort Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15443.498305018612!2d74.405411!3d14.425232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbc18d1a0a5598d%3A0x67db2bcfad2aa484!2sKumta%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full min-h-[320px] border-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
