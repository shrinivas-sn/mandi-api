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

// Whole days between a YYYY-MM-DD arrival date and today in IST
export function daysSinceArrival(dateStr) {
  if (!dateStr) return null;
  const todayIst = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const diff = (Date.parse(todayIst) - Date.parse(dateStr)) / 86400000;
  return Number.isNaN(diff) ? null : Math.round(diff);
}

export function formatArrivalDate(dateStr) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
