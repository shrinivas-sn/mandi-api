import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

export default function MandiPriceDataFreshness() {
  return (
    <>
      <p>
        A mandi-price request can succeed while the newest record is old. That is why a
        developer should check <code>arrival_date</code> before showing a rate as current.
        A healthy HTTP response proves the server answered; it does not prove that today's
        market reports have reached the database.
      </p>

      <h2>What happened to this API in September and October 2026?</h2>
      <p>
        This project's automated ingestion saved no new records between 25 September and
        12 October 2026. Earlier runs saw upstream 502/504 errors; later GitHub-hosted runs
        timed out connecting to data.gov.in. The ingestion script had also been reporting
        success despite saving zero rows. We{' '}
        <a href="https://github.com/shrinivas-sn/mandi-api/commit/e5e7891" target="_blank" rel="noopener noreferrer">
          changed it to fail visibly
        </a>{' '}
        when a state saves nothing. A manual run from India on 13 October saved 6,435 rows
        across the five supported states.
      </p>
      <p>
        Those observations show that the hosted runner's path to the data source failed
        while a request from India worked that day. They do not prove why the network paths
        differed, and they do not show that data.gov.in stopped publishing new prices.
        The daily automation still needs a reliable route.
      </p>

      <h2>Read both dates in a response</h2>
      <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion" />
      <ul>
        <li><code>arrival_date</code> is the date attached to a market price record. Use it to label the quoted price.</li>
        <li><code>fetched_at</code> on a row is when this API stored that row. The response's <code>latest_fetched_at</code> is the newest fetch timestamp among returned rows.</li>
        <li>A recent fetch does not make an older <code>arrival_date</code> a price from today. Different mandis can also report on different dates in the same response.</li>
      </ul>
      <p>
        On 14 October 2026, a live Maharashtra request returned HTTP 200 with newest{' '}
        <code>arrival_date</code> 13 October. That is a dated observation, not a promise
        about what a later request will return.
      </p>

      <h2>A safe display rule</h2>
      <ol>
        <li>Check the HTTP status and JSON <code>success</code> field. Handle network failure, 429 and server errors explicitly.</li>
        <li>Handle an empty <code>data</code> array as “no matching report,” never as a zero price.</li>
        <li>Find the newest valid <code>arrival_date</code> among the returned rows. Compare it with the current date in India and label its age.</li>
        <li>If it is too old for your use case, say “latest available price from [date]” or withhold the rate. Do not silently reuse it as today's value.</li>
        <li>Keep each market and variety separate. Missing reporting days in a history chart are gaps, not zero-price days.</li>
      </ol>
      <p>
        The <Link to="/blog/mandi-price-api-python">Python example</Link> implements a
        three-day cutoff that you can adapt. The <Link to="/status">service-status page</Link>{' '}
        checks API availability; your app must still inspect data age. For the provenance of
        these records, see <Link to="/blog/agmarknet-vs-enam">Agmarknet versus e-NAM</Link>.
      </p>
    </>
  );
}
