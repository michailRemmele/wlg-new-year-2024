import type { WidgetSchema } from 'remiz-editor';

import {
  Movement,
  Interactable,
  Cursor,
  Inventory,
  Entrance,
  PathMark,
  CourierHealth,
  Trap,
  State,
} from '../../../src/game/components';

import { movement } from './movement';
import { interactable } from './interactable';
import { cursor } from './cursor';
import { inventory } from './inventory';
import { entrance } from './entrance';
import { pathMark } from './path-mark';
import { courierHealth } from './courier-health';
import { trap } from './trap';
import { state } from './state';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Movement.componentName]: movement,
  [Interactable.componentName]: interactable,
  [Cursor.componentName]: cursor,
  [Inventory.componentName]: inventory,
  [Entrance.componentName]: entrance,
  [PathMark.componentName]: pathMark,
  [CourierHealth.componentName]: courierHealth,
  [Trap.componentName]: trap,
  [State.componentName]: state,
};
