import React, { useRef, useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Layout, Expandable } from '@components';
import { FormattedIcon } from '@components/icons';
import styled from 'styled-components';
import { theme, mixins, media, Main } from '@styles';
const { colors, fonts, fontSizes } = theme;

const StyledMainContainer = styled(Main)``;
const StyledTableContainer = styled.div`
  margin: 100px -20px;
  ${media.tablet`
    margin: 100px -10px;
  `};
`;
const StyledSearchInput = styled.input`
  width: 100%;
  max-width: 320px;
  margin-top: 20px;
  padding: 8px 14px;
  background-color: transparent;
  border: 1px solid ${colors.lightestNavy};
  border-radius: ${theme.borderRadius};
  color: ${colors.lightestSlate};
  font-family: ${fonts.Calibre};
  font-size: ${fontSizes.smil};
  &:focus {
    outline: 0;
    border-color: ${colors.green};
  }
  &::placeholder {
    color: ${colors.slate};
  }
`;
const StyledNoResults = styled.p`
  color: ${colors.slate};
  font-size: ${fontSizes.smil};
  margin: 20px 0 0;
`;
const StyledExpandTrigger = styled.button`
  background: none;
  border: 0;
  padding: 0;
  margin-right: 10px;
  color: ${colors.green};
  font-family: ${fonts.Calibre};
  font-size: ${fontSizes.xl};
  line-height: 1;
  cursor: pointer;
  &:focus {
    outline: 0;
    color: ${colors.lightestSlate};
  }
`;
const StyledExpandableRow = styled.tr`
  &:hover,
  &:focus {
    background-color: transparent !important;
  }
  td {
    padding: 0 20px;
    ${media.tablet`padding: 0 10px;`};
  }
`;
const StyledExpandableContent = styled.div`
  color: ${colors.lightSlate};
  font-size: ${fontSizes.md};
  line-height: 1.5;
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  .hide-on-mobile {
    ${media.tablet`
      display: none;
    `};
  }

  tbody tr {
    transition: ${theme.transition};

    &:hover,
    &:focus {
      background-color: ${colors.lightNavy};
    }
  }
  th,
  td {
    cursor: default;
    line-height: 1.5;
    padding: 10px 20px;
    ${media.tablet`
      padding: 10px;
    `};
  }
  th {
    text-align: left;
  }
  td {
    &.year {
      width: 10%;
      ${media.tablet`
        font-size: ${fontSizes.sm};
      `};
    }
    &.title {
      padding-top: 15px;
      color: ${colors.lightestSlate};
      font-size: ${fontSizes.xl};
      font-weight: 700;
    }
    &.company {
      width: 15%;
      padding-top: 15px;
      font-size: ${fontSizes.lg};
    }
    &.tech {
      font-size: ${fontSizes.xs};
      font-family: ${fonts.SFMono};
      .separator {
        margin: 0 5px;
      }
      span {
        display: inline-block;
      }
    }
    &.links {
      span {
        display: flex;
        align-items: center;
        a {
          ${mixins.flexCenter};
        }
        a + a {
          margin-left: 10px;
        }
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`;

const ArchivePage = ({ location, data }) => {
  const projects = data.allMarkdownRemark.edges;
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const query = searchQuery.trim().toLowerCase();
  const filteredProjects = query
    ? projects.filter(({ node }) => {
        const { title, company, tech } = node.frontmatter;
        const haystack = [title, company, ...(tech || [])].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(query);
      })
    : projects;

  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig());
    revealProjects.current.forEach(ref => sr.reveal(ref, srConfig()));
  }, []);

  return (
    <Layout location={location}>
      <Helmet>
        <title>Archive | Md. Tariqul Islam</title>
        <link rel="canonical" href="https://tisbuet.github.io/archive" />
      </Helmet>

      <StyledMainContainer>
        <header ref={revealTitle}>
          <h1 className="big-title">Archive</h1>
          <p className="subtitle">A big list of things I’ve worked on</p>
          <StyledSearchInput
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search projects"
          />
        </header>

        {query && filteredProjects.length === 0 && (
          <StyledNoResults>No projects match your search.</StyledNoResults>
        )}

        <StyledTableContainer ref={revealTable}>
          <StyledTable>
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th className="hide-on-mobile">Made at</th>
                <th className="hide-on-mobile">Built with</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 &&
                filteredProjects.map(({ node }, i) => {
                  const { date, github, external, title, tech, company } = node.frontmatter;
                  const isOpen = expandedIndex === i;
                  const panelId = `archive-details-${i}`;
                  return (
                    <React.Fragment key={i}>
                      <tr ref={el => (revealProjects.current[i] = el)}>
                        <td className="overline year">{`${new Date(date).getFullYear()}`}</td>

                        <td className="title">
                          <StyledExpandTrigger
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            aria-label={isOpen ? 'Collapse details' : 'Expand details'}
                            onClick={() => setExpandedIndex(isOpen ? null : i)}>
                            {isOpen ? '−' : '+'}
                          </StyledExpandTrigger>
                          {title}
                        </td>

                        <td className="company hide-on-mobile">
                          {company ? <span>{company}</span> : <span>—</span>}
                        </td>

                        <td className="tech hide-on-mobile">
                          {tech.length > 0 &&
                            tech.map((item, i) => (
                              <span key={i}>
                                {item}
                                {''}
                                {i !== tech.length - 1 && (
                                  <span className="separator">&middot;</span>
                                )}
                              </span>
                            ))}
                        </td>

                        <td className="links">
                          <span>
                            {external && (
                              <a
                                href={external}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                aria-label="External Link">
                                <FormattedIcon name="External" />
                              </a>
                            )}
                            {github && (
                              <a
                                href={github}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                aria-label="GitHub Link">
                                <FormattedIcon name="GitHub" />
                              </a>
                            )}
                          </span>
                        </td>
                      </tr>
                      <StyledExpandableRow>
                        <td colSpan={5}>
                          <Expandable isOpen={isOpen} id={panelId}>
                            <StyledExpandableContent
                              dangerouslySetInnerHTML={{ __html: node.html }}
                            />
                          </Expandable>
                        </td>
                      </StyledExpandableRow>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </StyledTable>
        </StyledTableContainer>
      </StyledMainContainer>
    </Layout>
  );
};
ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/projects/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            date
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
  }
`;
