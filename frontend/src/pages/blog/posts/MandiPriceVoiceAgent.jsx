import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCode from '../ArticleCode';

const TOOL_EXAMPLE = `const API = "https://mandi-api.onrender.com";
const STATES = new Set([
  "Maharashtra", "Uttar Pradesh", "Punjab",
  "Madhya Pradesh", "Karnataka"
]);

export async function getMandiPrice({ state, commodity, market }) {
  if (!STATES.has(state) || !commodity?.trim() || !market?.trim()) {
    return { ok: false, reason: "Ask for a supported state, crop and mandi." };
  }

  const url = new URL("/v1/prices", API);
  url.searchParams.set("state", state);
  url.searchParams.set("commodity", commodity.trim());
  url.searchParams.set("market", market.trim());

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch {
    return { ok: false, reason: "Price lookup is unavailable right now." };
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    return { ok: false, reason: "Price lookup failed; do not guess a rate." };
  }

  let body;
  try {
    body = await response.json();
  } catch {
    return { ok: false, reason: "Price response was invalid." };
  }
  if (body?.success !== true || !Array.isArray(body.data)) {
    return { ok: false, reason: "Price response was incomplete." };
  }

  // The API's market filter is partial, so require an exact returned name.
  const wanted = market.trim().toLocaleLowerCase("en-IN");
  const validDate = (value) => {
    if (typeof value !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {
      return false;
    }
    const parsed = new Date(value + "T00:00:00Z");
    return !Number.isNaN(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value;
  };
  const rows = body.data.filter((row) =>
    typeof row?.market === "string" &&
    row.market.trim().toLocaleLowerCase("en-IN") === wanted &&
    validDate(row.arrival_date) &&
    row.modal_price != null &&
    row.modal_price !== "" &&
    Number.isFinite(Number(row.modal_price)) &&
    Number(row.modal_price) > 0
  );
  if (!rows.length) {
    return { ok: false, reason: "No exact mandi match; ask the caller to clarify." };
  }

  const latest = rows.reduce((day, row) =>
    row.arrival_date > day ? row.arrival_date : day, "");
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric",
    month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const today = values.year + "-" + values.month + "-" + values.day;
  const age = (Date.parse(today + "T00:00:00Z") -
    Date.parse(latest + "T00:00:00Z")) / 86400000;
  if (!Number.isInteger(age) || age < 0 || age > 3) {
    return { ok: false, reason: "Latest report is from " + latest +
      "; do not call it today's price." };
  }

  const quotes = rows.filter((row) => row.arrival_date === latest)
    .map((row) => ({
      variety: row.variety || "unspecified",
      rupeesPerQuintal: Number(row.modal_price)
    }));
  return { ok: true, state, market, commodity, asOf: latest,
    quotes: quotes.slice(0, 3), moreVarieties: quotes.length > 3 };
}`;

export default function MandiPriceVoiceAgent() {
  return (
    <>
      <p>
        A farmer voice agent needs a price lookup tool, not a model-generated guess.{' '}
        <a href="https://docs.sarvam.ai/api/api-guides-tutorials/text-to-speech/use-cases/agri-rural" target="_blank" rel="noopener noreferrer">
          Sarvam's agri and rural voice-agent guide
        </a>{' '}
        calls out mandi-price tool use for exactly this reason. This example fills that
        tool boundary with this site's daily price API for its five supported states.
      </p>

      <h2>Collect the three details first</h2>
      <p>
        Ask the caller for a <strong>state, crop and mandi</strong>. A state-wide query can
        return many markets and varieties, so the agent must not turn its first row into
        “the price” for the whole state. If a spoken market name is uncertain, confirm it
        or present choices from <code>/v1/markets?state=...</code>.
      </p>

      <h2>A tool handler that returns dated facts</h2>
      <p>
        This JavaScript handler can sit behind a voice platform's tool-call interface.
        It validates the requested market against returned rows, rejects old or malformed
        dates, and returns structured quotes for the conversation layer. The three-day
        cutoff is an example policy; adjust it to your application.
      </p>
      <ArticleCode language="JavaScript">{TOOL_EXAMPLE}</ArticleCode>
      <p>
        Give the agent this instruction: “For every quoted price, say the mandi, variety,
        rupees per quintal and <code>asOf</code> date. If <code>ok</code> is false, explain
        that a current price could not be verified; never invent one.” If{' '}
        <code>moreVarieties</code> is true, ask which variety the caller means. Keep the
        full text short enough to be understood over a phone line.
      </p>

      <h2>Failure cases to test before a real call</h2>
      <ul>
        <li>Unknown state, crop or market; speech recognition can easily change a mandi's spelling.</li>
        <li>A partial market search matching several names; the handler insists on an exact returned market.</li>
        <li>HTTP 429, backend cold start, timeout, invalid JSON or an empty result; each must produce an honest “unavailable” answer.</li>
        <li>A report older than your cutoff, several crop varieties, and records with no usable modal price; the spoken answer must include the actual date and unit.</li>
      </ul>
      <p>
        The API allows 100 requests per 15 minutes per IP, so cache an accepted market
        quote for its reporting day instead of calling it on every spoken turn. Do not
        cache past the freshness policy. For the data contract and limits see the{' '}
        <Link to="/docs">API docs</Link>; for a fuller date explanation read the{' '}
        <Link to="/blog/mandi-price-data-freshness">freshness guide</Link>.
      </p>
    </>
  );
}
