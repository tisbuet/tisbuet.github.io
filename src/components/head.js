import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import config from '@config';
import { palettes } from '@styles';
import ogImage from '@images/og.png';

/*
 * The share card (src/images/og.png) is 1200x630 — the size every platform
 * expects for a large-image preview. Regenerate it if the name or title
 * changes; it is a flat image and does not read from config.
 */
// config.siteUrl carries a trailing slash and the webpack asset path a leading
// one, so join them explicitly rather than concatenating into `//static/...`.
const ogImageUrl = `${config.siteUrl.replace(/\/$/, '')}${ogImage}`;

const Head = ({ metadata }) => (
  <Helmet>
    <html lang="en" prefix="og: http://ogp.me/ns#" />
    <title itemProp="name" lang="en">
      {metadata.title}
    </title>
    <link rel="canonical" href="https://tisbuet.github.io" />

    <meta name="description" content={metadata.description} />
    <meta name="keywords" content={config.siteKeywords} />
    <meta name="google-site-verification" content={config.googleVerification} />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={metadata.siteUrl} />
    <meta property="og:site_name" content={metadata.title} />
    <meta property="og:image" content={ogImageUrl} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content={metadata.title} />
    <meta property="og:locale" content={config.siteLanguage} />
    <meta itemProp="name" content={metadata.title} />
    <meta itemProp="description" content={metadata.description} />
    <meta itemProp="image" content={ogImageUrl} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={metadata.siteUrl} />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />
    <meta name="twitter:image" content={ogImageUrl} />
    <meta name="twitter:image:alt" content={metadata.title} />

    <meta name="msapplication-TileColor" content={palettes.dark.paper} />
    <meta name="theme-color" content={palettes.dark.paper} />
  </Helmet>
);

export default Head;

Head.propTypes = {
  metadata: PropTypes.object.isRequired,
};
