import styled from 'styled-components';
import media from './media';

const Section = styled.section`
  margin: 0 auto;
  padding: 80px 0;
  max-width: 1000px;

  ${media.tablet`padding: 70px 0;`};
`;

export default Section;
