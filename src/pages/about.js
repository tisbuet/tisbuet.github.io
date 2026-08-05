import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { Layout, PageNav } from '@components';
import { theme, media, editorial } from '@styles';
const { fontSizes, fonts } = theme;
const { tokens: t, Page, PageHead, Eyebrow, DisplayTitle, Lede, Prose } = editorial;

// Roles used to live here; they now have their own page at /experience so the
// two aren't duplicated. This page is the biography and the toolset.

const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 70px;
  align-items: start;
  margin-top: 60px;
  ${media.tablet`
    grid-template-columns: 1fr;
    gap: 48px;
  `};
`;
const StyledPortrait = styled.div`
  position: sticky;
  top: 140px;
  ${media.tablet`position: relative; top: 0; max-width: 320px;`};

  &:after {
    content: '';
    position: absolute;
    top: 14px;
    left: 14px;
    width: 100%;
    height: 100%;
    border: 1px solid ${t.accent};
    z-index: -1;
  }
`;
const StyledAvatar = styled(Img)`
  filter: grayscale(100%) contrast(1.05);
`;
const StyledSkills = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 34px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 6px 14px;
    border: 1px solid ${t.rule};
    border-radius: 2px;
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.smi};
    color: ${t.inkSoft};
    background-color: ${t.surface};
  }
`;

const AboutPage = ({ location, data }) => {
  const about = data.about.edges[0].node;

  return (
    <Layout location={location}>
      <Helmet title="About | Md. Tariqul Islam" />

      <Page>
        <PageHead>
          <Eyebrow>About</Eyebrow>
          <DisplayTitle>From speech models to public revenue</DisplayTitle>
          <Lede>
            Five years building AI systems in industry, seven publications and a patent in applied
            research, and a new chapter in Bangladesh&apos;s customs administration.
          </Lede>
        </PageHead>

        <StyledLayout>
          <div>
            <Prose dangerouslySetInnerHTML={{ __html: about.html }} />
            {about.frontmatter.skills && (
              <StyledSkills>
                {about.frontmatter.skills.map(skill => (
                  <li key={skill}>{skill}</li>
                ))}
              </StyledSkills>
            )}
          </div>

          <StyledPortrait>
            <StyledAvatar
              fluid={about.frontmatter.avatar.childImageSharp.fluid}
              alt="Md. Tariqul Islam"
            />
          </StyledPortrait>
        </StyledLayout>
        <PageNav pathname={location.pathname} />
      </Page>
    </Layout>
  );
};

AboutPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default AboutPage;

export const pageQuery = graphql`
  {
    about: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/about/" } }) {
      edges {
        node {
          frontmatter {
            title
            skills
            avatar {
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
