import React from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { Layout } from '@components';
import { email } from '@config';
import { theme, mixins, media, editorial } from '@styles';
const { fontSizes, fonts } = theme;
const {
  tokens: t,
  Band,
  Measure,
  Eyebrow,
  DisplayTitle,
  Lede,
  SectionTitle,
  StatRow,
  Button,
  eyebrowStyle,
} = editorial;

/* --------------------------------------------------------------------- hero */

const StyledHero = styled.section`
  padding: 190px 0 110px;
  ${media.tablet`padding: 160px 0 80px;`};
  ${media.phablet`padding: 140px 0 64px;`};
`;
const StyledHeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 70px;
  align-items: center;
  ${media.tablet`
    grid-template-columns: 1fr;
    gap: 48px;
  `};
`;
const StyledCredentials = styled.p`
  ${eyebrowStyle};
  margin: 26px 0 0;
  letter-spacing: 0.12em;
  color: ${t.muted};
`;
const StyledPortrait = styled.div`
  position: relative;
  ${media.tablet`max-width: 380px;`};

  /* offset gold frame — the one flourish carried over from the old build */
  &:after {
    content: '';
    position: absolute;
    top: 16px;
    left: 16px;
    width: 100%;
    height: 100%;
    border: 1px solid ${t.accent};
    z-index: -1;
  }
`;
const StyledAvatar = styled(Img)`
  filter: grayscale(100%) contrast(1.05);
  transition: ${theme.transition};
  &:hover {
    filter: none;
  }
`;

/* ------------------------------------------------------------------ mission */

const StyledPillars = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px 60px;
  margin-top: 60px;
  ${media.tablet`grid-template-columns: 1fr; gap: 36px;`};
`;
const StyledPillar = styled.div`
  padding-top: 26px;
  border-top: 1px solid ${t.ruleStrong};

  h3 {
    margin: 0 0 12px;
    font-family: ${t.fontDisplay};
    font-weight: 400;
    font-size: 23px;
    color: ${t.ink};
  }
  p {
    margin: 0;
    font-size: ${fontSizes.md};
    line-height: 1.55;
    color: ${t.inkSoft};
  }
`;
const StyledPillarNum = styled.span`
  ${eyebrowStyle};
  display: block;
  margin-bottom: 14px;
  color: ${t.accentDeep};
`;

/* --------------------------------------------------------- featured research */

const StyledFeatureList = styled.ol`
  list-style: none;
  margin: 50px 0 0;
  padding: 0;
`;
const StyledFeature = styled.li`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: baseline;
  padding: 26px 0;
  border-bottom: 1px solid ${t.rule};
  ${media.phablet`grid-template-columns: 1fr; gap: 8px;`};

  h3 {
    margin: 0;
    font-family: ${t.fontDisplay};
    font-weight: 400;
    font-size: 21px;
    line-height: 1.3;
    color: ${t.ink};
    ${media.phablet`font-size: 18px;`};
  }
  p {
    margin: 8px 0 0;
    font-size: ${fontSizes.sm};
    font-style: italic;
    color: ${t.muted};
  }
  b {
    font-family: ${t.fontDisplay};
    font-weight: 400;
    font-size: 28px;
    color: ${t.ink};
    white-space: nowrap;
  }
  b span {
    ${eyebrowStyle};
    font-size: ${fontSizes.xs};
    letter-spacing: 0.12em;
    color: ${t.muted};
    margin-left: 8px;
  }
`;

/* ------------------------------------------------------- recognition gallery */

const StyledGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 54px;
  ${media.tablet`grid-template-columns: 1fr;`};
`;
const StyledPlate = styled.div`
  figcaption,
  p {
    margin: 16px 0 0;
    font-size: ${fontSizes.sm};
    color: ${t.muted};
  }
  strong {
    display: block;
    margin-bottom: 4px;
    font-family: ${t.fontDisplay};
    font-weight: 400;
    font-size: 19px;
    color: ${t.ink};
  }
`;

const StyledInlineLink = styled(Link)`
  ${mixins.inlineLink};
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sml};
  letter-spacing: 0.08em;
  color: ${t.accentDeep};
  &:after {
    background-color: ${t.accentDeep};
  }
`;

// Placeholder framing — the four areas are drawn from content/about, but the
// wording here is mine and should be replaced with Tariqul's own.
const PILLARS = [
  {
    title: 'Speech & language systems',
    body: 'Large language models, text-to-speech including emotional TTS, speech denoising and speaker diarization — shipped in production for government and enterprise clients.',
  },
  {
    title: 'Applied research',
    body: 'Peer-reviewed work spanning automatic speech recognition, sound source localization and medical signal analysis, plus one granted patent.',
  },
  {
    title: 'Community',
    body: 'Built the IEEE Signal Processing Society student chapter at BUET, organizing the first IEEE SPS Winter School held in Bangladesh.',
  },
  {
    title: 'Public service',
    body: 'Recommended for the BCS Customs and Excise Cadre as an Assistant Commissioner — bringing AI, analytics and digital governance to revenue administration.',
  },
];

const IndexPage = ({ location, data }) => {
  const hero = data.hero.edges[0].node;
  const about = data.about.edges[0].node;
  const totalCitations = data.scholarProfile.edges[0]?.node.citations;

  const works = [
    ...data.publications.edges.map(({ node }) => node.frontmatter),
    ...data.patents.edges.map(({ node }) => node.frontmatter),
  ].sort((a, b) => (b.citations ?? -1) - (a.citations ?? -1));
  const featured = works.slice(0, 3);

  return (
    <Layout location={location}>
      <main>
        <Measure>
          <StyledHero>
            <StyledHeroGrid>
              <div>
                <Eyebrow>{hero.frontmatter.title}</Eyebrow>
                <DisplayTitle>{hero.frontmatter.name}</DisplayTitle>
                <StyledCredentials>
                  Senior NLP Engineer · Researcher · BCS Customs &amp; Excise
                </StyledCredentials>
                <Lede as="div" dangerouslySetInnerHTML={{ __html: hero.html }} />
                <Button as={Link} to="/about">
                  MORE ABOUT ME
                </Button>
              </div>

              <StyledPortrait>
                <StyledAvatar
                  fluid={about.frontmatter.avatar.childImageSharp.fluid}
                  alt="Md. Tariqul Islam"
                />
              </StyledPortrait>
            </StyledHeroGrid>
          </StyledHero>
        </Measure>

        <Band $alt>
          <Measure>
            <Eyebrow>What I work on</Eyebrow>
            <SectionTitle>Building AI that holds up outside the lab</SectionTitle>
            <Lede>
              Five years of shipping speech and language systems, seven publications and a patent
              behind them, now pointed at public revenue administration.
            </Lede>

            <StyledPillars>
              {PILLARS.map(({ title, body }, i) => (
                <StyledPillar key={title}>
                  <StyledPillarNum>{String(i + 1).padStart(2, '0')}</StyledPillarNum>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </StyledPillar>
              ))}
            </StyledPillars>
          </Measure>
        </Band>

        <Band>
          <Measure>
            <Eyebrow>Selected research</Eyebrow>
            <SectionTitle>Most-cited work</SectionTitle>

            <StyledFeatureList>
              {featured.map(work => (
                <StyledFeature key={work.title}>
                  <div>
                    <h3>
                      {work.external ? (
                        <a href={work.external} target="_blank" rel="nofollow noopener noreferrer">
                          {work.title}
                        </a>
                      ) : (
                        work.title
                      )}
                    </h3>
                    <p>{work.location}</p>
                  </div>
                  {work.citations != null && (
                    <b>
                      {work.citations}
                      <span>cited</span>
                    </b>
                  )}
                </StyledFeature>
              ))}
            </StyledFeatureList>

            <StatRow>
              <div>
                <dt>Publications</dt>
                <dd>{data.publications.edges.length}</dd>
              </div>
              <div>
                <dt>Patents</dt>
                <dd>{data.patents.edges.length}</dd>
              </div>
              {totalCitations != null && (
                <div>
                  <dt>Citations</dt>
                  <dd>{totalCitations}</dd>
                </div>
              )}
            </StatRow>

            <div style={{ marginTop: 34 }}>
              <StyledInlineLink to="/research">ALL RESEARCH &rarr;</StyledInlineLink>
            </div>
          </Measure>
        </Band>

        <Band $alt>
          <Measure>
            <Eyebrow>Recognition</Eyebrow>
            <SectionTitle>International IEEE competitions</SectionTitle>

            <StyledGallery>
              {data.awards.edges.map(({ node }) => {
                const { title, location: venue, cover } = node.frontmatter;
                return (
                  <StyledPlate key={title}>
                    {cover && <Img fluid={cover.childImageSharp.fluid} alt={title} />}
                    <p>
                      <strong>{title}</strong>
                      {venue}
                    </p>
                  </StyledPlate>
                );
              })}
            </StyledGallery>

            <div style={{ marginTop: 40 }}>
              <StyledInlineLink to="/recognition">ALL RECOGNITION &rarr;</StyledInlineLink>
            </div>
          </Measure>
        </Band>

        <Band $dark>
          <Measure>
            <Eyebrow $onDark>Get in touch</Eyebrow>
            <SectionTitle $onDark>{data.contact.edges[0].node.frontmatter.title}</SectionTitle>
            <Lede
              $onDark
              as="div"
              dangerouslySetInnerHTML={{ __html: data.contact.edges[0].node.html }}
            />
            <Button $onDark href={`mailto:${email}`}>
              {data.contact.edges[0].node.frontmatter.buttonText}
            </Button>
          </Measure>
        </Band>
      </main>
    </Layout>
  );
};

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default IndexPage;

export const pageQuery = graphql`
  {
    hero: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/hero/" } }) {
      edges {
        node {
          frontmatter {
            title
            name
            subtitle
            buttonText
          }
          html
        }
      }
    }
    about: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/about/" } }) {
      edges {
        node {
          frontmatter {
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
    awards: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/awards/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            location
            cover {
              childImageSharp {
                fluid(maxWidth: 700, quality: 92) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
    publications: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/publications/" } }) {
      edges {
        node {
          frontmatter {
            title
            location
            citations
            external
          }
        }
      }
    }
    patents: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/patents/" } }) {
      edges {
        node {
          frontmatter {
            title
            location
            citations
            external
          }
        }
      }
    }
    scholarProfile: allScholarProfile {
      edges {
        node {
          citations
        }
      }
    }
    contact: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/contact/" } }) {
      edges {
        node {
          frontmatter {
            title
            buttonText
          }
          html
        }
      }
    }
  }
`;
