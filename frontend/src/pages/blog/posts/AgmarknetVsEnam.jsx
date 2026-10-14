import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

export default function AgmarknetVsEnam() {
  return (
    <>
      <p>
        Agmarknet and e-NAM both show Indian mandi prices, but they do different jobs.{' '}
        <strong>Agmarknet is a market-information network for reported prices and arrivals.</strong>{' '}
        <strong>e-NAM is an electronic trading platform connecting participating APMC mandis.</strong>{' '}
        The distinction matters when you choose a data source for an app.
      </p>

      <h2>What each system does</h2>
      <p>
        The <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2204750&lang=1&reg=3" target="_blank" rel="noopener noreferrer">
          Ministry of Agriculture and Farmers Welfare
        </a>{' '}
        describes Agmarknet as the portal connecting APMCs to share market price information.
        Its 2.0 upgrade added a newer portal and mobile app. The{' '}
        <a href="https://www.enam.gov.in/web/" target="_blank" rel="noopener noreferrer">official e-NAM site</a>{' '}
        describes e-NAM as a national electronic trading platform: buyers can bid online in
        connected markets and payments can be handled through the platform. e-NAM also displays
        mandi prices, which is why the two names appear together in searches.
      </p>
      <p>
        The government even provides an{' '}
        <a href="https://www.enam.gov.in/web/dashboard/Agm_Enam_ctrl" target="_blank" rel="noopener noreferrer">
          e-NAM versus Agmarknet price dashboard
        </a>. A displayed price in one system should not automatically be treated as the same
        observation, trade, variety or reporting time in the other. Compare the market, crop,
        unit and date before drawing a conclusion.
      </p>

      <h2>Which source does this API use?</h2>
      <p>
        Mandi Price API ingests the{' '}
        <a href="https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi" target="_blank" rel="noopener noreferrer">
          Agmarknet-generated daily mandi dataset on data.gov.in
        </a>. It does not ingest e-NAM bids or transactions. A response row contains its
        state, market, commodity, optional variety, minimum, maximum and modal wholesale
        prices, and <code>arrival_date</code>. You can inspect a real row here:
      </p>
      <CodeSnippet path="/v1/prices?state=Punjab&commodity=Wheat" />
      <p>
        These are reported mandi prices in rupees per quintal. They are not a guaranteed sale
        offer or a prediction of what an individual farmer will receive. The API currently
        covers Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh and Karnataka, so it cannot
        stand in for either nationwide government portal.
      </p>

      <h2>Choose the source by your task</h2>
      <ul>
        <li><strong>Studying reported wholesale prices or arrivals:</strong> begin with Agmarknet's portal or the data.gov.in dataset. Use the <Link to="/blog/agmarknet-2-api">Agmarknet 2.0 developer guide</Link> for access routes.</li>
        <li><strong>Participating in or examining e-NAM trading:</strong> use the official e-NAM platform and its own reports. This API has no e-NAM trade endpoint.</li>
        <li><strong>Adding recent Agmarknet-derived prices to a five-state app:</strong> use this API's <Link to="/docs">documented endpoints</Link> and show each record's market and reporting date.</li>
      </ul>
      <p>
        For the meaning of minimum, maximum, modal and arrival-date fields, see the{' '}
        <Link to="/blog/apmc-mandi-price-data-guide">APMC price-data guide</Link>. If you need
        to call the government dataset directly, the{' '}
        <Link to="/blog/data-gov-in-vs-mandi-api">data.gov.in API-key guide</Link> covers that
        separate request flow.
      </p>
    </>
  );
}
