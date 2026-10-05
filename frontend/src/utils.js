export function formatIngestionTime(isoString) {
  if (!isoString) return null;
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return null;
  }
}

// Mandis report with a lag, so only flag data older than this
export const STALE_AFTER_DAYS = 3;

// Newest arrival_date (YYYY-MM-DD) in a /v1/prices response, or null
export function newestArrivalDate(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.reduce((max, r) => (r.arrival_date > max ? r.arrival_date : max), '') || null;
}

export function isStaleArrival(dateStr) {
  const days = daysSinceArrival(dateStr);
  return days != null && days > STALE_AFTER_DAYS;
}

// Whole days between a YYYY-MM-DD arrival date and today in IST
export function daysSinceArrival(dateStr) {
  if (!dateStr) return null;
  const todayIst = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const diff = (Date.parse(todayIst) - Date.parse(dateStr)) / 86400000;
  return Number.isNaN(diff) ? null : Math.round(diff);
}

export function formatArrivalDate(dateStr, { withYear = true } = {}) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {})
  });
}
