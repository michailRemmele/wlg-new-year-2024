import type { Reference } from 'remiz-editor';

import {
  Move,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    Move,
  ].map((value) => ({ title: value, value })),
};
