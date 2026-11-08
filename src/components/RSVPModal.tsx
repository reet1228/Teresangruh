import React, { useState } from "react";
import {
  X,
  Heart,
  CheckCircle2,
  MessageCircle,
  Upload,
  FileText,
  Trash2,
  Users,
  ShieldCheck,
  Plus,
} from "lucide-react";
import confetti from "canvas-confetti";
import { saveRSVP } from "../utils/rsvpStorage";

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuestEntry {
  id: string;
  name: string;
  aadharFileName: string | null;
  aadharFileSize?: string;
  aadharNumber?: string;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [familyName, setFamilyName] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "declining">("attending");
  const [guestCount, setGuestCount] = useState<number>(2);

  // Dynamic guest list with individual names and Aadhaar card uploads
  const [guests, setGuests] = useState<GuestEntry[]>([
    { id: "1", name: "", aadharFileName: null },
    { id: "2", name: "", aadharFileName: null },
  ]);

  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // Handle guest count change
  const handleGuestCountChange = (count: number) => {
    const validCount = Math.max(1, Math.min(12, count));
    setGuestCount(validCount);

    setGuests((prev) => {
      const updated = [...prev];
      if (validCount > prev.length) {
        for (let i = prev.length + 1; i <= validCount; i++) {
          updated.push({ id: String(i), name: "", aadharFileName: null });
        }
      } else if (validCount < prev.length) {
        return updated.slice(0, validCount);
      }
      return updated;
    });
  };

  const handleGuestNameChange = (index: number, name: string) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const handleAadharUpload = (index: number, file: File | null) => {
    if (!file) return;
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setGuests((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        aadharFileName: file.name,
        aadharFileSize: formattedSize,
      };
      return updated;
    });
  };

  const handleRemoveAadhar = (index: number) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        aadharFileName: null,
        aadharFileSize: undefined,
      };
      return updated;
    });
  };

  const addAnotherGuest = () => {
    if (guestCount < 12) {
      handleGuestCountChange(guestCount + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save RSVP record to persistent storage and Excel database
    saveRSVP({
      familyName: familyName.trim(),
      primaryPhone: primaryPhone.trim(),
      attendance,
      guestCount,
      guests,
      message: message.trim(),
    });

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#ECC880", "#C96D80", "#FFFFFF"],
      });
    } catch {}

    setIsSubmitted(true);
  };

  const handleSendViaWhatsApp = () => {
    const guestListString = guests
      .filter((g) => g.name.trim())
      .map(
        (g, idx) =>
          `  ${idx + 1}. ${g.name} ${
            g.aadharFileName ? `(Aadhaar Card: ${g.aadharFileName})` : ""
          }`
      )
      .join("\n");

    const text = encodeURIComponent(
      `*Wedding RSVP — Ruchika & Sanyam (#tereSAngRUh)*\n` +
        `*Family Name:* ${familyName}\n` +
        (primaryPhone ? `*Contact Phone:* ${primaryPhone}\n` : "") +
        `*Attendance:* ${
          attendance === "attending" ? "Joyfully Attending" : "Regretfully Declining"
        }\n` +
        (attendance === "attending"
          ? `*Number of Guests:* ${guestCount}\n` +
            `*Guests List & ID verification:*\n${guestListString || "  (Names provided online)"}\n`
          : "") +
        (message ? `*Wishes for Couple:* "${message}"\n` : "")
    );

    // Default WhatsApp recipient from invitation coordinators (Rajendra Kumar)
    window.open(`https://wa.me/919480426253?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-[#FAF7F2] border border-[#D9C4A7] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
          title="Close RSVP Form"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[10px] font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase block mb-1">
              #tereSAngRUh
            </span>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#352516] mb-2">
              RSVP Confirmed!
            </h3>

            <p className="font-marcellus text-sm font-semibold text-[#544131] mb-2">
              Thank you, {familyName}!
            </p>

            <p className="font-marcellus text-xs text-stone-600 mb-6 max-w-md mx-auto leading-relaxed">
              Your attendance for {guestCount} {guestCount === 1 ? "guest" : "guests"} and
              resort verification details have been recorded. We warmly look forward to welcoming
              you at Dennisons Beach Resort, Kumta!
            </p>

            {/* Summary card */}
            <div className="p-4 rounded-2xl bg-white border border-[#EADBCE] text-left text-xs space-y-1.5 mb-6 max-w-md mx-auto">
              <p>
                <span className="font-bold text-[#8C672A]">Family:</span> {familyName}
              </p>
              <p>
                <span className="font-bold text-[#8C672A]">Total Guests:</span> {guestCount}
              </p>
              <p>
                <span className="font-bold text-[#8C672A]">Aadhaar Cards:</span>{" "}
                {guests.filter((g) => g.aadharFileName).length} of {guestCount} uploaded
              </p>
            </div>

            <div className="flex flex-col gap-2.5 max-w-md mx-auto">
              <button
                onClick={handleSendViaWhatsApp}
                className="w-full py-3 px-4 rounded-full bg-[#25D366] text-white font-cinzel text-xs font-bold tracking-wider hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Details via WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-full bg-stone-200 text-[#352516] font-cinzel text-xs font-semibold hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-[10px] font-cinzel font-bold text-[#8C672A] tracking-[0.25em] uppercase block mb-1">
                #tereSAngRUh · INVITATION RSVP
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#342416]">
                Confirm Your Attendance
              </h3>
              <p className="font-marcellus text-xs font-semibold text-stone-600 mt-1">
                10th – 11th December 2026 · Dennisons Beach Resort, Kumta
              </p>
            </div>

            <div className="space-y-5 text-left">
              {/* SECTION 1: YOUR FAMILY NAME */}
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#3C2A1B] uppercase tracking-wider mb-1.5">
                  1. Your Family Name *
                </label>
                <input
                  type="text"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. Ambgotha Chauhan Family / Kothari Parivaar"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9C4A7] text-sm text-[#2E1E12] font-medium focus:outline-none focus:ring-2 focus:ring-[#C9A86A]"
                />
              </div>

              {/* Contact Phone Number */}
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#3C2A1B] uppercase tracking-wider mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#D9C4A7] text-xs text-[#2E1E12] focus:outline-none focus:ring-2 focus:ring-[#C9A86A]"
                />
              </div>

              {/* Attendance Toggle */}
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#3C2A1B] uppercase tracking-wider mb-1.5">
                  Will You Be Attending?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAttendance("attending")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-cinzel font-bold border transition-all cursor-pointer ${
                      attendance === "attending"
                        ? "bg-[#3B291A] text-white border-[#3B291A] shadow-xs"
                        : "bg-white text-stone-700 border-[#D9C4A7] hover:bg-stone-50"
                    }`}
                  >
                    Joyfully Attending
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("declining")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-cinzel font-bold border transition-all cursor-pointer ${
                      attendance === "declining"
                        ? "bg-[#3B291A] text-white border-[#3B291A] shadow-xs"
                        : "bg-white text-stone-700 border-[#D9C4A7] hover:bg-stone-50"
                    }`}
                  >
                    Regretfully Declining
                  </button>
                </div>
              </div>

              {attendance === "attending" && (
                <>
                  {/* SECTION 2: NUMBER OF GUEST */}
                  <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#E8DAC8]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-cinzel font-bold text-[#3C2A1B] uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#8C672A]" />
                        <span>2. Number of Guests *</span>
                      </label>
                      <span className="text-xs font-cinzel font-bold text-[#8C672A] tabular-nums">
                        {guestCount} {guestCount === 1 ? "Person" : "Persons"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleGuestCountChange(num)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all border ${
                            guestCount === num
                              ? "bg-[#8C672A] text-white border-[#8C672A] shadow-xs scale-105"
                              : "bg-white text-[#4A3828] border-[#DFCBB0] hover:bg-white/80"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleGuestCountChange(Math.min(12, guestCount + 1))}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-cinzel font-bold bg-white text-[#4A3828] border border-[#DFCBB0] hover:bg-white/80"
                        title="Add more guests"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* SECTION 3: NAME WITH AADHAR CARD OPTION TO UPLOAD */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E6D7C3] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F0E4D4] pb-2">
                      <div>
                        <span className="text-xs font-cinzel font-bold text-[#3C2A1B] uppercase tracking-wider block">
                          3. Guest Names &amp; Aadhaar Card Verification
                        </span>
                        <span className="text-[11px] font-sans text-stone-500">
                          Required for Dennisons Beach Resort security &amp; room allotment
                        </span>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-[#8C672A] shrink-0" />
                    </div>

                    {/* Guest slots with name and Aadhaar upload */}
                    <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                      {guests.map((guest, idx) => (
                        <div
                          key={guest.id}
                          className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EADBCE] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-cinzel font-bold text-[#8C672A] uppercase tracking-wider">
                              Guest {idx + 1} {idx === 0 && "(Primary)"}
                            </span>
                          </div>

                          {/* Guest Name input */}
                          <input
                            type="text"
                            required
                            value={guest.name}
                            onChange={(e) => handleGuestNameChange(idx, e.target.value)}
                            placeholder={`Full Name of Guest ${idx + 1}`}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9C4A7] text-xs font-medium text-[#2E1E12] focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
                          />

                          {/* Aadhaar Card file upload option */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            {guest.aadharFileName ? (
                              <div className="flex-1 flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="font-medium text-emerald-900 truncate text-[11px]">
                                    {guest.aadharFileName}
                                  </span>
                                  {guest.aadharFileSize && (
                                    <span className="text-[10px] text-emerald-600 shrink-0">
                                      ({guest.aadharFileSize})
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAadhar(idx)}
                                  className="text-stone-400 hover:text-red-500 p-1"
                                  title="Remove File"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white border border-dashed border-[#C9A86A] text-[11px] font-cinzel font-semibold text-[#8C672A] hover:bg-[#FDF9F2] transition-colors cursor-pointer">
                                <Upload className="w-3.5 h-3.5 text-[#B88E3E]" />
                                <span>Upload Aadhaar Card (PDF / Image)</span>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleAadharUpload(idx, file);
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {guestCount < 12 && (
                      <button
                        type="button"
                        onClick={addAnotherGuest}
                        className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#8C672A] hover:text-[#5A411B] pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Guest Slot</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Wishes or note */}
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#3C2A1B] uppercase tracking-wider mb-1">
                  Wishes &amp; Blessings for Ruchika &amp; Sanyam
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a heartfelt blessing for the couple..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9C4A7] text-xs text-[#2E1E12] focus:outline-none focus:ring-2 focus:ring-[#C9A86A]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#EADBCE]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full text-xs font-cinzel font-bold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-xs font-bold tracking-wider hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#C29E57] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit RSVP</span>
                <Heart className="w-3.5 h-3.5 fill-[#1F140A]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
