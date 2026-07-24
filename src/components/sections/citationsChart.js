import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { theme } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledChart = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px;
`;
const StyledChartRow = styled.li`
  margin-bottom: 12px;
`;
const StyledChartTitle = styled.div`
  font-size: ${fontSizes.sml};
  color: ${colors.lightSlate};
  margin-bottom: 4px;
`;
const StyledChartBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const StyledChartTrack = styled.div`
  flex: 1;
  height: 10px;
  background-color: ${colors.lightestNavy};
  border-radius: 10px;
  overflow: hidden;
`;
const StyledChartFill = styled.div`
  height: 100%;
  min-width: 3px;
  background-color: ${colors.green};
  border-radius: 10px;
  transition: ${theme.transition};
`;
const StyledChartValue = styled.span`
  flex-shrink: 0;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${colors.slate};
  white-space: nowrap;
`;

const CitationsChart = ({ publications }) => {
  const ranked = publications
    .filter(({ node }) => node.frontmatter.citations != null)
    .sort((a, b) => b.node.frontmatter.citations - a.node.frontmatter.citations);

  if (ranked.length === 0) return null;

  const maxCitations = Math.max(...ranked.map(({ node }) => node.frontmatter.citations), 1);

  return (
    <StyledChart>
      {ranked.map(({ node }, i) => {
        const { title, citations } = node.frontmatter;
        const widthPct = (citations / maxCitations) * 100;

        return (
          <StyledChartRow key={i}>
            <StyledChartTitle>{title}</StyledChartTitle>
            <StyledChartBar>
              <StyledChartTrack>
                <StyledChartFill style={{ width: `${widthPct}%` }} />
              </StyledChartTrack>
              <StyledChartValue>
                {citations} {citations === 1 ? 'citation' : 'citations'}
              </StyledChartValue>
            </StyledChartBar>
          </StyledChartRow>
        );
      })}
    </StyledChart>
  );
};

CitationsChart.propTypes = {
  publications: PropTypes.array.isRequired,
};

export default CitationsChart;
