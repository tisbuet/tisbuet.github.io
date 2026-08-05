import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Layout, PageNav } from '@components';
import { email, socialMedia } from '@config';
import { theme, media, editorial } from '@styles';
const { fontSizes, fonts } = theme;
const {
  tokens: t,
  Page,
  PageHead,
  Eyebrow,
  DisplayTitle,
  Lede,
  Prose,
  Button,
  eyebrowStyle,
} = editorial;

const StyledChannels = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px;
  margin: 70px 0 0;
  padding-top: 40px;
  border-top: 1px solid ${t.ruleStrong};
  ${media.tablet`grid-template-columns: 1fr; gap: 30px;`};

  div {
    margin: 0;
  }
  dt {
    ${eyebrowStyle};
    letter-spacing: 0.14em;
    margin-bottom: 10px;
    color: ${t.muted};
  }
  dd {
    margin: 0;
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.md};
    color: ${t.ink};
    word-break: break-word;
  }
  a:hover,
  a:focus {
    color: ${t.accentDeep};
  }
`;

const ContactPage = ({ location, data }) => {
  const contact = data.contact.edges[0].node;

  return (
    <Layout location={location}>
      <Helmet title="Contact | Md. Tariqul Islam" />

      <Page>
        <PageHead>
          <Eyebrow>Contact</Eyebrow>
          <DisplayTitle>{contact.frontmatter.title}</DisplayTitle>
          <Lede as="div" dangerouslySetInnerHTML={{ __html: contact.html }} />
          <Button href={`mailto:${email}`}>{contact.frontmatter.buttonText}</Button>
        </PageHead>

        <StyledChannels>
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${email}`}>{email}</a>
            </dd>
          </div>
          {socialMedia.map(({ name, url }) => (
            <div key={name}>
              <dt>{name === 'GoogleScholar' ? 'Google Scholar' : name}</dt>
              <dd>
                <a href={url} target="_blank" rel="nofollow noopener noreferrer">
                  {url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a>
              </dd>
            </div>
          ))}
        </StyledChannels>
        <PageNav pathname={location.pathname} />
      </Page>
    </Layout>
  );
};

ContactPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ContactPage;

export const pageQuery = graphql`
  {
    contact: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/contact/" } }) {
      edges {
        node {
          frontmatter {
            title
            buttonText
          }
          html
        }
      }
    }
  }
`;
