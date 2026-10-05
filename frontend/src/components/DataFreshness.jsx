import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { newestArrivalDate, isStaleArrival, formatArrivalDate, STALE_AFTER_DAYS } from '../utils';

// Shown only when the newest prices are more than STALE_AFTER_DAYS old.
// Hidden while loading, on fresh data, and on any fetch error, so it never shows a wrong date.
export default function DataFreshness() {
  const [newestDate, setNewestDate] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkFreshness() {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/prices?state=Maharashtra`);
        const data = await res.json();
        if (isMounted && data?.success) setNewestDate(newestArrivalDate(data.data));
      } catch (err) {
        // Stay hidden: StatusBadge already reports an unreachable API
      }
    }

    checkFreshness();
    return () => { isMounted = false; };
  }, []);

  if (!isStaleArrival(newestDate)) return null;

  const label = `Prices as of ${formatArrivalDate(newestDate)}`;

  return (
    <NavLink
      to="/status"
      className="status-pill data-freshness-pill"
      title={`No new prices from data.gov.in for more than ${STALE_AFTER_DAYS} days. ${label}.`}
      aria-label={`${label}. No new prices for more than ${STALE_AFTER_DAYS} days. View status.`}
      style={{
        background: 'rgba(232, 196, 104, 0.15)',
        border: '1px solid rgba(232, 196, 104, 0.4)',
        color: 'var(--status-warn)'
      }}
    >
      <div className="status-dot" style={{ backgroundColor: 'var(--status-warn)', boxShadow: 'none', animation: 'none' }} />
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
    </NavLink>
  );
}
