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
const StyledChartTypeLabel = styled.span`
  color: ${colors.green};
  font-weight: 600;
  margin-right: 6px;
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

const TYPE_LABELS = {
  journal: 'Journal',
  conference: 'Conference',
  patent: 'Patent',
};

const CitationsChart = ({ publications, patents }) => {
  const items = [
    ...publications.map(({ node }) => ({
      title: node.frontmatter.title,
      citations: node.frontmatter.citations,
      type: node.frontmatter.type,
    })),
    ...(patents || []).map(({ node }) => ({
      title: node.frontmatter.title,
      citations: node.frontmatter.citations,
      type: 'patent',
    })),
  ]
    .filter(item => item.citations != null)
    .sort((a, b) => b.citations - a.citations);

  if (items.length === 0) return null;

  const maxCitations = Math.max(...items.map(item => item.citations), 1);
  const TRACK_FILL_MAX = 92; // leave headroom so the top value doesn't fill the whole track

  return (
    <StyledChart>
      {items.map(({ title, citations, type }, i) => {
        const widthPct = (citations / maxCitations) * TRACK_FILL_MAX;

        return (
          <StyledChartRow key={i}>
            <StyledChartTitle>
              <StyledChartTypeLabel>{TYPE_LABELS[type] || 'Publication'}</StyledChartTypeLabel>
              {title}
            </StyledChartTitle>
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
  patents: PropTypes.array,
};

export default CitationsChart;
