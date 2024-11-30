import * as EventType from 'remiz/events';
import type { Reference } from 'remiz-editor';

import * as GameEventType from '../../src/game/events';

export const eventsReference: Reference = {
  items: [
    ...Object.values(GameEventType),
    ...Object.values(EventType),
  ].map((value) => ({ title: value, value })),
};
