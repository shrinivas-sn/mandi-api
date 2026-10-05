# Mandi Price API — Future Enhancement Plans & Retention Policy

This document outlines planned future features, data retention policies, and optimization strategies for the **Mandi Price API**.

---

## 1. Automated 30-Day Rolling Data Retention Policy

Status: planned, not built. Owner decision 05/10/2026: keep only the last 30 days of data.
Replaces the earlier 1-year plan.

### Problem
Without auto-purging, daily time-series data grows indefinitely (~3,500 rows/day = ~300 MB/year). While the Supabase Free Tier accommodates ~2 years of data (500 MB limit), long-term growth will eventually hit storage limits.

### Solution
At the end of every successful daily ingestion run in `backend/scripts/ingest.js`, delete rows
older than 30 days, **counted back from the newest `arrival_date` in the table, not from today**:

```sql
DELETE FROM mandi_prices
WHERE arrival_date < (SELECT MAX(arrival_date) FROM mandi_prices) - INTERVAL '30 days';
```

### Why the cutoff is the newest date, not `CURRENT_DATE`
From 25/09/2026 the data.gov.in API returned 502/504 and timeouts for 10+ days, so no new rows
arrived. A `CURRENT_DATE` cutoff would have kept deleting old rows during that outage and left
the API empty. Anchoring to the newest row means an upstream outage never wipes the data.

### Rules
- Run the delete only when the ingest saved records for every state (the run exits 0).
- Re-check before building: `/v1/prices/history` and the playground price chart lose any trend
  older than 30 days. Update the docs and any page copy that says how far back history goes.

### Benefits
- **Free Tier Compliance**: Storage stays at roughly 30 days of rows.
- **Zero Overhead**: Runs inside the daily ingestion (15:00 UTC / 8:30 PM IST).
- **Fast Query Performance**: Keeps database indexes lightweight and optimized.

---

## 2. Additional Future Enhancements

### A. State Expansion (v2)
- Expand coverage to additional agricultural states: *Gujarat, Rajasthan, Tamil Nadu, Andhra Pradesh, Haryana*.

### B. Bulk Export & Download Endpoints
- Add `GET /v1/export/csv` and `GET /v1/export/json` endpoints allowing researchers to download state-wide crop datasets in bulk.

### C. In-Memory Query Caching
- Implement in-memory TTL caching (e.g. Node-Cache or Redis) for static endpoints (`/v1/states`, `/v1/commodities`, `/v1/markets`) to deliver sub-10ms response times.
