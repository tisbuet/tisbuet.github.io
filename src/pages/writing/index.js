import React from 'react';
import { graphql, Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import { Layout, PageNav } from '@components';
import styled from 'styled-components';
import { theme, editorial } from '@styles';
const { fontSizes, fonts } = theme;
const {
  tokens: t,
  Page,
  PageHead,
  Eyebrow,
  DisplayTitle,
  Lede,
  StatRow,
  ItemList,
  Item,
  ItemIndex,
  ItemBody,
  MetaLabel,
  ItemTitle,
  VerbLink,
  Empty,
} = editorial;

/*
 * Writing lives on Medium rather than on this site, so every entry here links
 * out. content/writing/*.md holds the metadata only — there is no body to
 * render, which is why this page has no post template behind it.
 */

const StyledSummary = styled.p`
  margin: 12px 0 0;
  max-width: 62ch;
  font-size: ${fontSizes.md};
  line-height: 1.55;
  color: ${t.inkSoft};
`;
const StyledTags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.xs};
    letter-spacing: 0.04em;
    color: ${t.muted};

    a:hover,
    a:focus {
      color: ${t.accentDeep};
    }
  }
`;

const WritingPage = ({ location, data }) => {
  const articles = data.writing.edges.map(({ node }) => node.frontmatter);
  const publishers = new Set(articles.map(a => a.publisher).filter(Boolean));

  return (
    <Layout location={location}>
      <Helmet>
        <title>Writing | Md. Tariqul Islam</title>
        <link rel="canonical" href="https://tisbuet.github.io/writing" />
      </Helmet>

      <Page>
        <PageHead>
          <Eyebrow>Writing</Eyebrow>
          <DisplayTitle>Notes on models and the making of them</DisplayTitle>
          <Lede>
            Practical write-ups on retrieval-augmented generation, fine-tuning open-source models on
            modest hardware, and the computer-vision projects that started it — published on Medium.
          </Lede>

          {publishers.size > 0 && (
            <StatRow>
              <div>
                <dt>Published on</dt>
                <dd>{[...publishers].join(', ')}</dd>
              </div>
            </StatRow>
          )}
        </PageHead>

        {articles.length === 0 ? (
          <Empty>Nothing published yet.</Empty>
        ) : (
          <ItemList style={{ marginTop: 20 }}>
            {articles.map((article, i) => {
              const { title, external, publisher, readingTime, description, tags, date } = article;
              const year = date ? new Date(date).getFullYear() : null;

              return (
                <Item key={title} $columns="64px 1fr">
                  <ItemIndex>{String(i + 1).padStart(2, '0')}</ItemIndex>

                  <ItemBody>
                    <MetaLabel>
                      {[publisher, year, readingTime].filter(Boolean).join(' · ')}
                    </MetaLabel>
                    <ItemTitle>
                      <a href={external} target="_blank" rel="nofollow noopener noreferrer">
                        {title}
                      </a>
                    </ItemTitle>
                    {description && <StyledSummary>{description}</StyledSummary>}
                    {tags && (
                      <StyledTags>
                        {tags.map(tag => (
                          <li key={tag}>
                            <Link to={`/writing/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                          </li>
                        ))}
                      </StyledTags>
                    )}
                    <VerbLink href={external} target="_blank" rel="nofollow noopener noreferrer">
                      READ <span>&rarr;</span>
                    </VerbLink>
                  </ItemBody>
                </Item>
              );
            })}
          </ItemList>
        )}

        <PageNav pathname={location.pathname} />
      </Page>
    </Layout>
  );
};

WritingPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default WritingPage;

export const pageQuery = graphql`
  {
    writing: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/writing/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            date
            external
            publisher
            readingTime
            description
            tags
          }
        }
      }
    }
  }
`;
