import type { ActorEvent } from 'remiz';

export const Move = 'Move';
export const ClickAction = 'ClickAction';

export type MoveEvent = ActorEvent<{
  direction: number
}>;

export type ClickActionEvent = ActorEvent<{
  x: number
  y: number
}>;

declare module 'remiz' {
  export interface ActorEventMap {
    [Move]: MoveEvent
    [ClickAction]: ClickActionEvent
  }
}
