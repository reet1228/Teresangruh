import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Unlock,
  FileSpreadsheet,
  Download,
  Users,
  ShieldCheck,
  Search,
  Trash2,
  CheckCircle2,
  Heart,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";
import { getStoredRSVPs, exportRSVPsToExcel, StoredRSVP, deleteStoredRSVP, getAadhaarSignedUrl } from "../utils/rsvpStorage";
import { supabase } from "../lib/supabase";

interface HostRSVPAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export const HostRSVPAdminModal: React.FC<HostRSVPAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("Rithhinishacr7@gmail.com");
  const [isLoading, setIsLoading] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const [rsvps, setRsvps] = useState<StoredRSVP[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRsvp, setSelectedRsvp] = useState<StoredRSVP | null>(null);

  // Restore the real Supabase authentication session.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAuthenticated(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setIsAuthenticated(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load RSVPs when modal opens or is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try { setRsvps(await getStoredRSVPs()); }
    catch (error) { setPasscodeError(error instanceof Error ? error.message : "Unable to load RSVP records."); }
    finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasscodeError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: adminEmail.trim(), password: passcodeInput });
    setIsLoading(false);
    if (error) setPasscodeError(error.message);
    else { setIsAuthenticated(true); setPasscodeInput(""); await loadData(); }
  };

  const handleDownloadExcel = async () => {
  setIsLoading(true);
  setPasscodeError(null);

  try {
    await exportRSVPsToExcel(rsvps);
  } catch (error) {
    setPasscodeError(
      error instanceof Error
        ? error.message
        : 'Excel export failed.'
    );
  } finally {
    setIsLoading(false);
  }
};

const handleDownloadAadhaarPDF = async () => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    setPasscodeError("Please allow pop-ups to generate the Aadhaar PDF.");
    return;
  }

  setIsLoading(true);
  setPasscodeError(null);

  try {
    const guestsWithAadhaar = rsvps.flatMap((rsvp) =>
      rsvp.guests
        .filter((guest) => guest.aadharPath)
        .map((guest) => ({ rsvp, guest }))
    );

    if (guestsWithAadhaar.length === 0) {
      printWindow.close();
      throw new Error("No Aadhaar documents were uploaded.");
    }

    const escapeHTML = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char] || char;
  });

    const imagePages = await Promise.all(
      guestsWithAadhaar.map(async ({ rsvp, guest }) => {
        const signedUrl = await getAadhaarSignedUrl(guest.aadharPath!);
        const response = await fetch(signedUrl);

        if (!response.ok) {
          throw new Error(`Could not retrieve Aadhaar document for ${guest.name}.`);
        }

        const blob = await response.blob();

        const imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Could not read Aadhaar image."));
          reader.readAsDataURL(blob);
        });

        return `
          <section class="page">
            <h2>${escapeHTML(rsvp.familyName)}</h2>
            <p><strong>Guest:</strong> ${escapeHTML(guest.name)}</p>
            <p><strong>RSVP:</strong> ${escapeHTML(rsvp.attendance)}</p>
            <p><strong>File:</strong> ${escapeHTML(guest.aadharFileName || "Aadhaar document")}</p>
            <img src="${imageData}" alt="Aadhaar document" />
          </section>
        `;
      })
    );

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Guest Aadhaar Documents</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #222; }
            .page { page-break-after: always; break-after: page; padding: 10px; }
            .page:last-child { page-break-after: auto; break-after: auto; }
            h1 { text-align: center; }
            img { display: block; max-width: 100%; max-height: 65vh; object-fit: contain; margin: 20px auto; }
            @page { size: A4; margin: 15mm; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Guest Aadhaar Documents</h1>
          ${imagePages.join("")}
        </body>
      </html>
    `);

    printWindow.document.close();

const images = Array.from(printWindow.document.images);

await Promise.all(
  images.map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
  )
);

    printWindow.focus();
    printWindow.print();
  } catch (error) {
    printWindow.close();
    setPasscodeError(
      error instanceof Error ? error.message : "Aadhaar PDF preparation failed."
    );
  } finally {
    setIsLoading(false);
  }
};

  const handleDeleteEntry = async (id: string, familyName: string) => {
    if (window.confirm(`Are you sure you want to remove the RSVP entry for "${familyName}"?`)) {
      try {
        const target = rsvps.find(r => r.id === id);
        await deleteStoredRSVP(id, target?.guests || []);
        setRsvps(current => current.filter(r => r.id !== id));
        if (selectedRsvp?.id === id) setSelectedRsvp(null);
      } catch (error) { setPasscodeError(error instanceof Error ? error.message : "Could not delete RSVP."); }
    }
  };

  const handleOpenAadhaar = async (path?: string | null) => {
    if (!path) return;
    try { const url = await getAadhaarSignedUrl(path); window.open(url, "_blank", "noopener,noreferrer"); }
    catch (error) { setPasscodeError(error instanceof Error ? error.message : "Could not open document."); }
  };

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchFamily = item.familyName.toLowerCase().includes(term);
    const matchPhone = item.primaryPhone.toLowerCase().includes(term);
    const matchGuests = item.guests.some((g) => g.name.toLowerCase().includes(term));
    return matchFamily || matchPhone || matchGuests;
  });

  // Analytics
  const totalAttendingGuests = rsvps
    .filter((r) => r.attendance === "attending")
    .reduce((sum, r) => sum + r.guestCount, 0);

  const totalAadhaarUploaded = rsvps.reduce(
    (sum, r) => sum + r.guests.filter((g) => g.aadharFileName).length,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#FAF7F2] border border-[#D9C4A7] shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
          title="Close Host Portal"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* PASSCODE AUTHENTICATION SCREEN */
          <div className="py-8 text-center max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-full mx-auto mb-4 bg-[#FAF0E4] border border-[#DECDB8] flex items-center justify-center text-[#8C672A] shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-cinzel font-bold text-[#8C672A] tracking-[0.25em] uppercase block mb-1">
              HOST &amp; ORGANIZER ACCESS
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#352516] mb-2">
              Private RSVP Portal
            </h3>
            <p className="font-marcellus text-xs text-stone-600 mb-6">
              Sign in with your authorised administrator email and Supabase password.
            </p>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="Administrator email" className="w-full mb-3 px-4 py-2.5 rounded-xl bg-white border border-[#D9C4A7] text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A86A]" />
                <input
                  type="password"
                  autoFocus
                  required
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    setPasscodeError(null);
                  }}
                  placeholder="Supabase account password"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9C4A7] text-center font-mono text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-[#C9A86A]"
                />
                {passcodeError && (
                  <p className="text-[11px] text-red-600 mt-1.5 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{passcodeError}</span>
                  </p>
                )}

              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-full bg-[#352516] text-[#FAF7F2] font-cinzel text-xs font-bold tracking-wider hover:bg-[#23180E] transition-all border border-[#5A4533] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5 text-[#ECC880]" />
                <span>{isLoading ? "Signing in..." : "Sign In to Host Portal"}</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED HOST DASHBOARD */
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EADBCE] pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase">
                    CONFIDENTIAL HOST PORTAL
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Admin Access
                  </span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#352516] mt-0.5">
                  Ruchika &amp; Sanyam Wedding RSVPs
                </h3>
                <p className="font-marcellus text-xs text-stone-600">
                  Private database of family submissions &amp; hotel room allotment
                </p>
              </div>

              {/* DOWNLOAD EXCEL BUTTON */}
              <button
                onClick={handleDownloadExcel}
                className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-xs font-bold tracking-wider hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#C29E57] flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
                title="Download complete RSVP list in Excel (.xlsx) format"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#8C672A]" />
                <span>Download Excel Sheet (.xlsx)</span>
                <Download className="w-3.5 h-3.5 text-[#5A4533]" />
              </button>
              <button
               onClick={handleDownloadAadhaarPDF}
               className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-xs font-bold tracking-wider hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#C29E57] flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
               title="Print or save guest Aadhaar documents as PDF"
>
  <FileSpreadsheet className="w-4 h-4 text-[#8C672A]" />
  <span>Download Aadhaar PDF</span>
  <Download className="w-3.5 h-3.5 text-[#5A4533]" />
</button>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
              <div className="p-3 rounded-2xl bg-white border border-[#EADBCE] shadow-xs">
                <span className="text-[10px] font-cinzel text-stone-500 uppercase tracking-wider block">
                  Family Groups
                </span>
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#8C672A]">
                  {rsvps.length}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#EADBCE] shadow-xs">
                <span className="text-[10px] font-cinzel text-stone-500 uppercase tracking-wider block">
                  Total Guests
                </span>
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#352516]">
                  {totalAttendingGuests}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#EADBCE] shadow-xs">
                <span className="text-[10px] font-cinzel text-stone-500 uppercase tracking-wider block">
                  Aadhaar Cards
                </span>
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-emerald-700">
                  {totalAadhaarUploaded}
                </span>
              </div>
            </div>

            {/* Search and Refresh Bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search family name, guest name, or phone..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9C4A7] text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A86A]"
                />
              </div>
              <button
                onClick={loadData}
                className="p-2 rounded-xl bg-white border border-[#D9C4A7] text-stone-600 hover:bg-stone-50 transition-colors"
                title="Refresh list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* RSVP Entries List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {filteredRsvps.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-xs">
                  No RSVP records match your search.
                </div>
              ) : (
                filteredRsvps.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#EADBCE] hover:border-[#C9A86A] transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-sm font-bold text-[#352516]">
                            {idx + 1}. {item.familyName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold ${
                              item.attendance === "attending"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {item.attendance === "attending"
                              ? `${item.guestCount} Attending`
                              : "Declining"}
                          </span>
                        </div>

                        <div className="text-[11px] text-stone-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          {item.primaryPhone && (
                            <span>📞 {item.primaryPhone}</span>
                          )}
                          <span>🕒 {item.dateFormatted}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleDeleteEntry(item.id, item.familyName)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Guests List with Aadhaar status */}
                    {item.guests && item.guests.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#F2E8DC] text-[11px] space-y-1">
                        <span className="text-[10px] font-cinzel font-bold text-[#8C672A] block uppercase">
                          Guests &amp; ID Proofs:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {item.guests.map((g, gIdx) => (
                            <div
                              key={gIdx}
                              className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#EDE2D4] flex items-center justify-between gap-2"
                            >
                              <span className="font-medium text-[#352516] truncate">
                                {g.name || `Guest ${gIdx + 1}`}
                              </span>
                              {g.aadharFileName ? (
                                <button type="button" onClick={() => handleOpenAadhaar(g.aadharPath)} disabled={!g.aadharPath} className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 disabled:opacity-60">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span className="truncate max-w-[90px]">{g.aadharFileName}</span>
                                  {g.aadharPath && <Eye className="w-3 h-3" />}
                                </button>
                              ) : (
                                <span className="text-[10px] text-stone-400 italic">No Aadhaar</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.message && (
                      <div className="mt-2 text-[11px] text-[#5A4533] italic bg-[#FDFBF7] p-2 rounded-lg border border-[#F2ECE4]">
                        &ldquo;{item.message}&rdquo;
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer with Excel info & lock out */}
            <div className="mt-5 pt-4 border-t border-[#EADBCE] flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-500 font-sans">
                🔒 Only accessible with host credentials
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    void supabase.auth.signOut();
                    setIsAuthenticated(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-cinzel text-[11px]"
                >
                  Lock Portal
                </button>
                <button
                  onClick={handleDownloadExcel}
                  className="px-4 py-1.5 rounded-full bg-[#352516] text-white font-cinzel text-[11px] font-bold hover:bg-[#20140A] flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#ECC880]" />
                  <span>Export .xlsx</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
