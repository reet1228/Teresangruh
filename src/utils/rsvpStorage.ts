/** Supabase-backed RSVP storage and Excel export for Ruchika & Sanyam. */
import ExcelJS from 'exceljs';
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
  console.log("Testing Aadhaar storage path:", path);

  const { data, error } = await supabase.storage
    .from('guest-aadhaar')
    .list(path.split('/')[0]);

  console.log("Storage folder contents:", data);
  console.log("Storage list error:", error);

  if (error) {
    throw new Error(`Storage check failed: ${error.message}`);
  }

  const fileName = path.split('/').pop();

  const fileExists = data?.some(file => file.name === fileName);

  if (!fileExists) {
    throw new Error(`File not found in storage folder: ${fileName}`);
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from('guest-aadhaar')
    .createSignedUrl(path, 300);

  if (signedError) {
    throw new Error(`Signed URL failed: ${signedError.message}`);
  }

  return signedData.signedUrl;
}


export async function exportRSVPsToExcel(rsvps: StoredRSVP[]) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = 'Ruchika & Sanyam Wedding';
  workbook.created = new Date();

  // Sheet 1: Family summary
  const summary = workbook.addWorksheet('RSVP Family Summary');

  summary.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Submission Date & Time', key: 'date', width: 24 },
    { header: 'Family Name', key: 'family', width: 25 },
    { header: 'Contact Phone', key: 'phone', width: 18 },
    { header: 'Attendance Status', key: 'attendance', width: 22 },
    { header: 'Total Guests', key: 'count', width: 15 },
    { header: 'Guest Names', key: 'names', width: 40 },
    { header: 'Aadhaar Cards Uploaded', key: 'aadhaar', width: 40 },
    { header: 'Wishes & Blessings', key: 'message', width: 35 },
  ];

  rsvps.forEach((item, index) => {
    summary.addRow({
      sno: index + 1,
      date: item.dateFormatted,
      family: item.familyName,
      phone: item.primaryPhone || 'N/A',
      attendance: item.attendance === 'attending'
        ? 'Joyfully Attending' : 'Declining',
      count: item.attendance === 'attending' ? item.guestCount : 0,
      names: item.guests.map(g => g.name).join('; '),
      aadhaar: item.guests.map(g =>
        `${g.name}: ${g.aadharFileName || 'Not Uploaded'}`
      ).join('; '),
      message: item.message || '-',
    });
  });

  // Sheet 2: Hotel check-in with Aadhaar thumbnails
  const hotel = workbook.addWorksheet('Hotel Check-In & Aadhaar List');

  hotel.columns = [
    { header: 'Guest S.No', key: 'sno', width: 12 },
    { header: 'Family / Group Name', key: 'family', width: 25 },
    { header: 'Guest Full Name', key: 'name', width: 25 },
    { header: 'Contact Phone', key: 'phone', width: 18 },
    { header: 'Aadhaar File Name', key: 'filename', width: 30 },
    { header: 'File Size', key: 'size', width: 16 },
    { header: 'Submission Date', key: 'date', width: 24 },
    { header: 'Aadhaar Thumbnail', key: 'image', width: 23 },
  ];

  let counter = 1;

  for (const item of rsvps.filter(r => r.attendance === 'attending')) {
    for (const guest of item.guests) {
      const row = hotel.addRow({
        sno: counter++,
        family: item.familyName,
        name: guest.name || 'Guest',
        phone: item.primaryPhone || 'N/A',
        filename: guest.aadharFileName || 'Not uploaded',
        size: guest.aadharFileSize || 'N/A',
        date: item.dateFormatted,
        image: guest.aadharPath ? 'Loading image...' : 'Not uploaded',
      });

      row.height = 82;

      if (!guest.aadharPath) continue;

      try {
        const signedUrl = await getAadhaarSignedUrl(guest.aadharPath);
        const response = await fetch(signedUrl);

       if (!response.ok) {
  row.getCell(8).value = `Fetch failed: HTTP ${response.status}`;
  continue;
}
        const contentType = response.headers.get('content-type') || '';
        const extension = guest.aadharPath.split('.').pop()?.toLowerCase();

        let imageExtension: 'jpeg' | 'png' | 'gif' | null = null;

        if (contentType.includes('jpeg') || extension === 'jpg' || extension === 'jpeg') {
          imageExtension = 'jpeg';
        } else if (contentType.includes('png') || extension === 'png') {
          imageExtension = 'png';
        } else if (contentType.includes('gif') || extension === 'gif') {
          imageExtension = 'gif';
        }

        if (!imageExtension) {
          row.getCell(8).value = 'Unsupported image format';
          continue;
        }

        const imageBuffer = new Uint8Array(await response.arrayBuffer());

        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: imageExtension,
        });

        hotel.addImage(imageId, {
          tl: { col: 7, row: row.number - 1 },
          br: { col: 8, row: row.number },
          editAs: 'oneCell',
        });

        row.getCell(8).value = '';
    } catch (error) {
  console.error('Aadhaar thumbnail export failed:', error);

  row.getCell(8).value =
    error instanceof Error
      ? `Error: ${error.message}`
      : `Error: ${String(error)}`;
}
    }
  }

  // Style worksheet headings
  [summary, hotel].forEach(sheet => {
    const header = sheet.getRow(1);
    header.height = 30;
    header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    header.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '80602F' },
    };
    header.alignment = { vertical: 'middle', horizontal: 'center' };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
  });

  // Download workbook
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob(
    [new Uint8Array(buffer)],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `Ruchika_Sanyam_Wedding_RSVP_${new Date().toISOString().slice(0, 10)}.xlsx`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

  
