import { useState, useEffect } from 'react';

export type MediaChecks = {
  isPhone: boolean
  isTablet: boolean
  isDesktopS: boolean
  isDesktopM: boolean
  isDesktopL: boolean
};

export type UseMediaHook = () => MediaChecks;

const BREAKPOINTS = {
  isPhone: '(max-width: 767px)',
  isTablet: '(min-width: 768px) and (max-width: 1024px)',
  isDesktopS: '(min-width: 1025px) and (max-width: 1366px)',
  isDesktopM: '(min-width: 1367px) and (max-width: 1920px)',
  isDesktopL: '(min-width: 1921px)',
} as const;
const FLAGS = ['isPhone', 'isTablet', 'isDesktopS', 'isDesktopM', 'isDesktopL'] as const;

export const useMedia: UseMediaHook = () => {
  const getFlags = (): MediaChecks => {
    return FLAGS.reduce((acc, key) => {
      acc[key] = window.matchMedia(BREAKPOINTS[key]).matches;
      return acc;
    }, {} as MediaChecks);
  };

  const [flags, setFlags] = useState(getFlags);

  useEffect(() => {
    const updateFlags = (): void => setFlags(getFlags());

    const mediaQueryLists = FLAGS.map((key) => {
      return window.matchMedia(BREAKPOINTS[key]);
    });

    mediaQueryLists.forEach((mql) => mql.addEventListener('change', updateFlags));

    return (): void => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener('change', updateFlags);
      });
    };
  }, []);

  return flags;
};
