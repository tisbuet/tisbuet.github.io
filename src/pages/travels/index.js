import React, { useRef, useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Layout } from '@components';
import TravelMap from '@components/travelMap';
import { FormattedIcon } from '@components/icons';
import styled from 'styled-components';
import { hex2rgba } from '@utils';
import { theme, mixins, media, Main, Heading } from '@styles';
const { colors, fontSizes, fonts } = theme;

const fontDisplay = "'Archivo Black', Impact, sans-serif";
const fontHand = "'Caveat', cursive";

const flagEmoji = countryCode =>
  countryCode
    ? String.fromCodePoint(
        ...[...countryCode.toUpperCase()].map(char => 127397 + char.charCodeAt(0)),
      )
    : '';

// Deterministic per-tile tilt so photos read as hand-pasted snapshots, not a grid —
// a lookup table (not Math.random) keeps server and client render identical.
const POLAROID_ROTATIONS = [-6, 4, -3, 5, -5, 3, -4, 6, -2, 5, -3, 4];
const polaroidRotation = seed => POLAROID_ROTATIONS[seed % POLAROID_ROTATIONS.length];

const StyledMainContainer = styled(Main)`
  max-width: 1000px;

  & > header {
    margin-bottom: 60px;

    p {
      margin-top: 15px;
      max-width: 600px;
      color: ${colors.slate};
      font-size: ${fontSizes.lg};
    }
  }
`;
const StyledFeatureList = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
`;
const StyledConnector = styled.div`
  ${mixins.flexCenter};
  align-self: center;
  height: 56px;
  margin: 2px 0;

  svg {
    width: 46px;
    height: 56px;
    overflow: visible;
  }
`;
const StyledFeature = styled.div`
  ${mixins.boxShadow};
  position: relative;
  background-color: ${colors.lightNavy};
  border-radius: ${theme.borderRadius};
  padding: 40px 32px 30px;
  transition: ${theme.transition}, transform 0.25s ease;
  transform: rotate(${p => p.$tilt || 0}deg);
  ${media.phablet`padding: 32px 20px 24px;`};

  /* a strip of "tape" pinning the page into the album */
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 30px;
    width: 46px;
    height: 17px;
    background: ${hex2rgba(colors.green, 0.5)};
    box-shadow: 0 1px 3px ${hex2rgba(colors.darkNavy, 0.4)};
    transform: rotate(-8deg);
  }

  &:hover,
  &.active {
    transform: rotate(0deg) translateY(-2px);
  }
  &.active {
    box-shadow: 0 0 0 2px ${colors.green};
  }
`;
const StyledStamp = styled.div`
  ${mixins.flexCenter};
  position: absolute;
  top: -18px;
  right: 8px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px dashed ${hex2rgba(colors.green, 0.7)};
  background-color: ${hex2rgba(colors.darkNavy, 0.65)};
  color: ${colors.green};
  font-family: ${fontHand};
  font-weight: 700;
  font-size: 22px;
  transform: rotate(-9deg);
  ${media.phablet`
    width: 46px;
    height: 46px;
    font-size: 18px;
    top: -14px;
    right: 4px;
  `};
`;
const StyledFeatureMeta = styled.div`
  ${mixins.flexBetween};
  justify-content: flex-start;
  gap: 6px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${colors.lightSlate};
  text-transform: uppercase;
  letter-spacing: 0.03em;
  svg {
    width: 13px;
    height: 13px;
  }
`;
const StyledFeatureTitle = styled.h3`
  margin: 10px 0 0;
  font-family: ${fontDisplay};
  font-size: 30px;
  letter-spacing: 0.01em;
  line-height: 1.25;
  color: ${colors.lightestSlate};
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: ${hex2rgba(colors.green, 0.55)};
  text-underline-offset: 6px;
  ${media.phablet`font-size: 23px;`};
`;
const StyledCollage = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 26px 0;
  margin: 34px 0 10px;
  padding-top: 4px;
  ${media.phablet`justify-content: center;`};
`;
const StyledPolaroid = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 168px;
  background-color: #f4efe2;
  padding: 10px 10px 32px;
  border-radius: 2px;
  box-shadow: 0 10px 18px ${hex2rgba(colors.darkNavy, 0.5)},
    0 2px 4px ${hex2rgba(colors.darkNavy, 0.3)};
  transform: rotate(${p => p.$rot || 0}deg);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  z-index: ${p => p.$z || 1};

  &:not(:first-child) {
    margin-left: -32px;
  }
  &:hover {
    transform: rotate(0deg) translateY(-6px) scale(1.08);
    box-shadow: 0 18px 26px ${hex2rgba(colors.darkNavy, 0.6)};
    z-index: 20;
  }
  &:before {
    content: '';
    position: absolute;
    top: -9px;
    left: 50%;
    width: 40px;
    height: 15px;
    transform: translateX(-50%) rotate(-3deg);
    background: ${hex2rgba(colors.green, 0.55)};
    box-shadow: 0 1px 2px ${hex2rgba(colors.darkNavy, 0.4)};
  }

  ${media.phablet`
    width: 128px;
    &:not(:first-child) { margin-left: -24px; }
  `};
`;
const StyledPolaroidPhoto = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: linear-gradient(135deg, ${colors.lightestNavy} 0%, ${colors.navy} 100%);

  img {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StyledWatermark = styled.span`
  ${mixins.flexCenter};
  position: absolute;
  inset: 0;
  font-size: 56px;
  opacity: 0.5;
  filter: grayscale(1);
`;
const StyledPolaroidCaption = styled.div`
  ${mixins.flexCenter};
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  font-family: ${fontHand};
  font-size: 18px;
  font-weight: 700;
  color: #33312c;
  white-space: nowrap;
`;
const StyledFeatureStory = styled.div`
  margin-top: 22px;
  max-width: 640px;
  color: ${colors.lightSlate};
  font-size: ${fontSizes.smil};

  p {
    margin: 0;
  }
  em {
    color: ${colors.slate};
  }
`;
const StyledFeatureTags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 18px 0 0;
  list-style: none;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.smish};
    color: ${colors.lightestSlate};
    background-color: ${hex2rgba(colors.lightestNavy, 0.6)};
    padding: 3px 10px;
    border-radius: 20px;
    margin: 0 8px 8px 0;
    &:before {
      content: '#';
      color: ${colors.green};
    }
  }
`;

const TravelsPage = ({ location, data }) => {
  const trips = data.travels.edges
    .map(({ node }) => {
      const { frontmatter, html } = node;
      return {
        slug: frontmatter.slug,
        title: frontmatter.title,
        country: frontmatter.country,
        countryCode: frontmatter.countryCode,
        continent: frontmatter.continent,
        city: frontmatter.city,
        lat: frontmatter.lat,
        lng: frontmatter.lng,
        date: frontmatter.date,
        dateDisplay: frontmatter.dateDisplay,
        flag: frontmatter.flag,
        tags: frontmatter.tags,
        html,
        photosFluid: (frontmatter.photos || [])
          .map(photo => photo?.childImageSharp?.fluid)
          .filter(Boolean),
        coverFixed: frontmatter.photos?.[0]?.childImageSharp?.fixed,
      };
    })
    // Most recent first, matching the map's numbered pins.
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const [activeSlug, setActiveSlug] = useState(null);
  const cardRefs = useRef({});

  const handleSelectTrip = slug => {
    setActiveSlug(slug);
    const card = cardRefs.current[slug];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const revealTitle = useRef(null);
  const revealCards = useRef([]);
  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    revealCards.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 50)));
  }, []);

  return (
    <Layout location={location}>
      <Helmet>
        <title>Travel Diaries | Md. Tariqul Islam</title>
        <link rel="canonical" href="https://tisbuet.github.io/travels" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <StyledMainContainer>
        <header ref={revealTitle}>
          <Heading>Travel Diaries</Heading>
          <p>
            A running map of the trips that mattered &mdash; conferences, competitions, and
            everywhere else curiosity has taken me. Hover or tap a pin to preview a trip, or
            scroll through the journal below.
          </p>
        </header>

        <TravelMap trips={trips} activeSlug={activeSlug} onSelectTrip={handleSelectTrip} />

        <StyledFeatureList>
          {trips.map((trip, i) => {
            return (
              <React.Fragment key={trip.slug}>
                {i > 0 && (
                  <StyledConnector aria-hidden="true">
                    <svg viewBox="0 0 46 56" fill="none">
                      <path
                        d="M23 2 C 23 18, 6 24, 23 32 C 34 38, 15 42, 20 52"
                        stroke={hex2rgba(colors.green, 0.6)}
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M13 46 L20 54 L28 45"
                        stroke={hex2rgba(colors.green, 0.7)}
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </StyledConnector>
                )}
                <StyledFeature
                  id={`travel-${trip.slug}`}
                  $tilt={i % 2 === 0 ? -0.6 : 0.6}
                  ref={el => {
                    cardRefs.current[trip.slug] = el;
                    revealCards.current[i] = el;
                  }}
                  className={activeSlug === trip.slug ? 'active' : ''}>
                  <StyledStamp aria-hidden="true">#{String(i + 1).padStart(2, '0')}</StyledStamp>
                  <StyledFeatureMeta>
                    <FormattedIcon name="Location" />
                    {trip.city}, {trip.country} {trip.flag || flagEmoji(trip.countryCode)}
                    &middot; {trip.dateDisplay}
                  </StyledFeatureMeta>
                  <StyledFeatureTitle>{trip.title}</StyledFeatureTitle>
                  <StyledCollage>
                    {trip.photosFluid.length > 0 ? (
                      trip.photosFluid.map((fluid, photoIndex) => (
                        <StyledPolaroid
                          key={photoIndex}
                          $rot={polaroidRotation(i * 3 + photoIndex)}
                          $z={photoIndex + 1}>
                          <StyledPolaroidPhoto>
                            <Img fluid={fluid} alt={`${trip.title} ${photoIndex + 1}`} />
                          </StyledPolaroidPhoto>
                        </StyledPolaroid>
                      ))
                    ) : (
                      <StyledPolaroid $rot={polaroidRotation(i)} $z={1}>
                        <StyledPolaroidPhoto>
                          <StyledWatermark aria-hidden="true">
                            {trip.flag || flagEmoji(trip.countryCode) || '📍'}
                          </StyledWatermark>
                        </StyledPolaroidPhoto>
                        <StyledPolaroidCaption>photo coming soon</StyledPolaroidCaption>
                      </StyledPolaroid>
                    )}
                  </StyledCollage>
                  <StyledFeatureStory dangerouslySetInnerHTML={{ __html: trip.html }} />
                  {trip.tags?.length > 0 && (
                    <StyledFeatureTags>
                      {trip.tags.map((tag, tagIndex) => (
                        <li key={tagIndex}>{tag}</li>
                      ))}
                    </StyledFeatureTags>
                  )}
                </StyledFeature>
              </React.Fragment>
            );
          })}
        </StyledFeatureList>
      </StyledMainContainer>
    </Layout>
  );
};

TravelsPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default TravelsPage;

export const pageQuery = graphql`
  {
    travels: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/travels/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            slug
            title
            country
            countryCode
            continent
            city
            lat
            lng
            date
            dateDisplay
            flag
            tags
            photos {
              childImageSharp {
                fluid(maxWidth: 500, quality: 90, traceSVG: { color: "#c9a227" }) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
                fixed(width: 112, height: 112, quality: 90) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
          html
        }
      }
    }
  }
`;
