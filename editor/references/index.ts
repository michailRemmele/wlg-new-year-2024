import type { References } from 'dacha-workbench';

import { eventsReference } from './events';
import { controlEventsReference } from './control-events';

export const globalReferences: References = {
  events: eventsReference,
  controlEvents: controlEventsReference,
};
