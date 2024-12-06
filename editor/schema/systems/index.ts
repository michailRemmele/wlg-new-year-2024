import type { WidgetSchema } from 'remiz-editor';

import {
  MovementSystem,
  Journal,
  LevelManager,
  Saver,
} from '../../../src/game/systems';

import { movementSystem } from './movement-system';
import { journal } from './journal';
import { levelManager } from './level-manager';
import { saver } from './saver';

export const systemsSchema: Record<string, WidgetSchema> = {
  [MovementSystem.systemName]: movementSystem,
  [Journal.systemName]: journal,
  [LevelManager.systemName]: levelManager,
  [Saver.systemName]: saver,
};
