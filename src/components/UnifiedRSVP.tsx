import React from "react";
import { Phone, MessageCircle, Heart } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface UnifiedRSVPProps {
  id?: string;
  onOpenRsvpModal: () => void;
}

export const UnifiedRSVP: React.FC<UnifiedRSVPProps> = ({ id = "rsvp", onOpenRsvpModal }) => {
  const { familySections } = WEDDING_DATA;

  const handleWhatsApp = (phone: string, name: string) => {
    const text = encodeURIComponent(
      `Namaste ${name} ji, I have received the wedding invitation of Ruchika & Sanyam (#tereSAngRUh). I am pleased to confirm our attendance to bless the couple!`
    );
    window.open(`https://wa.me/91${phone.replace(/\D/g, "")}?text=${text}`, "_blank");
  };

  return (
    <div id={id} className="invitation-page-section relative w-full flex flex-col items-center justify-center py-6 sm:py-10">
      {/* Page Header */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-3 max-w-[480px]">
        <span className="text-[10px] sm:text-[11px] font-cinzel font-semibold tracking-[0.25em] text-[#8C672A] uppercase">
          KINDLY RESPOND
        </span>
        <span className="text-[10px] font-cinzel text-stone-500 tracking-widest tabular-nums">
          RSVP &amp; CONTACTS
        </span>
      </div>

      {/* Main Luxury Card Container */}
      <div className="w-full max-w-[480px] rounded-2xl sm:rounded-3xl bg-[#FFFDF9] border border-[#DFC9A9] shadow-[0_16px_45px_rgba(50,38,28,0.1)] p-5 sm:p-7">
        
        {/* Inner Card Frame */}
        <div className="border border-[#D4AF37]/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 bg-[#FAF7F2] text-center relative overflow-hidden">
          
          {/* Subtle Corner Accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C9A86A]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C9A86A]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C9A86A]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C9A86A]" />

          {/* Section Heading */}
          <div className="mb-6">
            <span className="text-[10px] font-cinzel font-bold text-[#8C672A] tracking-[0.25em] uppercase block mb-1">
              : RSVP :
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#352516]">
              Awaiting Your Presence
            </h3>
            <p className="font-marcellus text-xs font-bold text-[#5A4533] mt-1 tracking-wider">
              Kindly confirm your presence with our family coordinators
            </p>
          </div>

          {/* Contact Cards with Call and WhatsApp Buttons */}
          <div className="space-y-3 text-left">
            {familySections.rsvpContacts.map((contact, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#EADBCE] flex items-center justify-between gap-3 shadow-xs hover:border-[#C9A86A] transition-colors"
              >
                <div>
                  <span className="font-cinzel text-xs font-bold text-[#352516] tracking-wider block">
                    {contact.name}
                  </span>
                  <span className="text-xs font-sans font-bold text-stone-700 block mt-0.5">
                    {contact.formattedPhone}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 rounded-lg bg-[#FAF4EB] border border-[#DECDB8] text-[#5C4530] hover:bg-[#F2E5D5] transition-colors"
                    title={`Call ${contact.name}`}
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9C7532]" />
                  </a>
                  <button
                    onClick={() => handleWhatsApp(contact.phone, contact.name)}
                    className="p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors shadow-xs"
                    title={`WhatsApp ${contact.name}`}
                    aria-label={`WhatsApp message to ${contact.name}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Online RSVP Button */}
          <div className="mt-5 pt-4 border-t border-[#EDE1D2]">
            <button
              onClick={onOpenRsvpModal}
              className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-xs font-bold tracking-wider hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all border border-[#C29E57] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Confirm Attendance Online</span>
              <Heart className="w-3.5 h-3.5 fill-[#1F140A]" />
            </button>
          </div>

          {/* Special Invites & Mithi Manwar in traditional style */}
          <div className="mt-6 pt-5 border-t border-[#EDE1D2] text-[11px] font-marcellus font-bold text-[#4F3D2E] space-y-2 uppercase tracking-wider">
            <div>
              <span className="font-cinzel font-bold text-[#8C672A] block text-[10px] mb-0.5">
                : SPECIAL INVITES :
              </span>
              <p className="font-bold">Smt. Pushpa - Suryakant ji · Smt. Sajjan - Bhupendra ji</p>
              <p className="font-bold">Smt. Damayanthi - Prashant ji · Smt. Renuka - Jitesh ji</p>
            </div>

            <div className="pt-2">
              <span className="font-cinzel font-bold text-[#8C672A] block text-[10px] mb-0.5">
                : MITHI MANWAR :
              </span>
              <p className="font-bold text-[#6B1B32]">
                {familySections.mithiManwar.join(" · ")}
              </p>
            </div>

            <div className="pt-2 border-t border-[#F0E4D5]">
              <span className="font-cinzel font-bold text-[#8C672A] block text-[10px] mb-0.5">
                : BEST COMPLIMENTS :
              </span>
              <p className="font-bold text-[#352516]">{familySections.bestCompliments}</p>
            </div>
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
