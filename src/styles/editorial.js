import styled, { css } from 'styled-components';
import theme from './theme';
import media from './media';
import mixins from './mixins';
const { fontSizes, fonts } = theme;

// ---------------------------------------------------------------------------
// Editorial design system
//
// The print-inspired layout language used across every page: a page header
// (eyebrow / display title / lede), full-bleed bands to separate movements,
// and one row treatment shared by research, projects, recognition and writing
// so the whole site reads as a single publication.
//
// Theming: every token below resolves to a CSS custom property, so light and
// dark are two values of the same variable rather than two codebases. The
// toggle only flips `data-theme` on <html>; nothing re-renders.
//
// The dark palette in theme.js is a different thing — the old navy — and is
// intentionally left untouched.
// ---------------------------------------------------------------------------

export const palettes = {
  light: {
    paper: '#fbfaf8',
    paperAlt: '#f2efe8', // alternating bands
    surface: '#ffffff', // raised cards on top of paper
    ink: '#16181d',
    inkSoft: '#3d4551',
    muted: '#6b7480',
    rule: '#e6e1d7',
    ruleStrong: '#d3ccbe',
    accent: '#c9a227', // gold — large text, rules and numerals only
    accentDeep: '#8a6d13', // contrast-safe gold for small copy
    // Emphasis panel (the contact CTA). On a light page it reads as a dark
    // panel; it is NOT a straight inversion of the theme — see the dark values,
    // where it stays dark and lifts instead.
    inverseBg: '#171a20',
    inverseInk: '#ffffff',
    inverseInkSoft: 'rgba(255, 255, 255, 0.72)',
    inverseRule: 'rgba(255, 255, 255, 0.35)',
    accentRgb: '201, 162, 39',
    shadowRgb: '22, 24, 29',
  },
  // Warm dark, not the old navy — it has to sit next to the same gold, and a
  // neutral charcoal makes the gold read green.
  dark: {
    paper: '#14120f',
    paperAlt: '#1b1814',
    surface: '#1f1c17',
    ink: '#f0ece4',
    inkSoft: '#c6bfb3',
    muted: '#928a7c',
    rule: '#2c2822',
    ruleStrong: '#3d372e',
    accent: '#d9b64a', // lifted so gold still reads against near-black
    accentDeep: '#e3c76e', // on dark, the contrast-safe gold is the lighter one
    // Emphasis panel stays dark here — lifted off the page rather than flipped
    // to light, which would read as a blown-out slab on a dark site.
    inverseBg: '#221e18',
    inverseInk: '#f5f1e9',
    inverseInkSoft: 'rgba(240, 236, 228, 0.74)',
    inverseRule: 'rgba(240, 236, 228, 0.32)',
    accentRgb: '217, 182, 74',
    shadowRgb: '0, 0, 0',
  },
};

const VAR_NAMES = {
  paper: '--paper',
  paperAlt: '--paper-alt',
  surface: '--surface',
  ink: '--ink',
  inkSoft: '--ink-soft',
  muted: '--muted',
  rule: '--rule',
  ruleStrong: '--rule-strong',
  accent: '--accent',
  accentDeep: '--accent-deep',
  inverseBg: '--inverse-bg',
  inverseInk: '--inverse-ink',
  inverseInkSoft: '--inverse-ink-soft',
  inverseRule: '--inverse-rule',
  accentRgb: '--accent-rgb',
  shadowRgb: '--shadow-rgb',
};

const declare = palette =>
  Object.entries(VAR_NAMES)
    .map(([key, name]) => `${name}: ${palette[key]};`)
    .join('\n    ');

// Injected by GlobalStyle. `data-theme` is stamped on <html> before paint by
// the inline script in gatsby-ssr.js, so there is no flash of the wrong theme.
export const ThemeVars = css`
  /* Dark is the default: it applies with no attribute set at all, so the page
     is dark before the pre-paint script runs and stays dark without JS. */
  :root,
  :root[data-theme='dark'] {
    ${declare(palettes.dark)}
    color-scheme: dark;
  }

  :root[data-theme='light'] {
    ${declare(palettes.light)}
    color-scheme: light;
  }
`;

export const tokens = {
  ...Object.fromEntries(Object.entries(VAR_NAMES).map(([key, name]) => [key, `var(${name})`])),
  // System serif: the editorial voice without shipping another webfont.
  fontDisplay: "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
};

// Literal gold for the few places a CSS variable cannot reach: roughjs option
// objects and SVG presentation attributes, both computed in JS. Gold is legible
// on either ground, so pinning it costs nothing — pinned to the dark value
// since dark is the default presentation.
export const ACCENT_LITERAL = palettes.dark.accent;

const t = tokens;

export const eyebrowStyle = css`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

/* ------------------------------------------------------------------ layout */

export const Page = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1080px;
  padding: 180px 100px 140px;
  ${media.desktop`padding: 170px 80px 120px;`};
  ${media.tablet`padding: 150px 50px 100px;`};
  ${media.phablet`padding: 130px 25px 90px;`};

  &.flush {
    max-width: none;
    padding: 0;
  }
`;

/* Full-bleed horizontal band, with its own inner measure. */
export const Band = styled.section`
  width: 100%;
  padding: 110px 0;
  background-color: ${props => (props.$alt ? t.paperAlt : 'transparent')};
  ${props =>
    props.$dark &&
    css`
      background-color: ${t.inverseBg};
      color: ${t.inverseInkSoft};
      /* the dark-theme panel sits only a few values off the band above it, so a
         gold hairline makes the boundary read as deliberate */
      border-top: 1px solid rgba(var(--accent-rgb), 0.32);
    `};
  ${media.tablet`padding: 80px 0;`};
  ${media.phablet`padding: 64px 0;`};
`;

export const Measure = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.$wide || '1080px'};
  padding: 0 100px;
  ${media.desktop`padding: 0 80px;`};
  ${media.tablet`padding: 0 50px;`};
  ${media.phablet`padding: 0 25px;`};
`;

/* ------------------------------------------------------------- typography */

export const Eyebrow = styled.p`
  ${eyebrowStyle};
  margin: 0 0 18px;
  color: ${props => (props.$onDark ? t.accent : t.accentDeep)};
`;

export const DisplayTitle = styled.h1`
  margin: 0;
  max-width: 17ch;
  font-family: ${t.fontDisplay};
  font-weight: 400;
  font-size: 62px;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: ${props => (props.$onDark ? t.inverseInk : t.ink)};
  ${media.tablet`font-size: 46px;`};
  ${media.phablet`font-size: 34px;`};
`;

export const Lede = styled.p`
  margin: 26px 0 0;
  max-width: 60ch;
  font-size: ${fontSizes.xl};
  line-height: 1.5;
  color: ${props => (props.$onDark ? t.inverseInkSoft : t.inkSoft)};
  ${media.phablet`font-size: ${fontSizes.lg};`};
`;

export const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-family: ${t.fontDisplay};
  font-weight: 400;
  font-size: 38px;
  line-height: 1.15;
  color: ${props => (props.$onDark ? t.inverseInk : t.ink)};
  ${media.tablet`font-size: 30px;`};
  ${media.phablet`font-size: 26px;`};
`;

/* Wrapper for markdown-sourced html so authored prose picks up page styling. */
export const Prose = styled.div`
  max-width: 62ch;
  font-size: ${fontSizes.lg};
  line-height: 1.6;
  color: ${t.inkSoft};

  p {
    margin: 0 0 20px;
  }
  p:last-child {
    margin-bottom: 0;
  }
  a {
    ${mixins.inlineLink};
    color: ${t.accentDeep};
    &:after {
      background-color: ${t.accentDeep};
    }
  }
  strong {
    color: ${t.ink};
  }
  ul {
    ${mixins.fancyList};
    font-size: ${fontSizes.lg};
    li:before {
      color: ${t.accent};
    }
  }
`;

export const PageHead = styled.header`
  padding-bottom: 44px;
  border-bottom: 1px solid ${t.rule};
`;

/* ------------------------------------------------------------------- stats */

export const StatRow = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 56px;
  margin: 44px 0 0;
  ${media.phablet`gap: 28px;`};

  div {
    margin: 0;
  }
  dt {
    ${eyebrowStyle};
    letter-spacing: 0.14em;
    color: ${t.muted};
    margin-bottom: 8px;
  }
  dd {
    margin: 0;
    font-family: ${t.fontDisplay};
    font-size: 40px;
    line-height: 1;
    color: ${t.ink};
    ${media.phablet`font-size: 30px;`};
  }
`;

/* -------------------------------------------------------------- item rows */

export const ItemList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Item = styled.li`
  display: grid;
  grid-template-columns: ${props => props.$columns || '64px 1fr 110px'};
  gap: 0 28px;
  align-items: start;
  padding: 42px 0;
  border-bottom: 1px solid ${t.rule};
  ${media.tablet`
    grid-template-columns: 44px 1fr;
    gap: 0 20px;
  `};
  ${media.phablet`
    grid-template-columns: 1fr;
    padding: 32px 0;
  `};
`;

export const ItemIndex = styled.span`
  font-family: ${t.fontDisplay};
  font-size: 30px;
  line-height: 1.1;
  color: ${t.accent};
  ${media.phablet`
    ${eyebrowStyle};
    color: ${t.accentDeep};
    display: block;
    margin-bottom: 10px;
  `};
`;

export const ItemBody = styled.div`
  min-width: 0;
`;

export const MetaLabel = styled.p`
  ${eyebrowStyle};
  letter-spacing: 0.14em;
  margin: 0 0 10px;
  color: ${t.muted};
`;

export const ItemTitle = styled.h3`
  margin: 0;
  font-family: ${t.fontDisplay};
  font-weight: 400;
  font-size: 27px;
  line-height: 1.25;
  color: ${t.ink};
  ${media.phablet`font-size: 21px;`};

  a {
    color: ${t.ink};
    &:hover,
    &:focus {
      color: ${t.accentDeep};
    }
  }
`;

export const Venue = styled.p`
  margin: 12px 0 0;
  font-size: ${fontSizes.md};
  font-style: italic;
  color: ${t.muted};
`;

export const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 4px 10px;
    border: 1px solid ${t.rule};
    border-radius: 3px;
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.xs};
    letter-spacing: 0.04em;
    color: ${t.muted};
    white-space: nowrap;
  }
`;

/* Her verb-CTA pattern: READ / WATCH / CODE, with the arrow nudging on hover. */
export const VerbLink = styled.a`
  display: inline-block;
  margin: 20px 18px 0 0;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sml};
  letter-spacing: 0.1em;
  color: ${t.accentDeep};
  &:hover,
  &:focus {
    color: ${t.ink};
  }
  span {
    display: inline-block;
    transition: ${theme.transition};
  }
  &:hover span {
    transform: translateX(5px);
  }
`;

export const Citations = styled.div`
  text-align: right;
  ${media.tablet`
    grid-column: 2 / -1;
    text-align: left;
    margin-top: 18px;
  `};
  ${media.phablet`grid-column: 1 / -1;`};

  strong {
    display: block;
    font-family: ${t.fontDisplay};
    font-weight: 400;
    font-size: 44px;
    line-height: 1;
    color: ${t.ink};
    ${media.tablet`display: inline; font-size: 22px; margin-right: 8px;`};
  }
  span {
    ${eyebrowStyle};
    font-size: ${fontSizes.xs};
    letter-spacing: 0.14em;
    color: ${t.muted};
  }
`;

/* ---------------------------------------------------------- filter controls */

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 56px 0 8px;
`;

export const SearchInput = styled.input`
  flex: 1 1 240px;
  max-width: 320px;
  padding: 11px 0;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid ${t.rule};
  border-radius: 0;
  color: ${t.ink};
  font-family: ${fonts.Calibre};
  font-size: ${fontSizes.md};
  &:focus {
    outline: 0;
    border-bottom-color: ${t.accentDeep};
  }
  &::placeholder {
    color: ${t.muted};
  }
`;

export const PillGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Pill = styled.button`
  padding: 7px 16px;
  background-color: ${props => (props.$active ? t.ink : 'transparent')};
  border: 1px solid ${props => (props.$active ? t.ink : t.rule)};
  border-radius: 20px;
  color: ${props => (props.$active ? t.paper : t.muted)};
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smi};
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: ${theme.transition};
  &:hover,
  &:focus {
    outline: 0;
    border-color: ${t.ink};
    color: ${props => (props.$active ? t.paper : t.ink)};
  }
`;

export const Empty = styled.p`
  margin: 48px 0 0;
  font-size: ${fontSizes.lg};
  color: ${t.muted};
`;

/* -------------------------------------------------------------- buttons/cta */

export const Button = styled.a`
  display: inline-block;
  margin-top: 34px;
  padding: 17px 30px;
  border: 1px solid ${props => (props.$onDark ? t.inverseRule : t.ink)};
  border-radius: 2px;
  background-color: transparent;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sml};
  letter-spacing: 0.1em;
  color: ${props => (props.$onDark ? t.inverseInk : t.ink)};
  transition: ${theme.transition};
  &:hover,
  &:focus {
    background-color: ${props => (props.$onDark ? t.inverseInk : t.ink)};
    color: ${props => (props.$onDark ? t.inverseBg : t.paper)};
    border-color: ${props => (props.$onDark ? t.inverseInk : t.ink)};
  }
  &:after {
    display: none !important;
  }
`;

export default tokens;
