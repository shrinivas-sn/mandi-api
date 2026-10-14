import React from 'react';
import { Link } from 'react-router-dom';
import ArticleCode from '../ArticleCode';
import CodeSnippet from '../../../components/CodeSnippet';

const PYTHON_EXAMPLE = `from datetime import date, datetime
from zoneinfo import ZoneInfo
from math import isfinite
import requests

url = "https://mandi-api.onrender.com/v1/prices"
params = {"state": "Maharashtra", "commodity": "Onion"}

try:
    response = requests.get(url, params=params, timeout=(5, 45))
    response.raise_for_status()
    body = response.json()
except requests.RequestException as exc:
    raise SystemExit(f"Price request failed: {exc}")
except ValueError:
    raise SystemExit("The server did not return valid JSON")

if not isinstance(body, dict) or body.get("success") is not True:
    raise SystemExit("Unexpected API response")

rows = body.get("data")
if not isinstance(rows, list):
    raise SystemExit("Missing price rows")

dated_rows = []
for row in rows:
    if not isinstance(row, dict):
        continue
    try:
        reported_on = date.fromisoformat(row["arrival_date"])
        price = float(row["modal_price"])
    except (KeyError, TypeError, ValueError):
        continue
    if not isfinite(price) or price <= 0:
        continue
    dated_rows.append((reported_on, row))

if not dated_rows:
    raise SystemExit("No dated prices match this query")

latest = max(day for day, _ in dated_rows)
today_ist = datetime.now(ZoneInfo("Asia/Kolkata")).date()
age_days = (today_ist - latest).days
if age_days < 0 or age_days > 3:
    raise SystemExit(f"Latest report is {latest}; do not call it today's price")

print(f"Latest reported date: {latest} ({age_days} day(s) old)")
latest_rows = [row for day, row in dated_rows if day == latest]
for row in latest_rows[:10]:
    print(row.get("market", "Unknown market"),
          row.get("variety"), row["modal_price"], "INR/quintal")
print(f"Showing {min(10, len(latest_rows))} of {len(latest_rows)} latest rows")`;

export default function MandiPriceApiPython() {
  return (
    <>
      <p>
        You can fetch Indian mandi prices in Python without managing an API key when your use case
        fits this API's five supported states. The crucial extra step is checking the{' '}
        <code>arrival_date</code>: a successful HTTP response can still contain an older market
        report.
      </p>

      <h2>Install and run</h2>
      <p>
        Install <a href="https://docs.python-requests.org/en/latest/" target="_blank" rel="noopener noreferrer">
          Requests
        </a>{' '}
        with <code>python -m pip install requests</code>, then run this Python 3.10+ example.
        It requests onion prices for Maharashtra and prints up to ten rows from the newest
        date in the response.
      </p>
      <ArticleCode language="Python">{PYTHON_EXAMPLE}</ArticleCode>
      <p>
        The three-day age check is an example policy, not a guarantee that every mandi reports
        daily. Set your own limit for the decision your app supports. The API returns at most
        200 rows for <code>/v1/prices</code>, ordered by arrival date; this output is a recent
        sample, not a complete state-wide export.
      </p>

      <h2>Filter to a market or another crop</h2>
      <p>
        Change <code>params</code> to include a market name, for example{' '}
        <code>{'{"state": "Maharashtra", "commodity": "Onion", "market": "Pune"}'}</code>.
        The market filter is a partial-text match, so inspect the returned{' '}
        <code>market</code> and <code>variety</code> fields before displaying one value as a
        specific mandi's price. The <Link to="/docs">API docs</Link> list the other filters.
      </p>
      <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion&market=Pune" />

      <h2>Handle the cases a demo often misses</h2>
      <ul>
        <li><strong>Timeouts and server errors:</strong> the example sets connect and read timeouts and checks the HTTP status before parsing JSON. A cold backend can take longer on the first request.</li>
        <li><strong>Rate limit:</strong> the API allows 100 requests per 15 minutes per IP. If you get HTTP 429, back off instead of retrying immediately.</li>
        <li><strong>No matching records:</strong> an empty list is not a price of zero. Ask the user to change the crop, state, market or date.</li>
        <li><strong>Missing or old dates:</strong> reject malformed dates and label old reports clearly. <code>latest_fetched_at</code> is when this API fetched a row, while <code>arrival_date</code> is the market report date.</li>
        <li><strong>Several varieties or markets:</strong> don't average them silently or label the first row “the onion price.” Show the market, variety and reporting date with each value.</li>
      </ul>
      <p>
        This example uses the API's <code>modal_price</code>, reported in rupees per quintal.
        For trends rather than recent rows, use <code>/v1/prices/history</code>; its state-wide
        output is an average across reporting rows, not a single market quote. Try it in the{' '}
        <Link to="/playground">playground</Link>, and read the{' '}
        <Link to="/blog/mandi-price-data-freshness">freshness guide</Link> before putting a
        rate into an alert or farmer-facing answer.
      </p>
    </>
  );
}
