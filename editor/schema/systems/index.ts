import type { WidgetSchema } from 'remiz-editor';

import { MovementSystem } from '../../../src/game/systems';

import { movementSystem } from './movement-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  [MovementSystem.systemName]: movementSystem,
};
