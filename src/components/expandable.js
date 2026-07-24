import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { theme } from '@styles';

const StyledPanel = styled.div`
  overflow: hidden;
  max-height: ${props => (props.$isOpen ? `${props.$height}px` : '0px')};
  transition: max-height ${theme.transition};
`;
const StyledPanelInner = styled.div`
  padding: 10px 0 20px;
`;

const Expandable = ({ isOpen, id, children }) => {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.scrollHeight);
    }
  }, [isOpen, children]);

  return (
    <StyledPanel id={id} $isOpen={isOpen} $height={height} aria-hidden={!isOpen}>
      <StyledPanelInner ref={innerRef}>{children}</StyledPanelInner>
    </StyledPanel>
  );
};

Expandable.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  id: PropTypes.string,
  children: PropTypes.node,
};

export default Expandable;
