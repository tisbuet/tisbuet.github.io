/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const _ = require('lodash');
const config = require('./src/config');

const normalizeScholarTitle = title =>
  title
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, '') // strip bracketed tags like "[JOURNAL]"
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type ScholarProfile implements Node {
      citations: Int
      hIndex: Int
      i10Index: Int
    }
    type ScholarPublication implements Node {
      scholarTitle: String
      citations: Int
      year: String
    }
  `);
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;
  let citations = null;
  let hIndex = null;
  let i10Index = null;
  let publications = [];

  try {
    const response = await fetch(`${config.scholarUrl}&cstart=0&pagesize=100`, {
      headers: {
        // Google Scholar blocks requests without a browser-like User-Agent
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const html = await response.text();

      // The stats table lists 6 cells in order: Citations(All, Since), h-index(All, Since), i10-index(All, Since)
      const statValues = [...html.matchAll(/<td class="gsc_rsb_std">(\d+)<\/td>/g)].map(m =>
        parseInt(m[1], 10),
      );
      if (statValues.length >= 5) {
        [citations, , hIndex, , i10Index] = statValues;
      } else {
        reporter.warn('Could not find citation stats on Google Scholar profile page.');
      }

      const rows = html.match(/<tr class="gsc_a_tr">[\s\S]*?<\/tr>/g) || [];
      publications = rows
        .map(row => {
          const titleMatch = row.match(/class="gsc_a_at"[^>]*>([\s\S]*?)<\/a>/);
          const citeMatch = row.match(/class="gsc_a_ac[^"]*"[^>]*>(\d*)</);
          const yearMatch = row.match(/class="gsc_a_h[^"]*"[^>]*>(\d*)</);
          const idMatch = row.match(/citation_for_view=([^&"]+)/);
          return {
            scholarTitle: titleMatch ? titleMatch[1].trim() : null,
            citations: citeMatch && citeMatch[1] ? parseInt(citeMatch[1], 10) : 0,
            year: yearMatch ? yearMatch[1] : null,
            id: idMatch ? idMatch[1] : null,
          };
        })
        .filter(pub => pub.scholarTitle && pub.id);
    } else {
      reporter.warn(`Google Scholar fetch failed with status ${response.status}.`);
    }
  } catch (error) {
    reporter.warn(`Could not fetch Google Scholar citation count: ${error.message}`);
  }

  createNode({
    citations,
    hIndex,
    i10Index,
    id: createNodeId('scholar-profile'),
    parent: null,
    children: [],
    internal: {
      type: 'ScholarProfile',
      content: JSON.stringify({ citations, hIndex, i10Index }),
      contentDigest: createContentDigest({ citations, hIndex, i10Index }),
    },
  });

  publications.forEach(pub => {
    createNode({
      scholarTitle: pub.scholarTitle,
      citations: pub.citations,
      year: pub.year,
      id: createNodeId(`scholar-publication-${pub.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'ScholarPublication',
        content: JSON.stringify(pub),
        contentDigest: createContentDigest(pub),
      },
    });
  });
};

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemarkFrontmatter: {
      citations: {
        type: 'Int',
        async resolve(source, args, context) {
          if (!source.title) return null;
          const target = normalizeScholarTitle(source.title);
          const { entries } = await context.nodeModel.findAll({ type: 'ScholarPublication' });
          const match = Array.from(entries).find(
            pub => pub.scholarTitle && normalizeScholarTitle(pub.scholarTitle) === target,
          );
          return match ? match.citations : null;
        },
      },
    },
  });
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve(`src/templates/post.js`);
  const tagTemplate = path.resolve('src/templates/tag.js');

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/posts/" } }
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create post detail pages
  const posts = result.data.postsRemark.edges;

  posts.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: postTemplate,
      context: {},
    });
  });

  // Extract tag data from query
  const tags = result.data.tagsGroup.group;
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/pensieve/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });
};

// https://www.gatsbyjs.org/docs/node-apis/#onCreateWebpackConfig
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scrollreveal/,
            use: loaders.null(),
          },
          {
            test: /animejs/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@fonts': path.resolve(__dirname, 'src/fonts'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  });
};
