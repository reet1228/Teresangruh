/**
 * Supabase Storage and Database Integration
 * Used for storing Aadhaar card images/PDFs and syncing RSVPs
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read environment variables (configured in Vercel or .env)
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim();

// Support both 'guest-aadhaar' (from setup.sql) and 'aadhar-cards'
export const SUPABASE_BUCKET = (
  import.meta.env.VITE_SUPABASE_BUCKET || "guest-aadhaar"
).trim();

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn("Failed to initialize Supabase client:", err);
      return null;
    }
  }

  return null;
}

export const supabase = getSupabase() || createClient(
  SUPABASE_URL || "https://example.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key"
);

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export interface UploadResult {
  publicUrl: string;
  filePath: string;
  fileName: string;
  fileSize: string;
}

/**
 * Uploads an Aadhaar card file (image or PDF) to Supabase Storage
 * Returns a working URL (signed or public) that can be clicked in the Excel sheet
 */
export async function uploadAadharToSupabase(
  file: File,
  guestName: string,
  familyName: string
): Promise<UploadResult> {
  const formattedSize =
    file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

  const client = getSupabase();

  // If Supabase is not configured, convert to Base64 Data URL as local fallback
  if (!client) {
    console.warn(
      "Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) not found. Using local Data URL fallback."
    );
    const dataUrl = await fileToDataUrl(file);
    return {
      publicUrl: dataUrl,
      filePath: `local/${file.name}`,
      fileName: file.name,
      fileSize: formattedSize,
    };
  }

  try {
    // Sanitize names for path
    const cleanFamily = (familyName || "General").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const cleanGuest = (guestName || "Guest").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const filePath = `${cleanFamily}/${timestamp}_${cleanGuest}_${randomSuffix}.${ext}`;

    // Target bucket name (try configured, then guest-aadhaar, then aadhar-cards)
    const targetBucket = SUPABASE_BUCKET;

    // Upload to Supabase Storage Bucket
    const { error: uploadError } = await client.storage
      .from(targetBucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      console.warn(`Upload to bucket '${targetBucket}' failed, trying fallback bucket:`, uploadError);
      
      // Try alternative bucket 'aadhar-cards' if target was 'guest-aadhaar'
      const fallbackBucket = targetBucket === "guest-aadhaar" ? "aadhar-cards" : "guest-aadhaar";
      const { error: retryError } = await client.storage
        .from(fallbackBucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "application/octet-stream",
        });

      if (retryError) {
        console.error("Both bucket uploads failed:", retryError);
        const fallbackUrl = await fileToDataUrl(file);
        return {
          publicUrl: fallbackUrl,
          filePath,
          fileName: file.name,
          fileSize: formattedSize,
        };
      }
    }

    // Generate link: First try signed URL (valid for 1 full year) in case bucket is private (as defined in setup.sql)
    let finalUrl = "";
    try {
      const { data: signedData, error: signedError } = await client.storage
        .from(targetBucket)
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 365 days

      if (!signedError && signedData?.signedUrl) {
        finalUrl = signedData.signedUrl;
      }
    } catch {}

    // If signed URL is empty, use getPublicUrl
    if (!finalUrl) {
      const { data: urlData } = client.storage
        .from(targetBucket)
        .getPublicUrl(filePath);
      finalUrl = urlData.publicUrl;
    }

    return {
      publicUrl: finalUrl,
      filePath,
      fileName: file.name,
      fileSize: formattedSize,
    };
  } catch (err) {
    console.error("Exception during Aadhaar upload to Supabase:", err);
    const fallbackUrl = await fileToDataUrl(file);
    return {
      publicUrl: fallbackUrl,
      filePath: `fallback/${file.name}`,
      fileName: file.name,
      fileSize: formattedSize,
    };
  }
}

/**
 * Helper to convert file to Base64 Data URL for local preview/fallback
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

/**
 * Sync RSVP to Supabase database table `wedding_rsvps` (or `rsvps`)
 */
export async function syncRSVPToSupabaseDatabase(rsvpData: any) {
  const client = getSupabase();
  if (!client) return;

  try {
    // Matches schema in setup.sql: public.wedding_rsvps
    const { error } = await client.from("wedding_rsvps").insert([
      {
        family_name: rsvpData.familyName,
        primary_phone: rsvpData.primaryPhone,
        attendance: rsvpData.attendance,
        guest_count: rsvpData.guestCount,
        guests: rsvpData.guests,
        message: rsvpData.message || "",
      },
    ]);

    if (error) {
      // If wedding_rsvps doesn't exist, try table 'rsvps'
      await client.from("rsvps").insert([
        {
          id: rsvpData.id,
          family_name: rsvpData.familyName,
          primary_phone: rsvpData.primaryPhone,
          attendance: rsvpData.attendance,
          guest_count: rsvpData.guestCount,
          guests_json: rsvpData.guests,
          wishes: rsvpData.message,
          created_at: rsvpData.timestamp,
        },
      ]);
    }
  } catch (e) {
    // Non-fatal fallback
  }
}
