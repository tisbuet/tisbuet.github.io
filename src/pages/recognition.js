import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { Layout, PageNav } from '@components';
import { theme, media, editorial } from '@styles';
const { fontSizes, fonts } = theme;
const {
  tokens: t,
  Page,
  PageHead,
  Eyebrow,
  DisplayTitle,
  Lede,
  Prose,
  TagList,
  VerbLink,
  eyebrowStyle,
} = editorial;

/*
 * Modelled on her "Past Keynotes & Appearances" cards: image, title, the
 * venue as location metadata, and a single verb CTA. This is the one page
 * where photos exist, so it gets the photo treatment.
 */
const StyledList = styled.ol`
  list-style: none;
  margin: 60px 0 0;
  padding: 0;
`;
const StyledEntry = styled.li`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 44px;
  align-items: start;
  padding-bottom: 56px;
  margin-bottom: 56px;
  border-bottom: 1px solid ${t.rule};
  ${media.tablet`
    grid-template-columns: 1fr;
    gap: 28px;
  `};

  &:last-child {
    border-bottom: 0;
    margin-bottom: 0;
  }
`;
const StyledPlate = styled.div`
  position: relative;
  background-color: ${t.surface};
  padding: 12px;
  border: 1px solid ${t.rule};
`;
const StyledVenue = styled.p`
  ${eyebrowStyle};
  margin: 0 0 12px;
  letter-spacing: 0.14em;
  color: ${t.accentDeep};
`;
const StyledTitle = styled.h2`
  margin: 0 0 18px;
  font-family: ${t.fontDisplay};
  font-weight: 400;
  font-size: 30px;
  line-height: 1.2;
  color: ${t.ink};
  ${media.phablet`font-size: 23px;`};
`;
const StyledNote = styled.p`
  margin: 26px 0 0;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sml};
  color: ${t.muted};
`;

const RecognitionPage = ({ location, data }) => {
  const awards = data.awards.edges.map(({ node }) => node);

  return (
    <Layout location={location}>
      <Helmet title="Recognition | Md. Tariqul Islam" />

      <Page>
        <PageHead>
          <Eyebrow>Recognition</Eyebrow>
          <DisplayTitle>Competitions, and the trips they paid for</DisplayTitle>
          <Lede>
            Top finishes in the IEEE Signal Processing Society&apos;s international student
            competitions — judged at ICIP and ICASSP against teams from around the world.
          </Lede>
        </PageHead>

        <StyledList>
          {awards.map(({ frontmatter, html }) => {
            const { title, location: venue, cover, tech, external } = frontmatter;
            return (
              <StyledEntry key={title}>
                {cover ? (
                  <StyledPlate>
                    <Img fluid={cover.childImageSharp.fluid} alt={title} />
                  </StyledPlate>
                ) : (
                  <div />
                )}

                <div>
                  {venue && <StyledVenue>{venue}</StyledVenue>}
                  <StyledTitle>{title}</StyledTitle>
                  {html && <Prose dangerouslySetInnerHTML={{ __html: html }} />}
                  {tech && (
                    <TagList>
                      {tech.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </TagList>
                  )}
                  {external && (
                    <VerbLink href={external} target="_blank" rel="nofollow noopener noreferrer">
                      READ <span>&rarr;</span>
                    </VerbLink>
                  )}
                </div>
              </StyledEntry>
            );
          })}
        </StyledList>

        <StyledNote>
          Volunteer and organizing work — including the first IEEE SPS Winter School held in
          Bangladesh — is listed under Community on the About page.
        </StyledNote>
        <PageNav pathname={location.pathname} />
      </Page>
    </Layout>
  );
};

RecognitionPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default RecognitionPage;

export const pageQuery = graphql`
  {
    awards: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/awards/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            location
            tech
            external
            cover {
              childImageSharp {
                fluid(maxWidth: 700, quality: 92) {
                  ...GatsbyImageSharpFluid_withWebp
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
