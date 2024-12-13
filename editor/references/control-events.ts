import type { Reference } from 'remiz-editor';

import {
  Move,
  ClickAction,
  CursorMove,
  CursorClick,
  CursorLeave,
  CursorDown,
  CursorUp,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    Move,
    ClickAction,
    CursorMove,
    CursorClick,
    CursorLeave,
    CursorDown,
    CursorUp,
  ].map((value) => ({ title: value, value })),
};
