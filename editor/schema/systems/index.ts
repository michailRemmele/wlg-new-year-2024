import type { WidgetSchema } from 'remiz-editor';

import {
  MovementSystem,
  Journal,
} from '../../../src/game/systems';

import { movementSystem } from './movement-system';
import { journal } from './journal';

export const systemsSchema: Record<string, WidgetSchema> = {
  [MovementSystem.systemName]: movementSystem,
  [Journal.systemName]: journal,
};
