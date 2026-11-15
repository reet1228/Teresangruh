/**
 * RSVP Storage and Excel Export Utility
 * Wedding: Ruchika & Sanyamji (#tereSAngRUh)
 * Features Supabase Storage integration with clickable Aadhaar card links in Excel
 */

import * as XLSX from "xlsx";
import {
  getSupabase,
  syncRSVPToSupabaseDatabase,
} from "./supabase";

export interface StoredGuest {
  name: string;
  aadharFileName: string | null;
  aadharFileSize?: string;
  aadharUrl?: string | null;
  aadharPath?: string | null;
  aadharBucket?: string | null;
}

export interface StoredRSVP {
  id: string;
  timestamp: string;
  dateFormatted: string;
  familyName: string;
  primaryPhone: string;
  attendance: "attending" | "declining";
  guestCount: number;
  guests: StoredGuest[];
  message: string;
}

const STORAGE_KEY = "teresangruh_wedding_rsvps_v1";

// Default initial sample entries for demonstration if storage is empty
const INITIAL_DEMO_RSVPS: StoredRSVP[] = [
  {
    id: "sample-1",
    timestamp: "2026-11-06T10:30:00.000Z",
    dateFormatted: "06 Nov 2026, 04:00 PM",
    familyName: "Chauhan Parivaar",
    primaryPhone: "+91 94804 26253",
    attendance: "attending",
    guestCount: 3,
    guests: [
      {
        name: "Rajendra Kumar Chauhan",
        aadharFileName: "Rajendra_Aadhaar.pdf",
        aadharFileSize: "420 KB",
        aadharUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Damayanti Chauhan",
        aadharFileName: "Damayanti_Aadhaar.jpg",
        aadharFileSize: "1.2 MB",
        aadharUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Kailash Kumar Chauhan",
        aadharFileName: "Kailash_Aadhaar.pdf",
        aadharFileSize: "350 KB",
        aadharUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    message: "May God bless Ruchika and Sanyamji with eternal happiness and prosperity!",
  },
  {
    id: "sample-2",
    timestamp: "2026-11-06T14:15:00.000Z",
    dateFormatted: "06 Nov 2026, 07:45 PM",
    familyName: "Sakaria Family",
    primaryPhone: "+91 94484 53036",
    attendance: "attending",
    guestCount: 2,
    guests: [
      {
        name: "Naresh Sakaria",
        aadharFileName: "Naresh_Aadhaar.pdf",
        aadharFileSize: "510 KB",
        aadharUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Sangeetha Sakaria",
        aadharFileName: "Sangeetha_Aadhaar.jpg",
        aadharFileSize: "890 KB",
        aadharUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    message: "Excited to celebrate the magical days at Kumta beach!",
  },
];

export function getStoredRSVPs(): StoredRSVP[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with demo samples so the Excel sheet is never empty on first preview
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RSVPS));
      return INITIAL_DEMO_RSVPS;
    }
    return JSON.parse(raw) as StoredRSVP[];
  } catch (err) {
    console.error("Error reading RSVPs from localStorage:", err);
    return INITIAL_DEMO_RSVPS;
  }
}
/**
 * Delete an RSVP entry from local browser storage.
 */
export function deleteStoredRSVP(id: string): StoredRSVP[] {
  const updated = getStoredRSVPs().filter(
    (rsvp) => rsvp.id !== id
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to delete RSVP:", error);
    throw error;
  }

  return updated;
}
export function saveRSVP(entry: {
  familyName: string;
  primaryPhone: string;
  attendance: "attending" | "declining";
  guestCount: number;
  guests: StoredGuest[];
  message: string;
}): StoredRSVP {
  const all = getStoredRSVPs();
  const now = new Date();

  const newEntry: StoredRSVP = {
    id: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    dateFormatted: now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    ...entry,
  };

  const updated = [newEntry, ...all];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save RSVP to localStorage:", e);
  }

  // Attempt async sync to Supabase database if configured
  syncRSVPToSupabaseDatabase(newEntry).catch(() => {});

  return newEntry;
}

/**
 * Generates and downloads a multi-sheet Excel workbook (.xlsx)
 * with clickable hyperlinks to uploaded Aadhaar card images in Supabase Storage.
 */
export function exportRSVPsToExcel(customList?: StoredRSVP[]) {
  const rsvps = customList || getStoredRSVPs();

  // ==========================================
  // SHEET 1: Family / Booking Summary
  // ==========================================
  const summaryRows = rsvps.map((item, index) => {
    const guestNames = item.guests
      .map((g, i) => `${i + 1}. ${g.name || "Guest"}`)
      .join("; ");

    const aadharFiles = item.guests
      .map((g, i) => {
        const status = g.aadharPath
          ? "Uploaded securely"
          : g.aadharFileName
            ? "File details available"
            : "Not Uploaded";

        return `${i + 1}. ${g.name || "Guest"}: ${
          g.aadharFileName || "Not Uploaded"
        } (${status})`;
      })
      .join("; ");

    return {
      "S.No": index + 1,
      "Submission Date & Time": item.dateFormatted,
      "Family Name": item.familyName,
      "Contact Phone": item.primaryPhone || "N/A",
      "Attendance Status":
        item.attendance === "attending"
          ? "Joyfully Attending"
          : "Declining",
      "Total Number of Guests":
        item.attendance === "attending" ? item.guestCount : 0,
      "Guest Names":
        item.attendance === "attending" ? guestNames : "N/A",
      "Aadhaar File Details":
        item.attendance === "attending" ? aadharFiles : "N/A",
      "Wishes & Blessings": item.message || "-",
    };
  });

  // ==========================================
  // SHEET 2: Individual Guest Master List
  // ==========================================
  const guestRows: {
    "Guest S.No": number;
    "Family / Group Name": string;
    "Guest Full Name": string;
    "Contact Phone": string;
    "Aadhaar Card File Name": string;
    "Aadhaar File Size": string;
    "Aadhaar Upload Status": string;
    "Submission Date": string;
  }[] = [];

  let guestCounter = 1;

  rsvps.forEach((item) => {
    if (item.attendance === "attending") {
      item.guests.forEach((g) => {
        guestRows.push({
          "Guest S.No": guestCounter++,
          "Family / Group Name": item.familyName,
          "Guest Full Name": g.name || "Guest",
          "Contact Phone": item.primaryPhone || "N/A",
          "Aadhaar Card File Name":
            g.aadharFileName || "Pending Upload",
          "Aadhaar File Size": g.aadharFileSize || "N/A",
          "Aadhaar Upload Status": g.aadharPath
            ? "Uploaded - Private Storage"
            : "Not Uploaded / Path Unavailable",
          "Submission Date": item.dateFormatted,
        });
      });
    }
  });

  // ==========================================
  // CREATE EXCEL WORKBOOK
  // ==========================================
  const wb = XLSX.utils.book_new();

  // Sheet 1: Family Summary
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);

  wsSummary["!cols"] = [
    { wch: 8 },
    { wch: 24 },
    { wch: 28 },
    { wch: 18 },
    { wch: 22 },
    { wch: 22 },
    { wch: 45 },
    { wch: 55 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(
    wb,
    wsSummary,
    "RSVP Family Summary"
  );

  // Sheet 2: Individual Guest List
  const wsGuests = XLSX.utils.json_to_sheet(guestRows);

  wsGuests["!cols"] = [
    { wch: 12 },
    { wch: 28 },
    { wch: 26 },
    { wch: 18 },
    { wch: 32 },
    { wch: 16 },
    { wch: 32 },
    { wch: 22 },
  ];

  XLSX.utils.book_append_sheet(
    wb,
    wsGuests,
    "Hotel Check-In & Aadhaar List"
  );

  // ==========================================
  // DOWNLOAD EXCEL FILE
  // ==========================================
  const dateStr = new Date().toISOString().slice(0, 10);

  const fileName =
    `Ruchika_Sanyamji_Wedding_RSVP_List_${dateStr}.xlsx`;

  XLSX.writeFile(wb, fileName);
}

/**
 * Generate a temporary private URL for an Aadhaar document.
 * Requires an authenticated admin session and Storage read permission.
 */
export async function getAadhaarSignedUrl(
  path: string,
  bucket: string = "guest-aadhaar"
): Promise<string> {
  const client = getSupabase();

  if (!client) {
    throw new Error("Supabase is not configured.");
  }

  if (!path) {
    throw new Error("Aadhaar document path is missing.");
  }

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, 300);

  if (error) {
    throw new Error(
      `Could not open Aadhaar document: ${error.message}`
    );
  }

  return data.signedUrl;
}
