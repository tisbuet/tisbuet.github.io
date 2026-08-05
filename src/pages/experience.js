import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
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
  StatRow,
  Prose,
  eyebrowStyle,
} = editorial;

/*
 * Roles are grouped by domain rather than listed strictly by date — the same
 * move her About page makes. It lets industry work and volunteer/community work
 * read as two separate threads instead of one interleaved timeline.
 */
const DOMAINS = [
  {
    key: 'industry',
    label: 'Industry & Engineering',
    companies: ['Verbex.ai', 'SOCIAN Ltd.'],
  },
  {
    key: 'community',
    label: 'Community & Volunteering',
    companies: ['IEEE SPS BUET SB'],
  },
];

const StyledDomain = styled.section`
  margin-top: 64px;
  padding-top: 30px;
  border-top: 1px solid ${t.ruleStrong};
`;
const StyledDomainLabel = styled.h2`
  ${eyebrowStyle};
  margin: 0 0 34px;
  letter-spacing: 0.16em;
  color: ${t.accentDeep};
`;
const StyledRole = styled.article`
  display: grid;
  grid-template-columns: 190px 1fr;
  gap: 0 36px;
  padding-bottom: 38px;
  margin-bottom: 38px;
  border-bottom: 1px solid ${t.rule};
  ${media.tablet`
    grid-template-columns: 1fr;
    gap: 10px 0;
  `};

  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
`;
const StyledRange = styled.p`
  margin: 6px 0 0;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sml};
  letter-spacing: 0.04em;
  color: ${t.muted};
  ${media.tablet`margin: 0;`};
`;
const StyledRoleTitle = styled.h3`
  margin: 0 0 4px;
  font-family: ${t.fontDisplay};
  font-weight: 400;
  font-size: 26px;
  line-height: 1.2;
  color: ${t.ink};
  ${media.phablet`font-size: 21px;`};
`;
const StyledCompany = styled.p`
  margin: 0 0 18px;
  font-size: ${fontSizes.md};
  color: ${t.muted};

  a {
    color: ${t.accentDeep};
    &:hover,
    &:focus {
      color: ${t.ink};
    }
  }
`;

const ExperiencePage = ({ location, data }) => {
  const jobs = data.jobs.edges.map(({ node }) => node);

  const grouped = DOMAINS.map(domain => ({
    ...domain,
    roles: jobs.filter(job => domain.companies.includes(job.frontmatter.company)),
  })).filter(domain => domain.roles.length > 0);

  // Anything not matched above still shows, so adding a job to content/jobs
  // never silently drops it off this page.
  const claimed = DOMAINS.flatMap(d => d.companies);
  const unbucketed = jobs.filter(job => !claimed.includes(job.frontmatter.company));
  const sections = [
    ...grouped,
    ...(unbucketed.length ? [{ key: 'other', label: 'Other roles', roles: unbucketed }] : []),
  ];

  const organizations = new Set(jobs.map(job => job.frontmatter.company)).size;

  return (
    <Layout location={location}>
      <Helmet title="Work Experience | Md. Tariqul Islam" />

      <Page>
        <PageHead>
          <Eyebrow>Work Experience</Eyebrow>
          <DisplayTitle>Five years shipping AI in production</DisplayTitle>
          <Lede>
            Speech and language systems built for government and enterprise clients across
            Bangladesh, Japan and India — alongside the volunteer work that started it.
          </Lede>

          <StatRow>
            <div>
              <dt>Roles</dt>
              <dd>{jobs.length}</dd>
            </div>
            <div>
              <dt>Organizations</dt>
              <dd>{organizations}</dd>
            </div>
          </StatRow>
        </PageHead>

        {sections.map(domain => (
          <StyledDomain key={domain.key}>
            <StyledDomainLabel>{domain.label}</StyledDomainLabel>

            {domain.roles.map(({ frontmatter, html }) => (
              <StyledRole key={frontmatter.company + frontmatter.title}>
                <StyledRange>{frontmatter.range}</StyledRange>

                <div>
                  <StyledRoleTitle>{frontmatter.title}</StyledRoleTitle>
                  <StyledCompany>
                    {frontmatter.url ? (
                      <a href={frontmatter.url} target="_blank" rel="nofollow noopener noreferrer">
                        {frontmatter.company}
                      </a>
                    ) : (
                      frontmatter.company
                    )}
                  </StyledCompany>
                  <Prose dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </StyledRole>
            ))}
          </StyledDomain>
        ))}
        <PageNav pathname={location.pathname} />
      </Page>
    </Layout>
  );
};

ExperiencePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ExperiencePage;

export const pageQuery = graphql`
  {
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
  }
`;
