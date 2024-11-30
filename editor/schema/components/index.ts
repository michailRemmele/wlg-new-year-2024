import type { WidgetSchema } from 'remiz-editor';

import {
  Movement,
} from '../../../src/game/components';

import { movement } from './movement';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Movement.componentName]: movement,
};
