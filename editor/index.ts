import {
  ParallaxSystem,
  Parallax,
} from 'remiz-game-systems';
import {
  parallaxSystem,
  parallax,
  locales as gameSystemsLocales,
} from 'remiz-game-systems/schema';

import {
  componentsSchema as gameComponentsSchema,
  systemsSchema as gameSystemsSchema,
  resourcesSchema,
} from './schema';
import { globalReferences } from './references';

import en from './locales/en.json';

const locales = {
  en: {
    ...en,
    ...gameSystemsLocales.en,
  },
};

export const componentsSchema = {
  ...gameComponentsSchema,
  [Parallax.componentName]: parallax,
};

export const systemsSchema = {
  ...gameSystemsSchema,
  [ParallaxSystem.systemName]: parallaxSystem,
};

export {
  resourcesSchema,
  globalReferences,
  locales,
};
