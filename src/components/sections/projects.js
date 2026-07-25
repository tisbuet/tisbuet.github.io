import React, { useState } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FormattedIcon } from '@components/icons';
import styled from 'styled-components';
import { theme, mixins, media, Section, Button } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 1.75rem;
`;
const StyledTitle = styled.h4`
  margin: 0 auto;
  font-size: ${fontSizes.h3};
  ${media.tablet`font-size: 24px;`};
  a {
    display: block;
  }
`;
const StyledArchiveLink = styled(Link)`
  ${mixins.inlineLink};
  text-align: center;
  border: 2px solid ${colors.green};
  margin: 20px auto;
  font-family: ${fonts.SFMono};
  font-size: 16px;
  &:after {
    bottom: 0.1em;
  }
`;
const StyledGrid = styled.div`
  margin-top: 30px;
  margin-left: 0%;

  .projects {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 6px;
    position: relative;
    ${media.desktop`grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));`};
  }
`;
const StyledProjectInner = styled.div`
  ${mixins.boxShadow};
  ${mixins.flexBetween};
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 2rem 1.75rem;
  height: 100%;
  border-radius: ${theme.borderRadius};
  transition: ${theme.transition};
  background-color: ${colors.lightNavy};
`;
const StyledProject = styled.div`
  transition: ${theme.transition};
  cursor: default;
  &:hover,
  &:focus {
    outline: 0;
    ${StyledProjectInner} {
      transform: translateY(-5px);
    }
  }
`;
const StyledProjectHeader = styled.div`
  ${mixins.flexBetween};
  margin-bottom: 30px;
`;
const StyledFolder = styled.div`
  color: ${colors.green};
  svg {
    width: 40px;
    height: 40px;
  }
`;
const StyledProjectLinks = styled.div`
  margin-right: -10px;
  color: ${colors.lightSlate};
`;
const StyledIconLink = styled.a`
  position: relative;
  top: -10px;
  padding: 10px;
  svg {
    width: 20px;
    height: 20px;
  }
`;
const StyledProjectName = styled.h5`
  margin: 0 0 10px;
  font-size: ${fontSizes.xxl};
  color: ${colors.lightestSlate};
`;
const StyledProjectDescription = styled.div`
  font-size: 17px;
  color: ${colors.lightSlate};
  a {
    ${mixins.inlineLink};
  }
`;
const StyledTechList = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
  flex-wrap: wrap;
  padding: 0;
  margin: 20px 0 0 0;
  list-style: none;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.xs};
    color: ${colors.green};
    line-height: 1.75;
    margin-right: 15px;
    &:last-of-type {
      margin-right: 0;
    }
  }
`;
const StyledMoreButton = styled(Button)`
  margin: 100px auto 0;
`;
const StyledSearchInput = styled.input`
  width: 100%;
  max-width: 320px;
  margin: 20px auto 0;
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
  margin: 20px auto 0;
`;

const Projects = ({ data }) => {
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const GRID_LIMIT = 9;
  const projects = data.filter(({ node }) => node);
  const query = searchQuery.trim().toLowerCase();
  const filteredProjects = query
    ? projects.filter(({ node }) => {
        const { frontmatter } = node;
        const haystack = [frontmatter.title, frontmatter.company, ...(frontmatter.tech || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      })
    : projects;
  const firstSix = filteredProjects.slice(0, GRID_LIMIT);
  const projectsToShow = query || showMore ? filteredProjects : firstSix;

  return (
    <StyledContainer id="projects">
      <StyledTitle>Other Noteworthy Projects</StyledTitle>

      <StyledSearchInput
        type="text"
        placeholder="Search projects..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        aria-label="Search projects"
      />

      {query && filteredProjects.length === 0 && (
        <StyledNoResults>No projects match your search.</StyledNoResults>
      )}

      <StyledGrid>
        <TransitionGroup className="projects">
          {projectsToShow &&
            projectsToShow.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { github, external, title, tech } = frontmatter;
              return (
                <CSSTransition key={i} classNames="fadeup" timeout={300} exit={false}>
                  <StyledProject key={i} tabIndex="0">
                    <StyledProjectInner>
                      <header>
                        <StyledProjectHeader>
                          <StyledFolder>
                            <FormattedIcon name="Folder" />
                          </StyledFolder>
                          <StyledProjectLinks>
                            {github && (
                              <StyledIconLink
                                href={github}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                aria-label="GitHub Link">
                                <FormattedIcon name="GitHub" />
                              </StyledIconLink>
                            )}
                            {external && (
                              <StyledIconLink
                                href={external}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                aria-label="External Link">
                                <FormattedIcon name="External" />
                              </StyledIconLink>
                            )}
                          </StyledProjectLinks>
                        </StyledProjectHeader>
                        <StyledProjectName>{title}</StyledProjectName>
                        <StyledProjectDescription dangerouslySetInnerHTML={{ __html: html }} />
                      </header>
                      <footer>
                        {tech && (
                          <StyledTechList>
                            {tech.map((tech, i) => (
                              <li key={i}>{tech}</li>
                            ))}
                          </StyledTechList>
                        )}
                      </footer>
                    </StyledProjectInner>
                  </StyledProject>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </StyledGrid>
      <StyledArchiveLink to="/archive">
        View Complete List of Projects
      </StyledArchiveLink>
    </StyledContainer>
  );
};

Projects.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Projects;