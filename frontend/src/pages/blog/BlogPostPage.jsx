import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BlogPostLayout from './BlogPostLayout';
import { BLOG_POSTS } from '../../blogRoutes';
import AgmarknetApiAlternative from './posts/AgmarknetApiAlternative';
import ApmcMandiPriceDataGuide from './posts/ApmcMandiPriceDataGuide';
import DataGovInVsMandiApi from './posts/DataGovInVsMandiApi';
import Agmarknet2Api from './posts/Agmarknet2Api';
import MandiPriceApiPython from './posts/MandiPriceApiPython';
import AgmarknetVsEnam from './posts/AgmarknetVsEnam';
import MandiPriceDataFreshness from './posts/MandiPriceDataFreshness';
import MandiPriceVoiceAgent from './posts/MandiPriceVoiceAgent';
import MandiPricesVsMsp from './posts/MandiPricesVsMsp';
import CommodityPriceVolatility from './posts/CommodityPriceVolatility';

const POST_COMPONENTS = {
  'agmarknet-api-alternative': AgmarknetApiAlternative,
  'apmc-mandi-price-data-guide': ApmcMandiPriceDataGuide,
  'data-gov-in-vs-mandi-api': DataGovInVsMandiApi,
  'agmarknet-2-api': Agmarknet2Api,
  'mandi-price-api-python': MandiPriceApiPython,
  'agmarknet-vs-enam': AgmarknetVsEnam,
  'mandi-price-data-freshness': MandiPriceDataFreshness,
  'mandi-price-voice-agent': MandiPriceVoiceAgent,
  'mandi-prices-vs-msp-benchmarks': MandiPricesVsMsp,
  'commodity-price-volatility-tracker': CommodityPriceVolatility
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const meta = BLOG_POSTS.find((p) => p.path === `/blog/${slug}`);
  const Content = POST_COMPONENTS[slug];

  if (!meta || !Content) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <BlogPostLayout meta={meta}>
      <Content />
    </BlogPostLayout>
  );
}
