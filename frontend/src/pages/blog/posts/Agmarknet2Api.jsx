import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

const DATA_GOV_REQUEST = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=<YOUR_KEY>&format=json&limit=10';

export default function Agmarknet2Api() {
  return (
    <>
      <p>
        <strong>Agmarknet 2.0 is a price-information portal, but its site calls are not a published
        developer contract.</strong> For a documented way to request Agmarknet mandi data, use the{' '}
        <a href="https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi" target="_blank" rel="noopener noreferrer">
          data.gov.in mandi dataset
        </a>{' '}
        with a data.gov.in API key. If your app only needs the five states served here, this site's
        keyless API is another route.
      </p>

      <h2>What changed in Agmarknet 2.0?</h2>
      <p>
        India's Ministry of Agriculture and Farmers Welfare said the portal was technologically
        upgraded in November 2025 and introduced a mobile app for price and arrival information. Its{' '}
        <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2204750&lang=1&reg=3" target="_blank" rel="noopener noreferrer">
          December 2025 announcement
        </a>{' '}
        describes access for farmers and market participants. The{' '}
        <a href="https://agmarknet.gov.in/doc/Final%20_RFP_Agmarknet_2.0_v0.8.pdf" target="_blank" rel="noopener noreferrer">
          Agmarknet 2.0 project specification
        </a>{' '}
        also calls for APIs that move data among APMC and state systems. That integration requirement
        is different from public documentation promising stable endpoints to outside developers.
      </p>
      <p>
        We checked the official material above on 14 October 2026 and could not find such public
        developer documentation. This does <em>not</em> mean the portal has no backend API. It means
        browser network calls and community wrappers should not be mistaken for a supported external
        contract.
      </p>

      <h2>Three ways to access the prices</h2>
      <ol>
        <li>
          <strong>Read Agmarknet 2.0 reports.</strong> Use the{' '}
          <a href="https://agmarknet.gov.in/home" target="_blank" rel="noopener noreferrer">official portal</a>{' '}
          when you need its own reports and filters rather than an integration.
        </li>
        <li>
          <strong>Use the government dataset API.</strong> data.gov.in publishes Agmarknet's daily mandi
          price dataset with minimum, maximum and modal prices. Its Data API requires a key; the{' '}
          <Link to="/blog/data-gov-in-vs-mandi-api">data.gov.in API guide</Link> explains the request
          and pagination.
        </li>
        <li>
          <strong>Use a keyless subset.</strong> Mandi Price API ingests the data.gov.in dataset and
          serves normalized JSON for Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh and
          Karnataka. It is a separate project with narrower coverage, not an Agmarknet 2.0 endpoint.
        </li>
      </ol>
      <p>
        A fourth option for research is <a href="https://api.ceda.ashoka.edu.in/documentation/" target="_blank" rel="noopener noreferrer">
          CEDA's documented Agmarknet API
        </a>. Check its access terms and data scope for your use case.
      </p>

      <h2>Make a request</h2>
      <p>
        The data.gov.in resource request uses your own key. Do not put a private key in a public
        frontend or repository:
      </p>
      <p><code>{DATA_GOV_REQUEST}</code></p>
      <p>For the five supported states, try this keyless request instead:</p>
      <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion" />
      <p>
        On 14 October 2026 that keyless endpoint returned HTTP 200 and a record with{' '}
        <code>arrival_date</code> 13 October 2026. An HTTP 200 says the API responded; it does
        not say the price was reported today. Check each row's <code>arrival_date</code> and the
        response's <code>latest_fetched_at</code> separately. See the{' '}
        <Link to="/blog/mandi-price-data-freshness">data-freshness guide</Link> before labeling
        a value “today's price.”
      </p>

      <h2>Which route should you choose?</h2>
      <p>
        Need the government dataset beyond these five states? Start with data.gov.in. Need a
        five-state prototype without key management? Use the <Link to="/docs">keyless API docs</Link>{' '}
        or <Link to="/playground">test a request in the playground</Link>. Need an Agmarknet 2.0
        portal report? Use the official site. For the older “Agmarknet API key” question, read
        the <Link to="/blog/agmarknet-api-alternative">API-key guide</Link>; this article focuses
        on what the 2.0 upgrade does and does not establish for developers.
      </p>
    </>
  );
}
