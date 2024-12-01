import type { ActorEvent, SceneEvent } from 'remiz';

export const Move = 'Move';
export const ClickAction = 'ClickAction';
export const CursorMove = 'CursorMove';
export const CursorClick = 'CursorClick';
export const CursorLeave = 'CursorLeave';
export const Interact = 'Interact';
export const TakeItem = 'TakeItem';

export type MoveEvent = ActorEvent<{ direction: number; point?: boolean }>;

export type ClickActionEvent = ActorEvent<{ x: number; y: number }>;

export type CursorMoveEvent = ActorEvent<{ x: number; y: number }>;

export type CursorClickEvent = ActorEvent<{ x: number; y: number }>;

export type TakeItemEvent = ActorEvent<{ item: string }>;

export type InteractEvent = SceneEvent<{ actionTarget: string }>;

declare module 'remiz' {
  export interface ActorEventMap {
    [Move]: MoveEvent
    [ClickAction]: ClickActionEvent
    [CursorMove]: CursorMoveEvent
    [CursorClick]: CursorClickEvent
    [CursorLeave]: ActorEvent
    [TakeItem]: TakeItemEvent
  }

  export interface SceneEventMap {
    [Interact]: InteractEvent
  }
}
