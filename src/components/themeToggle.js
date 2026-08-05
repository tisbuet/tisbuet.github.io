import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme, tokens, palettes } from '@styles';
const { fontSizes, fonts } = theme;

/*
 * Light/dark switch. All it does is stamp `data-theme` on <html>; the CSS
 * custom properties in editorial.js do the rest, so nothing re-renders and no
 * theme object is threaded through the tree.
 *
 * Which face shows is decided by CSS off the `data-theme` attribute rather than
 * React state. That means the correct icon is painted on first render — before
 * hydration — so there is no placeholder and no layout shift.
 */

export const STORAGE_KEY = 'tisbuet-theme';

const StyledToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-left: 12px;
  padding: 9px 13px;
  background-color: transparent;
  border: 1px solid ${tokens.rule};
  border-radius: 2px;
  color: ${tokens.muted};
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smi};
  letter-spacing: 0.1em;
  white-space: nowrap;
  transition: ${theme.transition};

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${tokens.ink};
    color: ${tokens.ink};
  }

  svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
  }

  /* Dark is the default, so the default face offers light; only an explicitly
     light page offers dark. Keyed off the attribute so the correct face paints
     before hydration. */
  .face-dark {
    display: none;
  }
  .face-light {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }
  html[data-theme='light'] & {
    .face-light {
      display: none;
    }
    .face-dark {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
  }
`;

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.4v2.3M12 19.3v2.3M2.4 12h2.3M19.3 12h2.3M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1z" />
  </svg>
);

const readTheme = () =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

const ThemeToggle = () => {
  const buttonRef = useRef(null);

  // aria-pressed cannot be driven by CSS, so sync it imperatively.
  const syncPressed = mode => {
    if (buttonRef.current) {
      buttonRef.current.setAttribute('aria-pressed', String(mode === 'dark'));
    }
  };

  useEffect(() => syncPressed(readTheme()), []);

  const flip = () => {
    const next = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // private mode / storage disabled — the toggle still works for this visit
    }
    // keep the mobile browser chrome in step with the page
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', palettes[next].paper);
    }
    syncPressed(next);
  };

  return (
    <StyledToggle
      ref={buttonRef}
      type="button"
      onClick={flip}
      aria-pressed="true"
      aria-label="Toggle dark mode"
      title="Toggle dark mode">
      <span className="face-dark">
        <MoonIcon />
        DARK
      </span>
      <span className="face-light">
        <SunIcon />
        LIGHT
      </span>
    </StyledToggle>
  );
};

export default ThemeToggle;
