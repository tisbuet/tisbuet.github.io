import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, PageNav } from '@components';
import { scholarUrl } from '@config';
import { theme, mixins, editorial } from '@styles';
const { fontSizes, fonts } = theme;
const {
  tokens: t,
  Page,
  PageHead,
  Eyebrow,
  DisplayTitle,
  Lede,
  StatRow,
  Controls,
  SearchInput,
  PillGroup,
  Pill,
  ItemList,
  Item,
  ItemIndex,
  ItemBody,
  MetaLabel,
  ItemTitle,
  Venue,
  TagList,
  VerbLink,
  Citations,
  Empty,
} = editorial;

const PUB_TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'patent', label: 'Patent' },
  { key: 'journal', label: 'Journal' },
  { key: 'conference', label: 'Conference' },
];

const TYPE_LABELS = {
  journal: 'Journal Article',
  conference: 'Conference Paper',
  patent: 'Patent',
};

const StyledScholarLink = styled.a`
  ${mixins.inlineLink};
  margin-top: 26px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sml};
  color: ${t.accentDeep};
  &:after {
    background-color: ${t.accentDeep};
  }
`;

const byCitationsDesc = (a, b) => (b.citations ?? -1) - (a.citations ?? -1);

const ResearchPage = ({ location, data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');

  // Publications and the patent share one list — they are all research output,
  // and folding them together is what lets a single citation ranking make sense.
  const works = [
    ...data.publications.edges.map(({ node }) => ({
      ...node.frontmatter,
      type: node.frontmatter.type || 'conference',
    })),
    ...data.patents.edges.map(({ node }) => ({ ...node.frontmatter, type: 'patent' })),
  ].sort(byCitationsDesc);

  const query = searchQuery.trim().toLowerCase();
  const visible = works.filter(work => {
    if (activeType !== 'all' && work.type !== activeType) return false;
    if (!query) return true;
    return [work.title, work.location, ...(work.tech || [])]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const counts = works.reduce((acc, work) => {
    acc[work.type] = (acc[work.type] || 0) + 1;
    return acc;
  }, {});
  const totalCitations = data.scholarProfile.edges[0]?.node.citations;

  return (
    <Layout location={location}>
      <Helmet title="Research | Md. Tariqul Islam" />

      <Page>
        <PageHead>
          <Eyebrow>Research</Eyebrow>
          <DisplayTitle>Speech, vision and signals</DisplayTitle>
          <Lede>
            Peer-reviewed work on automatic speech recognition, sound source localization, and
            medical signal analysis — plus one granted patent. Citation counts are pulled from
            Google Scholar at build time, so they stay current without an edit.
          </Lede>

          <StatRow>
            <div>
              <dt>Total works</dt>
              <dd>{works.length}</dd>
            </div>
            {counts.journal > 0 && (
              <div>
                <dt>Journal</dt>
                <dd>{counts.journal}</dd>
              </div>
            )}
            {counts.conference > 0 && (
              <div>
                <dt>Conference</dt>
                <dd>{counts.conference}</dd>
              </div>
            )}
            {counts.patent > 0 && (
              <div>
                <dt>Patents</dt>
                <dd>{counts.patent}</dd>
              </div>
            )}
            {totalCitations != null && (
              <div>
                <dt>Citations</dt>
                <dd>{totalCitations}</dd>
              </div>
            )}
          </StatRow>

          <StyledScholarLink href={scholarUrl} target="_blank" rel="nofollow noopener noreferrer">
            View Google Scholar profile
          </StyledScholarLink>
        </PageHead>

        <Controls>
          <SearchInput
            type="text"
            placeholder="Search by title, venue, or method"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search research output"
          />
          <PillGroup role="group" aria-label="Filter by type">
            {PUB_TYPE_FILTERS.map(({ key, label }) => (
              <Pill
                key={key}
                type="button"
                aria-pressed={activeType === key}
                $active={activeType === key}
                onClick={() => setActiveType(key)}>
                {label}
              </Pill>
            ))}
          </PillGroup>
        </Controls>

        {visible.length === 0 ? (
          <Empty>Nothing matches that search.</Empty>
        ) : (
          <ItemList>
            {visible.map((work, i) => (
              <Item key={work.title}>
                <ItemIndex>{String(i + 1).padStart(2, '0')}</ItemIndex>

                <ItemBody>
                  <MetaLabel>{TYPE_LABELS[work.type]}</MetaLabel>
                  <ItemTitle>
                    {work.external ? (
                      <a href={work.external} target="_blank" rel="nofollow noopener noreferrer">
                        {work.title}
                      </a>
                    ) : (
                      work.title
                    )}
                  </ItemTitle>
                  {work.location && <Venue>{work.location}</Venue>}
                  {work.tech && (
                    <TagList>
                      {work.tech.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </TagList>
                  )}
                  {work.external && (
                    <VerbLink
                      href={work.external}
                      target="_blank"
                      rel="nofollow noopener noreferrer">
                      READ <span>&rarr;</span>
                    </VerbLink>
                  )}
                </ItemBody>

                <Citations>
                  {work.citations != null ? (
                    <>
                      <strong>{work.citations}</strong>
                      <span>{work.citations === 1 ? 'citation' : 'citations'}</span>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </Citations>
              </Item>
            ))}
          </ItemList>
        )}
        <PageNav pathname={location.pathname} />
      </Page>
    </Layout>
  );
};

ResearchPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ResearchPage;

export const pageQuery = graphql`
  {
    publications: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/publications/" } }) {
      edges {
        node {
          frontmatter {
            title
            type
            location
            citations
            tech
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
            tech
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
  }
`;
