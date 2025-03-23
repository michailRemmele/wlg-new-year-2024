import * as EventType from 'dacha/events';
import type { Reference } from 'dacha-workbench';

import * as GameEventType from '../../src/game/events';

export const eventsReference: Reference = {
  items: [
    ...Object.values(GameEventType),
    ...Object.values(EventType),
  ].map((value) => ({ title: value, value })),
};
