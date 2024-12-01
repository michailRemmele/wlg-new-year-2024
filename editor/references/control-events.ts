import type { Reference } from 'remiz-editor';

import {
  Move,
  ClickAction,
  CursorMove,
  CursorClick,
  CursorLeave,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    Move,
    ClickAction,
    CursorMove,
    CursorClick,
    CursorLeave,
  ].map((value) => ({ title: value, value })),
};
