import type { WidgetSchema } from 'remiz-editor';

import {
  Movement,
  Interactable,
  Cursor,
  Inventory,
  Entrance,
  PathMark,
} from '../../../src/game/components';

import { movement } from './movement';
import { interactable } from './interactable';
import { cursor } from './cursor';
import { inventory } from './inventory';
import { entrance } from './entrance';
import { pathMark } from './path-mark';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Movement.componentName]: movement,
  [Interactable.componentName]: interactable,
  [Cursor.componentName]: cursor,
  [Inventory.componentName]: inventory,
  [Entrance.componentName]: entrance,
  [PathMark.componentName]: pathMark,
};
