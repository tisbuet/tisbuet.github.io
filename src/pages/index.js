import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Layout, Hero, About, Awards, Publications, Jobs, Projects, Contact } from '@components';
import { Main } from '@styles';

const IndexPage = ({ location, data }) => (
  <Layout location={location}>
    <Main className="fillHeight">
      <Hero data={data.hero.edges} />
      <About data={data.about.edges} />
      <Jobs data={data.jobs.edges} />
      <Awards data={data.awards.edges} />
      <Publications
        data={data.publications.edges}
        patents={data.patents.edges}
        citations={data.scholarProfile.edges[0]?.node.citations}
      />
      <Projects data={data.projects.edges} />
      <Contact data={data.contact.edges} />
    </Main>
  </Layout>
);

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
            title
            avatar {
              childImageSharp {
                fluid(maxWidth: 700, quality: 90, traceSVG: { color: "#c9a227" }) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
            skills
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
                fluid(maxWidth: 700, quality: 90, traceSVG: { color: "#c9a227" }) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
            tech
            github
            external
          }
          html
        }
      }
    }
    publications: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/publications/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            type
            location
            citations
            cover {
              childImageSharp {
                fluid(maxWidth: 700, quality: 90, traceSVG: { color: "#c9a227" }) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
            tech
            github
            external
          }
          html
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
            tech
            external
          }
          html
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
    jobs: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/jobs/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            company
            range
            url
          }
          html
        }
      }
    }
    projects: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/projects/" }
        frontmatter: { showInProjects: { ne: false } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            tech
            github
            external
            company
          }
          html
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
