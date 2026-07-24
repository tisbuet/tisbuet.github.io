import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import landTopology from 'world-atlas/land-110m.json';
import styled, { keyframes } from 'styled-components';
import { hex2rgba } from '@utils';
import { theme, mixins, media } from '@styles';
const { colors, fontSizes, fonts } = theme;

const pulse = keyframes`
  from {
    r: 5;
    opacity: 0.6;
  }
  to {
    r: 15;
    opacity: 0;
  }
`;

// Trips revisiting the same city would otherwise stack into one unclickable pin.
// Spread repeats outward from the true location in a small spiral so every visit stays reachable.
const spreadOverlappingTrips = orderedTrips => {
  const visitCountByLocation = new Map();
  return orderedTrips.map(trip => {
    const key = `${trip.lat.toFixed(1)},${trip.lng.toFixed(1)}`;
    const visitIndex = visitCountByLocation.get(key) || 0;
    visitCountByLocation.set(key, visitIndex + 1);
    if (visitIndex === 0) return trip;
    const angle = visitIndex * 137.5 * (Math.PI / 180);
    const radius = 1.1 * visitIndex;
    return {
      ...trip,
      lat: trip.lat + radius * Math.sin(angle),
      lng: trip.lng + radius * Math.cos(angle),
    };
  });
};

const StyledStats = styled.p`
  margin: 0 0 4px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${colors.slate};
  span {
    color: ${colors.lightestSlate};
    font-weight: bold;
  }
`;
const StyledCaption = styled.p`
  margin: 0 0 20px;
  font-size: ${fontSizes.xs};
  color: ${colors.slate};
`;
const StyledMapWrapper = styled.div`
  ${mixins.boxShadow};
  position: relative;
  width: 100%;
  border-radius: ${theme.borderRadius};
  background-color: ${colors.lightNavy};
  padding: 20px 20px 10px;
  svg {
    display: block;
    overflow: visible;
  }

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
`;
const StyledPulseRing = styled.circle`
  fill: none;
  stroke: ${colors.green};
  stroke-width: 1.5;
  animation: ${pulse} 1.8s ease-out infinite;
  pointer-events: none;
`;
const StyledPin = styled.circle`
  fill: ${colors.green};
  stroke: ${colors.darkNavy};
  stroke-width: 1.5;
  r: 5;
  transition: ${theme.transition};
`;
const StyledPinNumber = styled.text`
  fill: ${colors.lightSlate};
  font-family: ${fonts.SFMono};
  font-size: 9px;
  pointer-events: none;
  user-select: none;
`;
const StyledMarkerGroup = styled.g`
  cursor: pointer;
  &:hover ${StyledPin}, &:focus ${StyledPin} {
    r: 7;
  }
  &:focus {
    outline: none;
  }
`;
const StyledDetailCard = styled.div`
  ${mixins.flexBetween};
  justify-content: flex-start;
  gap: 16px;
  margin-top: 20px;
  padding: 16px 20px;
  min-height: 44px;
  background-color: ${colors.lightNavy};
  border: 1px solid ${colors.lightestNavy};
  border-radius: ${theme.borderRadius};
  ${media.phablet`flex-direction: column; align-items: flex-start;`};
`;
const StyledDetailThumb = styled.div`
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const StyledDetailBody = styled.div`
  min-width: 0;
`;
const StyledDetailTitle = styled.div`
  color: ${colors.lightestSlate};
  font-size: ${fontSizes.md};
  font-weight: 600;
`;
const StyledDetailMeta = styled.div`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${colors.green};
  margin-top: 4px;
`;
const StyledDetailHint = styled.span`
  color: ${colors.slate};
  font-size: ${fontSizes.smil};
`;

const TravelMap = ({ trips, activeSlug, onSelectTrip }) => {
  const [hoveredSlug, setHoveredSlug] = useState(null);

  const stats = useMemo(() => {
    const countries = new Set(trips.map(trip => trip.country));
    const continents = new Set(trips.map(trip => trip.continent).filter(Boolean));
    return { trips: trips.length, countries: countries.size, continents: continents.size };
  }, [trips]);

  const orderedTrips = useMemo(() => {
    const mostRecentFirst = [...trips].sort((a, b) => new Date(b.date) - new Date(a.date));
    return spreadOverlappingTrips(mostRecentFirst);
  }, [trips]);

  const displayedSlug = hoveredSlug || activeSlug;
  const displayedTrip = orderedTrips.find(trip => trip.slug === displayedSlug);

  return (
    <div>
      <StyledStats>
        <span>{stats.trips}</span> {stats.trips === 1 ? 'trip' : 'trips'} &middot;{' '}
        <span>{stats.countries}</span> {stats.countries === 1 ? 'country' : 'countries'} &middot;{' '}
        <span>{stats.continents}</span> {stats.continents === 1 ? 'continent' : 'continents'}
      </StyledStats>
      <StyledCaption>
        Numbered most recent to oldest &middot; dashed line traces the route
      </StyledCaption>
      <StyledMapWrapper>
        <ComposableMap
          projectionConfig={{ scale: 148 }}
          width={980}
          height={480}
          style={{ width: '100%', height: 'auto' }}>
          <Geographies geography={landTopology}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: colors.lightestNavy,
                      stroke: colors.lightNavy,
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: { fill: colors.lightestNavy, outline: 'none' },
                    pressed: { fill: colors.lightestNavy, outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          {orderedTrips.slice(0, -1).map((trip, i) => {
            const next = orderedTrips[i + 1];
            return (
              <Line
                key={`${trip.slug}-to-${next.slug}`}
                from={[trip.lng, trip.lat]}
                to={[next.lng, next.lat]}
                stroke={hex2rgba(colors.green, 0.5)}
                strokeWidth={1}
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            );
          })}
          {orderedTrips.map((trip, i) => (
            <Marker key={trip.slug} coordinates={[trip.lng, trip.lat]}>
              <StyledMarkerGroup
                role="button"
                tabIndex={0}
                aria-label={`${i + 1}. ${trip.title}, ${trip.city}, ${trip.country}`}
                onMouseEnter={() => setHoveredSlug(trip.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onFocus={() => setHoveredSlug(trip.slug)}
                onBlur={() => setHoveredSlug(null)}
                onClick={() => onSelectTrip(trip.slug)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTrip(trip.slug);
                  }
                }}>
                {displayedSlug === trip.slug && <StyledPulseRing r={5} />}
                <StyledPin />
                <StyledPinNumber x={8} y={-7}>
                  {i + 1}
                </StyledPinNumber>
              </StyledMarkerGroup>
            </Marker>
          ))}
        </ComposableMap>
      </StyledMapWrapper>
      <StyledDetailCard>
        {displayedTrip ? (
          <>
            {displayedTrip.coverFixed && (
              <StyledDetailThumb>
                <img src={displayedTrip.coverFixed.src} alt={displayedTrip.title} />
              </StyledDetailThumb>
            )}
            <StyledDetailBody>
              <StyledDetailTitle>{displayedTrip.title}</StyledDetailTitle>
              <StyledDetailMeta>
                {displayedTrip.city}, {displayedTrip.country}
              </StyledDetailMeta>
            </StyledDetailBody>
          </>
        ) : (
          <StyledDetailHint>Hover, tap, or focus a pin to preview a trip</StyledDetailHint>
        )}
      </StyledDetailCard>
    </div>
  );
};

TravelMap.propTypes = {
  trips: PropTypes.array.isRequired,
  activeSlug: PropTypes.string,
  onSelectTrip: PropTypes.func.isRequired,
};

export default TravelMap;
