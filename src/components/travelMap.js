import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import rough from 'roughjs';
import { geoArea, geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import landTopology from 'world-atlas/land-110m.json';
import styled, { keyframes } from 'styled-components';
import { hex2rgba } from '@utils';
import { theme, mixins, media, tokens, ACCENT_LITERAL } from '@styles';
const { colors, fontSizes, fonts } = theme;

const WIDTH = 980;
const HEIGHT = 480;

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

// Sketching every coastline vertex at full detail balloons roughjs's jittered output
// into several MB of inline SVG path data. Two trims keep it sane: drop landmasses
// below an area threshold (tiny islands, invisible at this scale anyway — but the
// threshold is chosen to stay well under Great Britain's ~0.0058 sr and Taiwan's
// ~0.0008 sr, the smallest landmasses this site actually pins a trip to), and thin
// each remaining coastline's vertex count by a fixed stride before feeding it in.
const LAND_AREA_THRESHOLD = 0.0005;
const RING_DECIMATION_STRIDE = 8;

const decimateRing = (ring, stride) => {
  const thinned = [];
  for (let i = 0; i < ring.length; i += stride) thinned.push(ring[i]);
  const first = ring[0];
  const last = thinned[thinned.length - 1];
  if (!last || last[0] !== first[0] || last[1] !== first[1]) thinned.push(first);
  // A ring thinned below 4 points is degenerate (d3-geo can't close it) — keep it as-is;
  // small rings contribute few vertices regardless.
  return thinned.length < 4 ? ring : thinned;
};

// A fixed roughjs generator config needs a fixed `seed` per shape — otherwise the
// sketchy jitter is re-randomized on every render, and would also mismatch between
// server-rendered HTML and the client's first render (hydration error).
const roughGenerator = rough.generator();
const rawLandFeatures = feature(landTopology, landTopology.objects.land).features;
const landFeature = {
  type: 'MultiPolygon',
  coordinates: rawLandFeatures
    .flatMap(landPiece =>
      landPiece.geometry.type === 'MultiPolygon'
        ? landPiece.geometry.coordinates.map(coordinates => ({ type: 'Polygon', coordinates }))
        : [landPiece.geometry],
    )
    .filter(polygon => geoArea(polygon) > LAND_AREA_THRESHOLD)
    .map(polygon => polygon.coordinates.map(ring => decimateRing(ring, RING_DECIMATION_STRIDE))),
};
const projection = geoEqualEarth().fitSize([WIDTH, HEIGHT], landFeature);
const pathGenerator = geoPath(projection);
const landPaths = roughGenerator.toPaths(
  roughGenerator.path(pathGenerator(landFeature), {
    fill: hex2rgba(ACCENT_LITERAL, 0.16),
    fillStyle: 'hachure',
    hachureGap: 14,
    fillWeight: 1,
    stroke: hex2rgba(ACCENT_LITERAL, 0.5),
    strokeWidth: 1.4,
    roughness: 1.3,
    bowing: 1,
    seed: 1,
    disableMultiStroke: true,
    disableMultiStrokeFill: true,
  }),
);

const StyledStats = styled.p`
  margin: 0 0 20px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${tokens.muted};
  span {
    color: ${tokens.ink};
    font-weight: bold;
  }
`;
const StyledMapWrapper = styled.div`
  ${mixins.boxShadow};
  position: relative;
  width: 100%;
  border-radius: ${theme.borderRadius};
  background-color: ${tokens.surface};
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
    background: rgba(var(--accent-rgb), 0.5);
    box-shadow: 0 1px 3px rgba(var(--shadow-rgb), 0.25);
    transform: rotate(-8deg);
  }
`;
const StyledPulseRing = styled.circle`
  fill: none;
  stroke: ${tokens.accentDeep};
  stroke-width: 1.5;
  animation: ${pulse} 1.8s ease-out infinite;
  pointer-events: none;
`;
const StyledStampRing = styled.circle`
  fill: ${tokens.surface};
  stroke: ${tokens.accentDeep};
  stroke-width: 1.5;
  stroke-dasharray: 3 2.5;
  r: 8;
  transition: ${theme.transition};
`;
const StyledStampDot = styled.circle`
  fill: ${tokens.accentDeep};
  r: 3;
  pointer-events: none;
  transition: ${theme.transition};
`;
const StyledMarkerGroup = styled.g`
  cursor: pointer;
  &:hover ${StyledStampRing}, &:focus ${StyledStampRing} {
    r: 10;
  }
  &:hover ${StyledStampDot}, &:focus ${StyledStampDot} {
    r: 4;
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
  background-color: ${tokens.surface};
  border: 1px solid ${tokens.rule};
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
  color: ${tokens.ink};
  font-size: ${fontSizes.md};
  font-weight: 600;
`;
const StyledDetailMeta = styled.div`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${tokens.accentDeep};
  margin-top: 4px;
`;
const StyledDetailHint = styled.span`
  color: ${tokens.muted};
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
    return spreadOverlappingTrips(mostRecentFirst).map(trip => {
      const [x, y] = projection([trip.lng, trip.lat]);
      return { ...trip, x, y };
    });
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
      <StyledMapWrapper>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height="auto">
          {landPaths.map((path, i) => (
            <path
              key={i}
              d={path.d}
              stroke={path.stroke}
              strokeWidth={path.strokeWidth}
              fill="none"
            />
          ))}
          {orderedTrips.map(trip => (
            <g key={trip.slug} transform={`translate(${trip.x}, ${trip.y})`}>
              <StyledMarkerGroup
                role="button"
                tabIndex={0}
                aria-label={`${trip.title}, ${trip.city}, ${trip.country} — visited`}
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
                {displayedSlug === trip.slug && <StyledPulseRing r={9} />}
                <StyledStampRing />
                <StyledStampDot />
              </StyledMarkerGroup>
            </g>
          ))}
        </svg>
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
