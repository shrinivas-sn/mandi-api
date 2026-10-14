import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

export default function AgmarknetApiAlternative() {
  return (
    <>
      <p>
        If you've tried to pull daily mandi (wholesale market) prices programmatically from India's official
        sources — <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer">Agmarknet</a> or the{' '}
        <a href="https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi" target="_blank" rel="noopener noreferrer">
          data.gov.in Open Government Data (OGD) platform
        </a>, you've likely run into the same friction every developer in this space hits.
      </p>

      <h2>Do you need an Agmarknet API key?</h2>
      <p>
        To pull Agmarknet's daily mandi prices in code, the documented route is data.gov.in's Open Government Data
        API, and that needs an API key. The key is free:
      </p>
      <ol>
        <li>Create a free account at data.gov.in.</li>
        <li>Generate an API key from your account dashboard.</li>
        <li>
          Call the daily mandi price dataset with your key:{' '}
          <code>https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=&lt;your-key&gt;&amp;format=json</code>
        </li>
      </ol>
      <p>
        The full request flow, fields and pagination are in{' '}
        <Link to="/blog/data-gov-in-vs-mandi-api">how the data.gov.in API key works for mandi prices</Link>. If you
        only need Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh or Karnataka, you can skip the key entirely (see
        below).
      </p>

      <h2>The friction with the official sources</h2>
      <ul>
        <li><strong>A registration key is required.</strong> data.gov.in's OGD API needs a free account and an API key before you can make a single request — an extra step for a quick prototype or hackathon project.</li>
        <li><strong>Inconsistent field names.</strong> Response schemas vary across resources and have changed over time, which is why community wrapper packages exist just to normalize them.</li>
        <li><strong>Pagination quirks.</strong> Large date ranges or state-wide pulls require manually paging through results rather than a single clean response.</li>
        <li><strong>No built-in trend/history endpoint.</strong> Getting a price history for a specific commodity means stitching together multiple daily pulls yourself.</li>
      </ul>

      <p>
        None of this is a knock on Agmarknet — it's the authoritative national source, covering over 3,000 regulated
        markets across India, and nothing else comes close to that scope. But if you specifically need <em>Maharashtra,
        Uttar Pradesh, Punjab, Madhya Pradesh, or Karnataka</em> and want something you can hit from a terminal in
        under a minute, there's a lighter option.
      </p>

      <h2>A keyless alternative for 5 states</h2>
      <p>
        <Link to="/">Mandi Price API</Link> wraps the same underlying government data for these five states into a
        free REST API with no signup, no API key, and normalized JSON — sourced daily from data.gov.in and re-synced
        every day at 8:30 PM IST.
      </p>

      <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion" />

      <p>That's the entire integration — one HTTP request, JSON back, no auth header.</p>

      <h2>What's covered</h2>
      <ul>
        <li><code>GET /v1/states</code> — list of supported states</li>
        <li><code>GET /v1/commodities</code> — list of tracked crops, optionally filtered by state</li>
        <li><code>GET /v1/markets</code> — mandi/market list per state</li>
        <li><code>GET /v1/prices</code> — current wholesale prices by state, market, and commodity</li>
        <li><code>GET /v1/prices/history</code> — historical price trend data for charting</li>
      </ul>

      <h2>When to use which</h2>
      <p>
        If you need nationwide coverage or commodities outside the 5 supported states, Agmarknet/data.gov.in directly
        is still the right call. If your use case is scoped to Maharashtra, UP, Punjab, MP, or Karnataka and you want
        to skip the registration step, Mandi Price API is built exactly for that.
      </p>
      <p>
        Full endpoint reference is in the <Link to="/docs">docs</Link>, or try live requests in the{' '}
        <Link to="/playground">interactive playground</Link> before writing any code. For what the data itself
        contains, read <Link to="/blog/apmc-mandi-price-data-guide">the APMC mandi price data guide</Link>.
        For the newer government portal, see <Link to="/blog/agmarknet-2-api">what Agmarknet 2.0 offers developers</Link>.
      </p>
    </>
  );
}
