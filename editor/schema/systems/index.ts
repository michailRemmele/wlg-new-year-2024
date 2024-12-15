import type { WidgetSchema } from 'remiz-editor';

import {
  MovementSystem,
  Journal,
  LevelManager,
  Saver,
  CursorPainter,
  ElectricalPanelGame,
  ArcadeCabinetGame,
} from '../../../src/game/systems';

import { movementSystem } from './movement-system';
import { journal } from './journal';
import { levelManager } from './level-manager';
import { saver } from './saver';
import { cursorPainter } from './cursor-painer';
import { electricalPanelGame } from './electrical-panel-game';
import { arcadeCabinetGame } from './arcade-cabinet-game';

export const systemsSchema: Record<string, WidgetSchema> = {
  [MovementSystem.systemName]: movementSystem,
  [Journal.systemName]: journal,
  [LevelManager.systemName]: levelManager,
  [Saver.systemName]: saver,
  [CursorPainter.systemName]: cursorPainter,
  [ElectricalPanelGame.systemName]: electricalPanelGame,
  [ArcadeCabinetGame.systemName]: arcadeCabinetGame,
};
