import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Layout, PageNav } from '@components';
import { editorial } from '@styles';
const {
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
  TagList,
  VerbLink,
  Prose,
  Empty,
} = editorial;

const ProjectsPage = ({ location, data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCompany, setActiveCompany] = useState('all');

  const projects = data.projects.edges.map(({ node }) => ({
    ...node.frontmatter,
    html: node.html,
  }));

  const companies = [...new Set(projects.map(p => p.company).filter(Boolean))];
  const filters = [{ key: 'all', label: 'All' }, ...companies.map(c => ({ key: c, label: c }))];

  const query = searchQuery.trim().toLowerCase();
  const visible = projects.filter(project => {
    if (activeCompany !== 'all' && project.company !== activeCompany) return false;
    if (!query) return true;
    return [project.title, ...(project.tech || [])].join(' ').toLowerCase().includes(query);
  });

  return (
    <Layout location={location}>
      <Helmet title="Projects | Md. Tariqul Islam" />

      <Page>
        <PageHead>
          <Eyebrow>Projects</Eyebrow>
          <DisplayTitle>Things built, shipped and shelved</DisplayTitle>
          <Lede>
            Production systems and research prototypes across speech, language, vision and
            forecasting — some client work, some built to find out whether an idea held up.
          </Lede>

          <StatRow>
            <div>
              <dt>Projects</dt>
              <dd>{projects.length}</dd>
            </div>
            {companies.length > 0 && (
              <div>
                <dt>Organizations</dt>
                <dd>{companies.length}</dd>
              </div>
            )}
          </StatRow>
        </PageHead>

        {filters.length > 1 && (
          <Controls>
            <SearchInput
              type="text"
              placeholder="Search by name or technology"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search projects"
            />
            <PillGroup role="group" aria-label="Filter by organization">
              {filters.map(({ key, label }) => (
                <Pill
                  key={key}
                  type="button"
                  aria-pressed={activeCompany === key}
                  $active={activeCompany === key}
                  onClick={() => setActiveCompany(key)}>
                  {label}
                </Pill>
              ))}
            </PillGroup>
          </Controls>
        )}

        {visible.length === 0 ? (
          <Empty>Nothing matches that search.</Empty>
        ) : (
          <ItemList>
            {visible.map((project, i) => (
              <Item key={project.title} $columns="64px 1fr">
                <ItemIndex>{String(i + 1).padStart(2, '0')}</ItemIndex>
                <ItemBody>
                  {project.company && <MetaLabel>{project.company}</MetaLabel>}
                  <ItemTitle>
                    {project.external || project.github ? (
                      <a
                        href={project.external || project.github}
                        target="_blank"
                        rel="nofollow noopener noreferrer">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </ItemTitle>
                  {project.html && (
                    <Prose
                      style={{ marginTop: 14 }}
                      dangerouslySetInnerHTML={{ __html: project.html }}
                    />
                  )}
                  {project.tech && (
                    <TagList>
                      {project.tech.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </TagList>
                  )}
                  {project.github && (
                    <VerbLink
                      href={project.github}
                      target="_blank"
                      rel="nofollow noopener noreferrer">
                      CODE <span>&rarr;</span>
                    </VerbLink>
                  )}
                  {project.external && (
                    <VerbLink
                      href={project.external}
                      target="_blank"
                      rel="nofollow noopener noreferrer">
                      READ <span>&rarr;</span>
                    </VerbLink>
                  )}
                </ItemBody>
              </Item>
            ))}
          </ItemList>
        )}
        <PageNav pathname={location.pathname} />
      </Page>
    </Layout>
  );
};

ProjectsPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ProjectsPage;

export const pageQuery = graphql`
  {
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
  }
`;
