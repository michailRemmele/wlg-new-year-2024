import type { ActorEvent } from 'remiz';

export const MovementDirection = 'MovementDirection';
export const GameOver = 'GameOver';
export const Move = 'Move';

export type MoveEvent = ActorEvent<{
  direction: number
}>;

declare module 'remiz' {
  export interface ActorEventMap {
    [Move]: MoveEvent
  }
}
