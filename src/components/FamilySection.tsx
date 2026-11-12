import React from "react";
import { Phone, MessageCircle, Heart, Sparkles, Eye } from "lucide-react";
import { WEDDING_DATA } from "../data/weddingData";

interface FamilySectionProps {
  onOpenCardModal: (pageIndex: number) => void;
}

export const FamilySection: React.FC<FamilySectionProps> = ({ onOpenCardModal }) => {
  const { familySections } = WEDDING_DATA;

  const handleWhatsAppRSVP = (phone: string, contactName: string) => {
    const text = encodeURIComponent(
      `Namaste ${contactName} ji, I have received the wedding invitation of Ruchika & Sanyamji (#tereSAngRUh). I am pleased to confirm our attendance to bless the couple!`
    );
    window.open(`https://wa.me/91${phone.replace(/\D/g, "")}?text=${text}`, "_blank");
  };

  return (
    <section id="family" className="py-24 px-4 sm:px-6 bg-[#FAF7F2] relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EADBC7]/50 text-[#8C672A] text-xs font-cinzel font-semibold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FAMILY &amp; BLESSINGS</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#342416] font-bold tracking-tight">
            With Family Blessings
          </h2>
          <p className="font-marcellus text-sm sm:text-base text-[#6E5947] tracking-wider mt-3">
            Cherishing the lineage, elders, and loved ones whose prayers illuminate our bond.
          </p>
        </div>

        {/* Top Cards: Divine Blessings & Awaiting Your Presence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Divine Blessings */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9DDCF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center relative overflow-hidden">
            <div className="text-[11px] font-cinzel font-bold text-[#8C672A] tracking-[0.25em] uppercase mb-3">
              : DIVINE BLESSINGS :
            </div>
            <p className="font-marcellus text-base sm:text-lg font-bold text-[#352516] tracking-wider leading-relaxed">
              {familySections.divineBlessings}
            </p>
            <div className="mt-4 flex items-center justify-center">
              <span className="w-12 h-[1px] bg-[#E2D2BD]" />
            </div>
          </div>

          {/* Awaiting Your Presence */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9DDCF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center relative overflow-hidden">
            <div className="text-[11px] font-cinzel font-bold text-[#8C672A] tracking-[0.25em] uppercase mb-3">
              : AWAITING YOUR PRESENCE :
            </div>
            <p className="font-marcellus text-base sm:text-lg font-bold text-[#352516] tracking-wider leading-relaxed">
              {familySections.awaitingYourPresence}
            </p>
            <div className="mt-4 flex items-center justify-center">
              <span className="w-12 h-[1px] bg-[#E2D2BD]" />
            </div>
          </div>
        </div>

        {/* Vinay Vinanti Section */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E9DDCF] shadow-[0_10px_35px_rgba(0,0,0,0.04)] text-center mb-12">
          <div className="inline-block text-xs font-cinzel font-bold text-[#8C672A] tracking-[0.25em] uppercase px-4 py-1 rounded-full bg-[#FAF2E6] mb-6">
            : VINAY VINANTI :
          </div>

          <div className="max-w-3xl mx-auto text-xs sm:text-sm font-marcellus text-[#544332] leading-loose tracking-wider uppercase">
            {familySections.vinayVinanti.join(" · ")}
          </div>

          <div className="mt-6 pt-4 border-t border-[#F0E4D5] text-xs font-cinzel font-semibold text-[#8C672A] tracking-widest uppercase">
            MARUDHAR : KALAPURA [ JALOR ]
          </div>
        </div>

        {/* Mayra Paksh & Samdhi Paksh Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Mayra Paksh */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9DDCF] shadow-sm text-center">
            <span className="text-xs font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase block mb-3">
              : MAYRA PAKSH :
            </span>
            <div className="font-marcellus text-xs sm:text-sm text-[#4A3828] space-y-1.5 uppercase tracking-wider">
              <p className="font-bold">{familySections.mayraPaksh.elders}</p>
              <p>{familySections.mayraPaksh.sons}</p>
              <p>{familySections.mayraPaksh.grandsons}</p>
              <p className="text-[#8C672A] font-semibold">{familySections.mayraPaksh.family}</p>
              <p className="text-[11px] text-stone-500 pt-2">{familySections.mayraPaksh.location}</p>
            </div>
          </div>

          {/* Samdhi Paksh */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9DDCF] shadow-sm text-center">
            <span className="text-xs font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase block mb-3">
              : SAMDHI PAKSH :
            </span>
            <div className="font-marcellus text-xs sm:text-sm text-[#4A3828] space-y-2 uppercase tracking-wider">
              <p className="font-bold leading-relaxed">{familySections.samdhiPaksh.name}</p>
              <p className="text-[11px] text-stone-500 pt-3">{familySections.samdhiPaksh.location}</p>
            </div>
          </div>
        </div>

        {/* Special Invites & Mithi Manwar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Special Invites */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9DDCF] shadow-sm text-center">
            <span className="text-xs font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase block mb-4">
              : SPECIAL INVITES :
            </span>
            <div className="font-marcellus text-xs sm:text-sm text-[#4A3828] space-y-2 uppercase tracking-wider">
              {familySections.specialInvites.map((invite, i) => (
                <p key={i}>{invite}</p>
              ))}
            </div>
          </div>

          {/* Mithi Manwar */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9DDCF] shadow-sm text-center flex flex-col justify-center">
            <span className="text-xs font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase block mb-4">
              : MITHI MANWAR :
            </span>
            <p className="font-marcellus text-sm sm:text-base font-bold text-[#6B1B32] uppercase tracking-[0.2em]">
              {familySections.mithiManwar.join(" · ")}
            </p>
          </div>
        </div>

        {/* RSVP Contacts with One-Click Phone and WhatsApp actions */}
        <div id="rsvp-section" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white via-[#FCF9F5] to-white border border-[#E5D7C5] shadow-[0_12px_45px_rgba(0,0,0,0.06)] text-center mb-12">
          <span className="text-xs font-cinzel font-bold text-[#8C672A] tracking-[0.3em] uppercase block mb-2">
            : RSVP :
          </span>
          <h3 className="font-cinzel text-2xl sm:text-3xl text-[#2F1F13] font-bold mb-3">
            Kindly Respond By Confirming Your Attendance
          </h3>
          <p className="font-marcellus text-xs sm:text-sm text-stone-600 mb-8 max-w-lg mx-auto">
            Please reach out to our family coordinators for accommodation, airport transfers, and ceremony inquiries.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {familySections.rsvpContacts.map((contact, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EAE0D3] text-left hover:border-[#BA9045] transition-colors"
              >
                <span className="block font-cinzel text-xs font-bold text-[#352516] tracking-wider mb-1">
                  {contact.name}
                </span>
                <span className="block text-xs font-sans text-stone-600 mb-4">
                  {contact.formattedPhone}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-[#DECDB8] text-[#5C4530] text-[11px] font-cinzel font-semibold flex items-center justify-center gap-1 hover:bg-[#F2E5D5] transition-colors"
                  >
                    <Phone className="w-3 h-3 text-[#9C7532]" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => handleWhatsAppRSVP(contact.phone, contact.name)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#25D366] text-white text-[11px] font-cinzel font-semibold flex items-center justify-center gap-1 hover:bg-[#1EBE5D] transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Best Compliments */}
          <div className="mt-10 pt-6 border-t border-[#EDE1D2]">
            <span className="text-[11px] font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase block mb-1">
              : BEST COMPLIMENTS :
            </span>
            <p className="font-marcellus text-sm font-semibold text-[#4A3B2C] tracking-widest uppercase">
              {familySections.bestCompliments}
            </p>
          </div>
        </div>

        {/* View Original Cards Lightbox Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenCardModal(8)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#D9C4A7] text-xs font-cinzel font-semibold tracking-wider text-[#694E34] hover:bg-[#FAF3EA] transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>View Original Family Card (Page 8)</span>
          </button>
          <button
            onClick={() => onOpenCardModal(9)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#D9C4A7] text-xs font-cinzel font-semibold tracking-wider text-[#694E34] hover:bg-[#FAF3EA] transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>View Original RSVP Card (Page 9)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
