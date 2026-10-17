import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

const VOLATILITY_SNIPPET = `import requests
import statistics

BASE_URL = "https://mandi-api.vercel.app/v1"

def analyze_mandi_volatility(market_name, commodity="Onion", state="Maharashtra"):
    """
    Fetch recent market prices and calculate price volatility and daily velocity.
    """
    url = f"{BASE_URL}/prices"
    params = {"state": state, "market": market_name, "commodity": commodity, "limit": 30}
    
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    payload = response.json()
    records = payload.get("data", [])

    if not records:
        print(f"No records found for {commodity} in {market_name}")
        return

    # Extract modal prices and dates
    modal_prices = [float(r["modal_price"]) for r in records if "modal_price" in r]
    dates = [r["arrival_date"] for r in records if "arrival_date" in r]

    if len(modal_prices) < 2:
        print("Insufficient historical records to compute volatility.")
        return

    mean_price = statistics.mean(modal_prices)
    std_dev = statistics.stdev(modal_prices) if len(modal_prices) > 1 else 0.0
    cv = (std_dev / mean_price) * 100 if mean_price > 0 else 0.0

    print(f"=== {commodity.upper()} VOLATILITY REPORT: {market_name} ({state}) ===")
    print(f"Sample Period: {dates[-1]} to {dates[0]} ({len(modal_prices)} recorded markets)")
    print(f"Mean Modal Price: ₹{mean_price:.2f}/quintal | Std Dev: ₹{std_dev:.2f}")
    print(f"Coefficient of Variation (CV): {cv:.1f}%")

    # Calculate day-over-day velocity
    latest = modal_prices[0]
    previous = modal_prices[1]
    velocity = ((latest - previous) / previous) * 100

    print(f"Latest Arrival: ₹{latest:.2f} (prev ₹{previous:.2f}) -> Day Velocity: {velocity:+.1f}%")
    if abs(velocity) >= 15.0:
        print("⚠️ ALERT: High velocity price shock detected (> 15% day change).")

# Example: Analyze Onion wholesale rates in Lasalgaon/Nashik
analyze_mandi_volatility("Nashik", "Onion", "Maharashtra")`;

export default function CommodityPriceVolatility() {
  return (
    <>
      <p>
        <strong>
          In the Indian food economy, perishable vegetables—notably Tomato, Onion, and Potato (TOP)—exhibit
          some of the most acute price spikes of any emerging market asset class.
        </strong>{' '}
        A sudden monsoon deluge in Maharashtra or a transportation strike across Karnataka can double wholesale
        mandi rates within 48 hours. For agricultural procurement platforms, cloud kitchens, and commodity
        analysts, monitoring these volatility dynamics programmatically is essential to managing supply risk.
      </p>

      <h2>The TOP Volatility Dynamic</h2>
      <p>
        Unlike non-perishable grains (like wheat or paddy) that can be warehoused for years with buffer stock
        stabilization, vegetables have limited shelf life and concentrated harvest belts:
      </p>
      <ul>
        <li>
          <strong>Onion (Nashik, Lasalgaon, Ahmednagar):</strong> The Kharif and Rabi onion cycles dictate
          national availability. Transit delays or unseasonal hail in Nashik trigger nationwide price surges.
        </li>
        <li>
          <strong>Tomato (Kolar, Madanapalle, Pimpalgaon):</strong> Extremely heat- and moisture-sensitive.
          Yield shortfalls lead to dramatic price spikes lasting 4 to 8 weeks until the next crop flush matures.
        </li>
        <li>
          <strong>Potato (Agra, Jalandhar, Hooghly):</strong> Highly seasonal winter harvest followed by cold
          storage withdrawals. Spikes occur when cold store release rates lag urban demand.
        </li>
      </ul>

      <h2>Modal Price vs. Quality Spread</h2>
      <p>
        When evaluating APMC wholesale data, focusing solely on the <code>modal_price</code> obscures critical
        market mechanics:
      </p>
      <ul>
        <li>
          <strong>Modal Price:</strong> The most frequent transaction price observed on the auction floor on
          that trading day. It represents the bulk clearing level.
        </li>
        <li>
          <strong>Min/Max Spread (<code>max_price - min_price</code>):</strong> Measures quality heterogeneity.
          A wide spread (e.g. min ₹1,200 vs max ₹3,500) indicates that the mandi received mixed lots—damaged,
          small-caliber produce alongside premium export-grade bins. When the spread widens while modal price
          rises, prime grade produce is becoming scarce.
        </li>
      </ul>

      <h2>Detecting Supply Shocks Programmatically</h2>
      <p>
        You can build an automated early-warning detector by calculating rolling <strong>Coefficient of
        Variation (CV)</strong> and day-over-day price velocity using Python and the keyless{' '}
        <Link to="/docs">Mandi Price API</Link>:
      </p>

      <CodeSnippet code={VOLATILITY_SNIPPET} language="python" />

      <h2>Critical Gotchas: Distinguishing Market Holidays from Price Stability</h2>
      <p>
        When tracking price series across APMC yards, automated scripts often fall into subtle data traps:
      </p>
      <ol>
        <li>
          <strong>Mandi Weekly Offs and Gazetted Closures:</strong> Many mandis remain closed on Sundays,
          festival holidays, or local APMC election days. If your script fills missing days with the previous
          day's price, it artificially inflates stability metrics. Always check the distinct{' '}
          <code>arrival_date</code> string.
        </li>
        <li>
          <strong>Arrival Volumes Matter:</strong> A price spike on a day with 10 quintals of arrival is often
          a statistical outlier caused by a single boutique lot. Always cross-reference whether trading volume
          was sufficient to represent market-clearing equilibrium.
        </li>
        <li>
          <strong>Ingestion Lags:</strong> APMC auction data uploaded to the central Agmarknet network may
          experience evening batching delays. Inspect the <code>created_at</code> and <code>arrival_date</code>{' '}
          timestamps before triggering real-time procurement purchase orders.
        </li>
      </ol>
    </>
  );
}
