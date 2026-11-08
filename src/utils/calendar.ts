/**
 * Calendar utilities for Ruchika & Sanyam's Wedding (#tereSAngRUh)
 */

export function generateGoogleCalendarUrl(
  title: string,
  details: string,
  location: string,
  startDateISO: string,
  endDateISO: string
): string {
  // Format: YYYYMMDDTHHmmssZ
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const start = formatTime(startDateISO);
  const end = formatTime(endDateISO);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(
  title: string,
  details: string,
  location: string,
  startDateISO: string,
  endDateISO: string,
  fileName: string = "wedding_invite.ics"
) {
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const start = formatTime(startDateISO);
  const end = formatTime(endDateISO);
  const now = formatTime(new Date().toISOString());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ruchika & Sanyam Wedding//tereSAngRUh//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-${Date.now()}@teresangruh.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
