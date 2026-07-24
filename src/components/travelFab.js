import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import { IconPlane } from '@components/icons';
import { theme, mixins, media } from '@styles';
const { colors, fontSizes, fonts, loaderDelay } = theme;

const floatFade = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: translateY(-50%) translateX(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-50%) translateX(-5px);
  }
`;
const ringPulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
`;

const StyledContainer = styled.div`
  position: fixed;
  top: 120px;
  right: 40px;
  z-index: 11;
  ${media.desktop`right: 25px;`};
  ${media.tablet`top: auto; bottom: 20px; right: 20px;`};
`;
const StyledLabel = styled.span`
  position: absolute;
  right: calc(100% + 14px);
  top: 50%;
  white-space: nowrap;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  letter-spacing: 0.05em;
  color: ${colors.green};
  pointer-events: none;
  animation: ${floatFade} 2.6s ease-in-out infinite;
  ${media.tablet`display: none;`};
`;
const StyledFab = styled(Link)`
  ${mixins.flexCenter};
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: ${colors.lightNavy};
  border: 1px solid ${colors.green};
  color: ${colors.green};
  box-shadow: 0 10px 30px -10px ${colors.shadowNavy};
  transition: ${theme.transition};

  svg {
    width: 22px;
    height: 22px;
    transition: ${theme.transition};
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid ${colors.green};
    animation: ${ringPulse} 2.2s ease-out infinite;
    pointer-events: none;
  }

  &:hover,
  &:focus {
    transform: translateY(-3px);
    background-color: ${colors.transGreen};

    svg {
      transform: translateX(2px) translateY(-2px);
    }
  }

  ${media.tablet`
    width: 46px;
    height: 46px;
  `};
`;

const TravelFab = ({ isHome, location }) => {
  const [isMounted, setIsMounted] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      return;
    }
    const timeout = setTimeout(() => setIsMounted(true), loaderDelay);
    return () => clearTimeout(timeout);
  }, []);

  if (location && location.pathname.startsWith('/travels')) {
    return null;
  }

  return (
    <StyledContainer>
      <TransitionGroup component={null}>
        {isMounted && (
          <CSSTransition classNames={isHome ? 'fade' : ''} timeout={isHome ? loaderDelay : 0}>
            <StyledFab to="/travels/" aria-label="Travel Diaries">
              <IconPlane />
              <StyledLabel aria-hidden="true">Travel Diaries</StyledLabel>
            </StyledFab>
          </CSSTransition>
        )}
      </TransitionGroup>
    </StyledContainer>
  );
};

TravelFab.propTypes = {
  isHome: PropTypes.bool,
  location: PropTypes.object,
};

export default TravelFab;
