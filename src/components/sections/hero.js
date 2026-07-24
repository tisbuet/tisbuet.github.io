import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { email } from '@config';
import styled from 'styled-components';
import { theme, mixins, media, Section } from '@styles';
const { colors, fontSizes, fonts, navDelay, loaderDelay } = theme;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  margin-top: 40px;
  margin-left: 40px;
  ${media.tablet`padding-top: 150px;`};
  div {
    width: 100%;
  }
`;
const StyledOverline = styled.h1`
  color: ${colors.green};
  margin: 0 0 20px 3px;
  font-size: ${fontSizes.md};
  font-family: ${fonts.Calibre};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  ${media.desktop`font-size: ${fontSizes.sm};`};
  ${media.tablet`font-size: ${fontSizes.smish};`};
`;
const StyledTitle = styled.h2`
  font-size: 50px;
  line-height: 1.1;
  margin: 0;
  ${media.desktop`font-size: 50px;`};
  ${media.tablet`font-size: 45px;`};
  ${media.phablet`font-size: 40px;`};
  ${media.phone`font-size: 35px;`};
`;
const StyledSubtitle = styled.h3`
  font-size: 35px;
  line-height: 1.0;
  color: ${colors.slate};
  ${media.desktop`font-size: 35px;`};
  ${media.tablet`font-size: 35px;`};
  ${media.phablet`font-size: 30px;`};
  ${media.phone`font-size: 30px;`};
`;
const StyledDescription = styled.div`
  margin-top: 25px;
  width: 50%;
  max-width: 800px;
  a {
    ${mixins.inlineLink};
  }
`;
const StyledEmailLink = styled.a`
  ${mixins.bigButton};
  margin-top: 50px;
`;

const Hero = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const { frontmatter, html } = data[0].node;

  const one = () => <StyledOverline>{frontmatter.title}</StyledOverline>;
  const two = () => <StyledTitle>{frontmatter.name}.</StyledTitle>;
  const three = () => <StyledSubtitle>{frontmatter.subtitle}</StyledSubtitle>;
  const four = () => (
    <StyledDescription dangerouslySetInnerHTML={{ __html: html }} />
  );
  const five = () => (
    <div>
      <StyledEmailLink href={`mailto:${email}`}>Contact Me</StyledEmailLink>
    </div>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledContainer>
      <TransitionGroup component={null}>
        {isMounted &&
          items.map((item, i) => (
            <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
              {item}
            </CSSTransition>
          ))}
      </TransitionGroup>
    </StyledContainer>
  );
};

Hero.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Hero;
