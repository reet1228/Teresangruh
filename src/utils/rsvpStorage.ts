/** Supabase-backed RSVP storage and Excel export for Ruchika & Sanyam. */
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';

export interface StoredGuest {
  name: string;
  aadharFileName: string | null;
  aadharFileSize?: string;
  aadharPath?: string | null;
}
export interface StoredRSVP {
  id: string;
  timestamp: string;
  dateFormatted: string;
  familyName: string;
  primaryPhone: string;
  attendance: 'attending' | 'declining';
  guestCount: number;
  guests: StoredGuest[];
  message: string;
}
export interface GuestSubmission extends StoredGuest { aadharFile?: File | null }

const formatDate = (value: string) => new Date(value).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
});

export async function saveRSVP(entry: {
  familyName: string; primaryPhone: string; attendance: 'attending' | 'declining';
  guestCount: number; guests: GuestSubmission[]; message: string;
}): Promise<StoredRSVP> {
  const submissionId = crypto.randomUUID();
  const savedGuests: StoredGuest[] = [];

  for (let index = 0; index < entry.guests.length; index++) {
    const guest = entry.guests[index];
    let aadharPath: string | null = null;
    if (guest.aadharFile) {
      const extension = guest.aadharFile.name.split('.').pop()?.toLowerCase() || 'bin';
      aadharPath = `${submissionId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('guest-aadhaar').upload(aadharPath, guest.aadharFile, {
        contentType: guest.aadharFile.type || 'application/octet-stream', upsert: false,
      });
      if (uploadError) throw new Error(`Aadhaar upload failed for ${guest.name}: ${uploadError.message}`);
    }
    savedGuests.push({
      name: guest.name,
      aadharFileName: guest.aadharFile?.name || guest.aadharFileName || null,
      aadharFileSize: guest.aadharFileSize,
      aadharPath,
    });
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from('wedding_rsvps').insert({
    id: submissionId, created_at: now, family_name: entry.familyName.trim(), primary_phone: entry.primaryPhone.trim(),
    attendance: entry.attendance, guest_count: entry.attendance === 'attending' ? entry.guestCount : 0,
    guests: savedGuests, message: entry.message.trim(),
  });

  if (error) {
    if (savedGuests.some(g => g.aadharPath)) {
      await supabase.storage.from('guest-aadhaar').remove(savedGuests.flatMap(g => g.aadharPath ? [g.aadharPath] : []));
    }
    throw new Error(`RSVP could not be saved: ${error.message}`);
  }
  return { id: submissionId, timestamp: now, dateFormatted: formatDate(now), familyName: entry.familyName.trim(), primaryPhone: entry.primaryPhone.trim(), attendance: entry.attendance, guestCount: entry.attendance === 'attending' ? entry.guestCount : 0, guests: savedGuests, message: entry.message.trim() };
}

function mapRow(row: any): StoredRSVP {
  const timestamp = row.created_at;
  return {
    id: row.id, timestamp, dateFormatted: formatDate(timestamp), familyName: row.family_name,
    primaryPhone: row.primary_phone, attendance: row.attendance, guestCount: row.guest_count,
    guests: Array.isArray(row.guests) ? row.guests : [], message: row.message || '',
  };
}

export async function getStoredRSVPs(): Promise<StoredRSVP[]> {
  const { data, error } = await supabase.from('wedding_rsvps').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(`Could not load RSVPs: ${error.message}`);
  return (data || []).map(mapRow);
}

export async function deleteStoredRSVP(id: string, guests: StoredGuest[]): Promise<void> {
  const { error } = await supabase.from('wedding_rsvps').delete().eq('id', id);
  if (error) throw new Error(`Could not delete RSVP: ${error.message}`);
  const paths = guests.flatMap(g => g.aadharPath ? [g.aadharPath] : []);
  if (paths.length) {
    const { error: storageError } = await supabase.storage.from('guest-aadhaar').remove(paths);
    if (storageError) console.error('RSVP deleted, but Aadhaar cleanup failed:', storageError.message);
  }
}

export async function getAadhaarSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from('guest-aadhaar').createSignedUrl(path, 60);
  if (error) throw new Error(`Could not open Aadhaar document: ${error.message}`);
  return data.signedUrl;
}

export function exportRSVPsToExcel(rsvps: StoredRSVP[]) {
  const summaryRows = rsvps.map((item, index) => ({
    'S.No': index + 1, 'Submission Date & Time': item.dateFormatted, 'Family Name': item.familyName,
    'Contact Phone': item.primaryPhone || 'N/A',
    'Attendance Status': item.attendance === 'attending' ? 'Joyfully Attending' : 'Declining',
    'Total Number of Guests': item.attendance === 'attending' ? item.guestCount : 0,
    'Guest Names': item.attendance === 'attending' ? item.guests.map((g, i) => `${i + 1}. ${g.name || 'Guest'}`).join('; ') : 'N/A',
    'Aadhaar Cards Uploaded': item.attendance === 'attending' ? item.guests.map((g, i) => `${i + 1}. ${g.name || 'Guest'}: ${g.aadharFileName || 'Not Uploaded'}`).join('; ') : 'N/A',
    'Wishes & Blessings': item.message || '-',
  }));
  const guestRows: Record<string, string | number>[] = [];
  let counter = 1;
  rsvps.filter(r => r.attendance === 'attending').forEach(item => item.guests.forEach(g => guestRows.push({
    'Guest S.No': counter++, 'Family / Group Name': item.familyName, 'Guest Full Name': g.name || 'Guest',
    'Contact Phone': item.primaryPhone || 'N/A', 'Aadhaar Card File Name': g.aadharFileName || 'Pending Upload',
    'Aadhaar File Size': g.aadharFileSize || 'N/A', 'Submission Date': item.dateFormatted,
  })));
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(summaryRows); ws1['!cols'] = [6,22,28,18,20,22,45,45,40].map(wch => ({ wch }));
  const ws2 = XLSX.utils.json_to_sheet(guestRows); ws2['!cols'] = [12,28,28,18,32,18,22].map(wch => ({ wch }));
  XLSX.utils.book_append_sheet(wb, ws1, 'RSVP Family Summary');
  XLSX.utils.book_append_sheet(wb, ws2, 'Hotel Check-In & Aadhaar List');
  XLSX.writeFile(wb, `Ruchika_Sanyam_Wedding_RSVP_List_${new Date().toISOString().slice(0,10)}.xlsx`);
}
