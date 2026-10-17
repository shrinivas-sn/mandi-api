import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

const COMPARISON_SNIPPET = `// Node.js 18+ script: Compare Mandi Spot Price against Statutory MSP
const MANDI_API_BASE = 'https://mandi-api.vercel.app/v1';
const MSP_API_BASE = 'https://msp-benchmarks-api.vercel.app/v1';

async function evaluatePriceRealization(commodityName, stateName) {
  // 1. Fetch live APMC spot rates from Mandi Price API
  const mandiRes = await fetch(\`\${MANDI_API_BASE}/prices?state=\${encodeURIComponent(stateName)}&commodity=\${encodeURIComponent(commodityName)}&limit=10\`);
  const mandiData = await mandiRes.json();

  if (!mandiData.data || mandiData.data.length === 0) {
    console.log(\`No active mandi arrivals found for \${commodityName} in \${stateName}\`);
    return;
  }

  // 2. Fetch official MSP statutory benchmark
  const mspRes = await fetch(\`\${MSP_API_BASE}/crops/\${encodeURIComponent(commodityName.toLowerCase())}\`);
  const mspData = await mspRes.json();

  const statutoryMsp = mspData.data?.current_msp?.price_per_quintal || mspData.data?.benchmarks?.msp;
  console.log(\`=== \${commodityName.toUpperCase()} PRICE REALIZATION AUDIT (\${stateName}) ===\`);
  console.log(\`Statutory MSP Benchmark: ₹\${statutoryMsp} / quintal\`);

  // 3. Compare each active mandi modal price against MSP floor
  mandiData.data.forEach((mandi) => {
    const modalPrice = Number(mandi.modal_price);
    const realizationRatio = ((modalPrice / statutoryMsp) * 100).toFixed(1);
    const diff = modalPrice - statutoryMsp;
    const status = diff >= 0 ? 'PREMIUM (Above MSP)' : 'DISTRESS (Below MSP)';

    console.log(\`\\nMarket: \${mandi.market} | Date: \${mandi.arrival_date}\`);
    console.log(\`  Spot Modal Rate: ₹\${modalPrice}/q | Spread: ₹\${mandi.min_price} - ₹\${mandi.max_price}\`);
    console.log(\`  Realization: \${realizationRatio}% of MSP (\${diff >= 0 ? '+' : ''}\${diff} ₹/q) -> \${status}\`);
  });
}

// Example: Audit Soyabean spot rates in Madhya Pradesh
evaluatePriceRealization('Soyabean', 'Madhya Pradesh');`;

export default function MandiPricesVsMsp() {
  return (
    <>
      <p>
        <strong>
          In agricultural trading and farm finance, a commodity's spot market price only tells half the
          story without its statutory floor.
        </strong>{' '}
        While the Mandi Price API delivers daily fluctuating wholesale rates from regulated APMC markets,
        the Commission for Agricultural Costs and Prices (CACP) establishes the official Minimum Support
        Price (MSP) as an institutional safety net. Comparing these two data feeds in real time reveals
        whether farmers are realizing fair remunerative returns or experiencing localized distress selling.
      </p>

      <h2>The Disparity: APMC Modal Rates vs. Statutory Floor</h2>
      <p>
        India’s statutory MSP covers 23 mandated agricultural crops across Kharif, Rabi, and commercial seasons
        (including Paddy, Wheat, Maize, Gram, Soyabean, and Mustard). However, open market APMC mandi trading
        is driven by spot supply and demand:
      </p>
      <ul>
        <li>
          <strong>Harvest Glut Discounts:</strong> During the initial 3–4 weeks of post-monsoon harvest
          arrivals, sudden supply surges frequently push local modal prices 10% to 25% below the statutory MSP,
          particularly when state procurement centers face queuing bottlenecks or strict moisture standards.
        </li>
        <li>
          <strong>Off-Season Demand Premiums:</strong> As warehouse stocks deplete prior to the next planting
          cycle, spot rates often surge above MSP benchmarks, signaling strong private miller and exporter
          competition.
        </li>
        <li>
          <strong>Quality Dispersion:</strong> While MSP applies to Fair Average Quality (FAQ) grade produce,
          mandi reports capture actual lot arrivals across a range of moisture levels, visible through the
          spread between <code>min_price</code> and <code>max_price</code>.
        </li>
      </ul>

      <h2>The Mathematical Metric: Price Realization Ratio</h2>
      <p>
        Agri-fintech platforms, warehouse receipt lenders, and farm advisory services measure price health
        using the <strong>Price Realization Ratio (PRR)</strong>:
      </p>
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 my-4 font-mono text-sm text-saffron-300">
        Price Realization Ratio (%) = (APMC Modal Price / Statutory MSP Benchmark) × 100
      </div>
      <ul>
        <li>
          <strong>PRR &lt; 90% (Severe Distress):</strong> Indicates heavy localized distress selling. Farmers
          selling on spot markets receive substantially less than the cost-plus benchmark.
        </li>
        <li>
          <strong>90% ≤ PRR &lt; 100% (Sub-Par):</strong> Moderate price pressure; private trade is capturing
          discounts near government procurement points.
        </li>
        <li>
          <strong>PRR ≥ 100% (Market Parity / Premium):</strong> Healthy open market demand where private
          buyers offer prices equal to or higher than government procurement centers.
        </li>
      </ul>

      <h2>Integrating Mandi Spot Rates with the MSP Benchmark API</h2>
      <p>
        You can calculate this parity index automatically by pairing the keyless{' '}
        <Link to="/docs">Mandi Price API</Link> with the{' '}
        <a href="https://msp-benchmarks-api.vercel.app" target="_blank" rel="noopener noreferrer">
          Indian Minimum Support Price (MSP) & Benchmark API
        </a>:
      </p>

      <CodeSnippet code={COMPARISON_SNIPPET} language="javascript" />

      <h2>Implementation Safeguards for Production</h2>
      <ol>
        <li>
          <strong>Check <code>arrival_date</code>:</strong> Never compare today's statutory MSP against a
          stale mandi record. Always verify that <code>arrival_date</code> in the mandi payload matches the
          current trading cycle before issuing distress alerts.
        </li>
        <li>
          <strong>Normalize Commodity Spellings:</strong> Mandi records use title case with botanical or
          regional suffixes (e.g. <code>Soyabean</code> or <code>Gram(Raw)</code>), whereas statutory MSP
          series reference standard crop categories. Use a fuzzy or canonical mapping table.
        </li>
        <li>
          <strong>Account for Unit Uniformity:</strong> Both APIs standardize prices to Indian Rupees per
          quintal (<code>₹ / 100 kg</code>), eliminating conversion errors.
        </li>
      </ol>
    </>
  );
}
