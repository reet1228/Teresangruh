
import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Unlock,
  FileSpreadsheet,
  Download,
  Search,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Eye,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import {
  getStoredRSVPs,
  fetchRSVPsFromSupabase,
  exportRSVPsToExcel,
  StoredRSVP,
  deleteStoredRSVP,
  getAadhaarSignedUrl,
} from "../utils/rsvpStorage";
import {
  getSupabase,
  isSupabaseConfigured,
} from "../utils/supabase";

interface HostRSVPAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostRSVPAdminModal: React.FC<HostRSVPAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Dashboard data
  const [rsvps, setRsvps] = useState<StoredRSVP[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showConfigGuide, setShowConfigGuide] = useState<boolean>(false);

  // Aadhaar preview
  const [previewImageUrl, setPreviewImageUrl] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const [documentError, setDocumentError] = useState<string | null>(null);
  const [isOpeningDocument, setIsOpeningDocument] = useState<boolean>(false);

  // Load RSVP records
 const loadData = async () => {
  try {
    const list = await fetchRSVPsFromSupabase();
    setRsvps(list);
  } catch (error: any) {
    console.error("Failed to load RSVPs from Supabase:", error);
    alert(error?.message || "Unable to load RSVP records.");
  }
};

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  // Supabase sign out
  const signOutAdmin = async () => {
    const client = getSupabase();

    try {
      if (client) {
        const { error } = await client.auth.signOut();

        if (error) {
          console.error("Admin sign-out error:", error);
        }
      }
    } catch (error) {
      console.error("Admin sign-out failed:", error);
    } finally {
      setIsAuthenticated(false);
      setAdminEmail("");
      setAdminPassword("");
      setPasscodeError(null);
      setPreviewImageUrl(null);
      setDocumentError(null);
    }
  };

  // Close portal and sign out
  const handleClose = async () => {
    await signOutAdmin();
    onClose();
  };

  // Lock portal without closing the modal
  const handleLockPortal = async () => {
    await signOutAdmin();
  };

  // Admin email and password login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasscodeError(null);

    const client = getSupabase();

    if (!client) {
      setPasscodeError(
        "Supabase is not configured. Please check your environment variables."
      );
      return;
    }

    if (!adminEmail.trim() || !adminPassword) {
      setPasscodeError("Please enter both email and password.");
      return;
    }

    try {
      const { error } = await client.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword,
      });

      if (error) {
        setPasscodeError(error.message);
        return;
      }

      setIsAuthenticated(true);
      setAdminPassword("");
      setPasscodeError(null);
      loadData();
    } catch (error) {
      console.error("Admin login error:", error);
      setPasscodeError("Unable to sign in. Please try again.");
    }
  };

  // Download RSVP Excel file
  const handleDownloadExcel = () => {
    try {
      exportRSVPsToExcel(rsvps);
    } catch (error) {
      console.error("Excel export error:", error);
      alert("Unable to download the Excel file. Please try again.");
    }
  };

  // Delete RSVP entry
  const handleDeleteEntry = async (id: string, familyName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove the RSVP entry for "${familyName}"?`
      )
    ) {
      return;
    }

    try {
      const updated = deleteStoredRSVP(id);
      setRsvps(updated);
    } catch (error) {
      console.error("RSVP deletion error:", error);
      alert("Unable to delete this RSVP entry. Please try again.");
    }
  };

  // Open Aadhaar using a temporary private signed URL
  const handleOpenAadhaar = async (
    path: string,
    bucket: string,
    title: string
  ) => {
    if (!path) {
      setDocumentError("The Aadhaar document path is missing.");
      return;
    }

    setIsOpeningDocument(true);
    setDocumentError(null);
    setPreviewImageUrl(null);

    try {
      const signedUrl = await getAadhaarSignedUrl(path, bucket);

      setPreviewImageUrl({
        url: signedUrl,
        title,
      });
    } catch (error: any) {
      console.error("Aadhaar preview error:", error);

      setDocumentError(
        error?.message || "Unable to open the Aadhaar document."
      );
    } finally {
      setIsOpeningDocument(false);
    }
  };

  // Download Aadhaar using a temporary private signed URL
  const handleDownloadAadhaar = async (
    path: string,
    bucket: string,
    fileName: string
  ) => {
    if (!path) {
      setDocumentError("The Aadhaar document path is missing.");
      return;
    }

    setIsOpeningDocument(true);
    setDocumentError(null);

    try {
      const client = getSupabase();

      if (!client) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error } = await client.storage
        .from(bucket)
        .createSignedUrl(path, 300, {
          download: fileName || "Aadhaar",
        });

      if (error) {
        throw new Error(error.message);
      }

      const link = document.createElement("a");
      link.href = data.signedUrl;
      link.download = fileName || "Aadhaar";
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error: any) {
      console.error("Aadhaar download error:", error);

      setDocumentError(
        error?.message || "Unable to download Aadhaar document."
      );
    } finally {
      setIsOpeningDocument(false);
    }
  };

  if (!isOpen) return null;

  // Filter RSVPs
  const filteredRsvps = rsvps.filter((item) => {
    const term = searchTerm.toLowerCase();

    const matchFamily = (item.familyName || "")
      .toLowerCase()
      .includes(term);

    const matchPhone = (item.primaryPhone || "")
      .toLowerCase()
      .includes(term);

    const matchGuests = (item.guests || []).some((g) =>
      (g.name || "").toLowerCase().includes(term)
    );

    return matchFamily || matchPhone || matchGuests;
  });

  // Analytics
  const totalAttendingGuests = rsvps
    .filter((r) => r.attendance === "attending")
    .reduce((sum, r) => sum + r.guestCount, 0);

  const totalAadhaarUploaded = rsvps.reduce(
    (sum, r) =>
      sum +
      r.guests.filter((g) => g.aadharFileName || g.aadharPath).length,
    0
  );

  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">

      {/* Background close */}
      <div
        className="absolute inset-0"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#FAF7F2] border border-[#D9C4A7] shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
          title="Close Host Portal"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* ADMIN LOGIN SCREEN */
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
              Sign in with your authorized administrator email and password
              to manage RSVPs and download the complete Excel sheet.
            </p>

            <form
              onSubmit={handleAdminLogin}
              className="space-y-4"
            >
              <div className="space-y-3">

                {/* Email */}
                <input
                  type="email"
                  autoFocus
                  required
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    setPasscodeError(null);
                  }}
                  placeholder="Enter admin email"
                  autoComplete="username"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9C4A7] text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A86A]"
                />

                {/* Password */}
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setPasscodeError(null);
                  }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D9C4A7] text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A86A]"
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
                <span>Login to Host Portal</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div>

            {/* Dashboard header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EADBCE] pb-4 mb-5">

              <div>
                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-[10px] font-cinzel font-bold text-[#8C672A] tracking-[0.2em] uppercase">
                    CONFIDENTIAL HOST PORTAL
                  </span>

                  {supabaseReady ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Supabase Cloud Active
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        setShowConfigGuide(!showConfigGuide)
                      }
                      className="px-2 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Configure Supabase in Vercel
                    </button>
                  )}
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#352516] mt-0.5">
                  Ruchika &amp; Sanyamji Wedding RSVPs
                </h3>

                <p className="font-marcellus text-xs text-stone-600">
                  Private database of family submissions &amp; hotel room allotment
                </p>
              </div>

              {/* Download Excel */}
              <button
                onClick={handleDownloadExcel}
                className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#DFBF7E] via-[#ECC880] to-[#DFBF7E] text-[#1F140A] font-cinzel text-xs font-bold tracking-wider hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border border-[#C29E57] flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
                title="Download RSVP Excel file"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#8C672A]" />
                <span>Download Excel Sheet (.xlsx)</span>
                <Download className="w-3.5 h-3.5 text-[#5A4533]" />
              </button>
            </div>

            {/* Supabase setup guide */}
            {showConfigGuide && (
              <div className="p-3.5 mb-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">

                <div className="flex items-center justify-between font-bold">
                  <span>Supabase configuration:</span>

                  <button
                    onClick={() => setShowConfigGuide(false)}
                    className="text-amber-800 hover:text-black"
                  >
                    ✕
                  </button>
                </div>

                <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                  <li>
                    Use the existing private <strong>guest-aadhaar</strong> bucket.
                    Do not make this bucket public.
                  </li>
                  <li>
                    In Vercel, open your project Settings and Environment Variables.
                  </li>
                  <li>
                    Check <code>VITE_SUPABASE_URL</code>.
                  </li>
                  <li>
                    Check <code>VITE_SUPABASE_ANON_KEY</code>.
                  </li>
                  <li>
                    Redeploy after changing environment variables.
                  </li>
                </ol>
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">

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

            {/* Search and refresh */}
            <div className="flex items-center gap-2 mb-3">

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
                className="p-2 rounded-xl bg-white border border-[#D9C4A7] text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                title="Refresh list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* RSVP entries */}
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

                      <button
                        onClick={() =>
                          handleDeleteEntry(item.id, item.familyName)
                        }
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Guests and Aadhaar documents */}
                    {item.guests && item.guests.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#F2E8DC] text-[11px] space-y-1">

                        <span className="text-[10px] font-cinzel font-bold text-[#8C672A] block uppercase">
                          Guests &amp; ID Proofs:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">

                          {item.guests.map((g, gIdx) => (
                            <div
                              key={gIdx}
                              className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EDE2D4] flex items-center justify-between gap-2"
                            >
                              <span className="font-medium text-[#352516] truncate text-[11px]">
                                {g.name || `Guest ${gIdx + 1}`}
                              </span>
                             
                              {g.aadharPath ? (
                                <button
                                  onClick={() =>
                                    handleOpenAadhaar(
                                      g.aadharPath!,
                                      g.aadharBucket || "guest-aadhaar",
                                      g.aadharFileName ||
                                        `Aadhaar - ${g.name || "Guest"}`
                                    )
                                  }
                                  disabled={isOpeningDocument}
                                  className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded border border-emerald-300 font-semibold transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                                  title="Open private Aadhaar document"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span className="truncate max-w-[85px]">
                                    {g.aadharFileName || "View Card"}
                                  </span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                </button>
                              <button
                                onClick={() =>
                                  handleDownloadAadhaar(
                                    g.aadharPath!,
                                    g.aadharBucket || "guest-aadhaar",
                                    g.aadharFileName || `Aadhaar - ${g.name || "Guest"}`
                                  )
                                }
                                disabled={isOpeningDocument}
                                className="inline-flex items-center gap-1 text-[10px] text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded border border-blue-300 font-semibold transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                                title="Download private Aadhaar document"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                              ) : g.aadharFileName ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                                  <ShieldCheck className="w-3 h-3 text-stone-500" />
                                  <span className="truncate max-w-[120px]">
                                    {g.aadharFileName} — secure path unavailable
                                  </span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-stone-400 italic">
                                  No Aadhaar
                                </span>
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

            {/* Document error */}
            {documentError && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {documentError}
              </div>
            )}

            {/* Excel information */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#FAF0E4] border border-[#E8DAC8] text-[11px] text-[#5A4533] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#8C672A] shrink-0" />
              <span>
                <strong>Excel Feature:</strong> Download the RSVP family
                summary and guest master list. Private Aadhaar access is
                handled separately through temporary signed links.
              </span>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[#EADBCE] flex items-center justify-between text-xs">

              <span className="text-[11px] text-stone-500 font-sans">
                🔒 Only accessible with host credentials
              </span>

              <div className="flex items-center gap-2">

                <button
                  onClick={handleLockPortal}
                  className="px-3 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-cinzel text-[11px] cursor-pointer"
                >
                  Lock Portal
                </button>

                <button
                  onClick={handleDownloadExcel}
                  className="px-4 py-1.5 rounded-full bg-[#352516] text-white font-cinzel text-[11px] font-bold hover:bg-[#20140A] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#ECC880]" />
                  <span>Export .xlsx</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aadhaar document preview */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-3 sm:p-6">

          <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col">

            <div className="flex items-center justify-between gap-3 p-3 border-b border-stone-200">

              <span className="text-sm font-semibold text-stone-800 truncate">
                {previewImageUrl.title}
              </span>

              <button
                onClick={() => setPreviewImageUrl(null)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-600"
                title="Close document preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <iframe
              src={previewImageUrl.url}
              title={previewImageUrl.title}
              className="w-full flex-1 border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};
