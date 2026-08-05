/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

// Runs before first paint so a stored preference is applied without a flash.
// Dark is the default; only an explicit earlier choice overrides it, which is
// why prefers-color-scheme is not consulted here.
const setThemeScript = `
(function() {
  try {
    var stored = window.localStorage.getItem('tisbuet-theme');
    document.documentElement.setAttribute('data-theme', stored === 'light' ? 'light' : 'dark');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    React.createElement('script', {
      key: 'theme-init',
      dangerouslySetInnerHTML: { __html: setThemeScript },
    }),
  ]);
};
