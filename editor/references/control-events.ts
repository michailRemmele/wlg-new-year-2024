import type { Reference } from 'remiz-editor';

import {
  Move,
  ClickAction,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    Move,
    ClickAction,
  ].map((value) => ({ title: value, value })),
};
