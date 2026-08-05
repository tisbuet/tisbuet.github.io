import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { navLinks } from '@config';
import { theme, media, editorial } from '@styles';
const { fontSizes, fonts } = theme;
const { tokens: t, eyebrowStyle } = editorial;

/*
 * Previous / next pager at the foot of each page. The order is derived from
 * config.navLinks rather than hard-coded, so reordering or adding a nav entry
 * updates every pager on the site.
 *
 * Home is prepended so /about has somewhere to go backwards to.
 */
const SEQUENCE = [{ name: 'Home', url: '/' }, ...navLinks];

// tolerate both /about and /about/ (Gatsby's trailingSlash: 'ignore')
const normalize = path => (path.length > 1 ? path.replace(/\/+$/, '') : path);

const StyledNav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 90px;
  padding-top: 34px;
  border-top: 1px solid ${t.ruleStrong};
  ${media.tablet`margin-top: 64px;`};
  ${media.phablet`
    grid-template-columns: 1fr;
    gap: 28px;
  `};
`;
const StyledSide = styled.div`
  min-width: 0;
  text-align: ${props => (props.$align === 'right' ? 'right' : 'left')};
  ${media.phablet`text-align: left;`};
`;
const StyledLabel = styled.span`
  ${eyebrowStyle};
  display: block;
  margin-bottom: 10px;
  letter-spacing: 0.16em;
  color: ${t.muted};
`;
const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  font-family: ${t.fontDisplay};
  font-size: 25px;
  line-height: 1.2;
  color: ${t.ink};
  ${media.phablet`font-size: 21px;`};

  &:hover,
  &:focus {
    color: ${t.accentDeep};
  }

  .arrow {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.md};
    color: ${t.accent};
    transition: ${theme.transition};
  }
  &:hover .arrow {
    transform: translateX(${props => (props.$direction === 'prev' ? '-4px' : '4px')});
  }
`;

const PageNav = ({ pathname }) => {
  const here = normalize(pathname || '');
  const index = SEQUENCE.findIndex(link => normalize(link.url) === here);

  // pages outside the sequence (posts, tags, travels, archive) get no pager
  if (index === -1) {
    return null;
  }

  const prev = SEQUENCE[index - 1];
  const next = SEQUENCE[index + 1];
  if (!prev && !next) {
    return null;
  }

  return (
    <StyledNav aria-label="Previous and next page">
      <StyledSide>
        {prev && (
          <>
            <StyledLabel>Previous</StyledLabel>
            <StyledLink to={prev.url} $direction="prev" rel="prev">
              <span className="arrow" aria-hidden="true">
                &larr;
              </span>
              {prev.name}
            </StyledLink>
          </>
        )}
      </StyledSide>

      <StyledSide $align="right">
        {next && (
          <>
            <StyledLabel>Next</StyledLabel>
            <StyledLink to={next.url} $direction="next" rel="next">
              {next.name}
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </StyledLink>
          </>
        )}
      </StyledSide>
    </StyledNav>
  );
};

PageNav.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default PageNav;
