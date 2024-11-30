import type { References } from 'remiz-editor';

import { eventsReference } from './events';
import { controlEventsReference } from './control-events';

export const globalReferences: References = {
  events: eventsReference,
  controlEvents: controlEventsReference,
};
