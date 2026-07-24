import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig, scholarUrl } from '@config';
import { FormattedIcon } from '@components/icons';
import styled from 'styled-components';
import { hex2rgba } from '@utils';
import { theme, mixins, media, Section, Heading } from '@styles';
import CitationsChart from './citationsChart';
const { colors, fontSizes, fonts } = theme;

const PUB_TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'patent', label: 'Patent' },
  { key: 'journal', label: 'Journal' },
  { key: 'conference', label: 'Conference' },
];

const ColoredLine = ({}) => (
  <hr
      style={{
          height: 2,
          marginBottom: 40,
          marginTop: 1
      }}
  />
);
const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
`;
const StyledBody = styled.div`
  width: 100%;
  margin-top: -20px;
  padding-left: 46px;
  ${media.tablet`padding-left: 42px;`};
  ${media.phablet`padding-left: 0;`};
`;
const StyledContent = styled.div`
  position: relative;
  grid-column: 1 / 7;
  grid-row: 1 / -1;
  ${media.thone`
    grid-column: 1 / -1;
    padding: 40px 40px 30px;
    z-index: 5;
  `};
  ${media.phablet`padding: 30px 25px 20px;`};
`;
const StyledTotalCitations = styled.p`
  margin: 0 0 20px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${colors.slate};
  span {
    color: ${colors.lightestSlate};
    font-weight: bold;
  }
  a {
    ${mixins.inlineLink};
    color: ${colors.green};
  }
`;
const StyledFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
`;
const StyledSearchInput = styled.input`
  flex: 1 1 220px;
  max-width: 320px;
  padding: 8px 14px;
  background-color: transparent;
  border: 1px solid ${colors.lightestNavy};
  border-radius: ${theme.borderRadius};
  color: ${colors.lightestSlate};
  font-family: ${fonts.Calibre};
  font-size: ${fontSizes.smil};
  &:focus {
    outline: 0;
    border-color: ${colors.green};
  }
  &::placeholder {
    color: ${colors.slate};
  }
`;
const StyledPillGroup = styled.div`
  display: flex;
  gap: 8px;
`;
const StyledPill = styled.button`
  padding: 6px 14px;
  background-color: ${props => (props.$active ? colors.transGreen : 'transparent')};
  border: 1px solid ${colors.green};
  border-radius: 20px;
  color: ${colors.green};
  font-family: ${fonts.Calibre};
  font-weight: 600;
  font-size: ${fontSizes.sml};
  cursor: pointer;
  transition: ${theme.transition};
  &:hover,
  &:focus {
    background-color: ${colors.transGreen};
    outline: 0;
  }
`;
const StyledNoResults = styled.p`
  color: ${colors.slate};
  font-size: ${fontSizes.smil};
  margin: 0 0 30px;
`;
const StyledPubTypeLabel = styled.h4`
  font-size: ${fontSizes.smish};
  font-weight: normal;
  color: ${colors.green};
  font-family: ${fonts.SFMono};
  margin: 0 0 4px;
`;
const StyledCitationBadge = styled.span`
  display: inline-block;
  margin-left: 12px;
  padding: 3px 12px;
  border-radius: 20px;
  border: 1px solid ${colors.green};
  background-color: ${hex2rgba(theme.colors.green, 0.15)};
  color: ${colors.green};
  font-family: ${fonts.Calibre};
  font-size: ${fontSizes.sml};
  font-weight: bold;
  white-space: nowrap;
  vertical-align: middle;
`;
const StyledLabel = styled.h4`
  font-size: ${fontSizes.smish};
  font-weight: normal;
  color: ${colors.green};
  font-family: ${fonts.SFMono};
  margin-top: 10px;
  padding-top: 0;
`;
const StyledProjectName = styled.h5`
  font-size: 20px;
  margin: 0 0 0;
  color: ${colors.lightestSlate};
  ${media.tablet`font-size: 24px;`};
  ${media.thone`color: ${colors.white};`};
  a {
    display: inline;
    ${media.tablet`display: block;`};
  }
`;
const StyledTechList = styled.ul`
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0px 0 10px;
  list-style: none;
  margin-bottom: 30px;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.smish};
    color: ${colors.green};
    margin-right: ${theme.margin};
    margin-bottom: 7px;
    white-space: nowrap;
    &:last-of-type {
      margin-right: 0;
    }
    ${media.thone`
      color: ${colors.green};
      margin-right: 10px;
    `};
  }
`;
const StyledLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 10px;
  margin-left: -10px;
  color: ${colors.lightestSlate};
  a {
    padding: 10px;
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;
const StyledProject = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns: auto;
  align-items: center;
  margin-bottom: 0px;
  ${media.thone`
    margin-bottom: 5px;
  `};
  &:last-of-type {
    margin-bottom: 0;
  }
  
`;

const Publications = ({ data, patents, citations, hIndex, i10Index }) => {
  const publicationsProjects = data.filter(({ node }) => node).sort((a, b) => {
    const citationsA = a.node.frontmatter.citations ?? -1;
    const citationsB = b.node.frontmatter.citations ?? -1;
    return citationsB - citationsA; // Sort descending by citation count
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');

  const query = searchQuery.trim().toLowerCase();
  const filteredPublications = publicationsProjects.filter(({ node }) => {
    const { frontmatter } = node;
    if (activeType !== 'all' && frontmatter.type !== activeType) return false;
    if (!query) return true;
    const haystack = [frontmatter.title, ...(frontmatter.tech || [])].join(' ').toLowerCase();
    return haystack.includes(query);
  });
  const filteredPatents = (patents || [])
    .filter(({ node }) => {
      if (activeType !== 'all' && activeType !== 'patent') return false;
      if (!query) return true;
      const { frontmatter } = node;
      const haystack = [frontmatter.title, ...(frontmatter.tech || [])].join(' ').toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      const citationsA = a.node.frontmatter.citations ?? -1;
      const citationsB = b.node.frontmatter.citations ?? -1;
      return citationsB - citationsA;
    });

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 50)));
  }, []);

  return (
    <StyledContainer id="publications">
      <Heading ref={revealTitle}>
        Publications & Patents [Patents: 1, Journal articles: 1, Conference articles: 6]
      </Heading>
      <StyledBody>
      {citations != null && (
        <StyledTotalCitations>
          Total Citations: <span>{citations}</span>
          {hIndex != null && (
            <>
              {' '}
              &middot; h-index: <span>{hIndex}</span>
            </>
          )}
          {i10Index != null && (
            <>
              {' '}
              &middot; i10-index: <span>{i10Index}</span>
            </>
          )}{' '}
          (<a href={scholarUrl} target="_blank" rel="nofollow noopener noreferrer">
            Google Scholar profile
          </a>)
        </StyledTotalCitations>
      )}

      <CitationsChart publications={publicationsProjects} patents={patents} />

      <StyledFilterBar>
        <StyledSearchInput
          type="text"
          placeholder="Search publications..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search publications"
        />
        <StyledPillGroup role="group" aria-label="Filter by publication type">
          {PUB_TYPE_FILTERS.map(({ key, label }) => (
            <StyledPill
              key={key}
              type="button"
              aria-pressed={activeType === key}
              $active={activeType === key}
              onClick={() => setActiveType(key)}>
              {label}
            </StyledPill>
          ))}
        </StyledPillGroup>
      </StyledFilterBar>

      {filteredPublications.length === 0 && filteredPatents.length === 0 && (
        <StyledNoResults>No publications or patents match your search.</StyledNoResults>
      )}

      <div>
        {filteredPublications &&
          filteredPublications.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const {
              external,
              title,
              location,
              tech,
              type: pubType,
              citations: pubCitations,
            } = frontmatter;

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <StyledContent>
                  {pubType && (
                    <StyledPubTypeLabel>
                      {pubType === 'journal' ? 'Journal Article' : 'Conference Paper'}
                    </StyledPubTypeLabel>
                  )}
                  <StyledProjectName>
                    {external ? (
                      <a
                        href={external}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="External Link">
                        {title}
                      </a>
                    ) : (
                      i, title
                    )}
                    {pubCitations != null && (
                      <StyledCitationBadge>
                        {pubCitations} {pubCitations === 1 ? 'citation' : 'citations'}
                      </StyledCitationBadge>
                    )}
                  </StyledProjectName>
                  <p>
                     <i>{location}</i>
                  </p>
                  {tech && (
                    <StyledTechList>
                      {tech.map((tech, i) => (
                        <li key={i}>{tech}</li>
                      ))}
                    </StyledTechList>
                  )}
                  <ColoredLine/>
                </StyledContent>
              </StyledProject>
            );
          })}
      </div>

      {filteredPatents.length > 0 && (
        <>
          <StyledLabel>Patents</StyledLabel>
          <div>
            {filteredPatents.map(({ node }, i) => {
              const { frontmatter } = node;
              const { external, title, location, tech, citations: patCitations } = frontmatter;

              return (
                <StyledProject key={i}>
                  <StyledContent>
                    <StyledProjectName>
                      <a
                        href={external}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        aria-label="External Link">
                        {title}
                      </a>
                      {patCitations != null && (
                        <StyledCitationBadge>
                          {patCitations} {patCitations === 1 ? 'citation' : 'citations'}
                        </StyledCitationBadge>
                      )}
                    </StyledProjectName>
                    <p>
                      <i>{location}</i>
                    </p>
                    {tech && (
                      <StyledTechList>
                        {tech.map((tech, i) => (
                          <li key={i}>{tech}</li>
                        ))}
                      </StyledTechList>
                    )}
                    <ColoredLine />
                  </StyledContent>
                </StyledProject>
              );
            })}
          </div>
        </>
      )}
      </StyledBody>
    </StyledContainer>
  );
};

Publications.propTypes = {
  data: PropTypes.array.isRequired,
  patents: PropTypes.array,
  citations: PropTypes.number,
  hIndex: PropTypes.number,
  i10Index: PropTypes.number,
};

export default Publications;
