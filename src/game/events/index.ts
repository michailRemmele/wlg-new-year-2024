import type { ActorEvent, SceneEvent } from 'remiz';

export const Move = 'Move';
export const ClickAction = 'ClickAction';
export const CursorMove = 'CursorMove';
export const CursorClick = 'CursorClick';
export const CursorLeave = 'CursorLeave';
export const Interact = 'Interact';
export const TakeItem = 'TakeItem';
export const SelectItem = 'SelectItem';
export const CancelItemSelection = 'CancelItemSelection';
export const UpdateJournal = 'UpdateJournal';
export const ApplyItem = 'ApplyItem';
export const RemoveItem = 'RemoveItem';
export const StudyItem = 'StudyItem';
export const RejectItem = 'RejectItem';
export const EnterRoom = 'EnterRoom';
export const EnterScene = 'EnterScene';
export const LoadRoom = 'LoadRoom';
export const ResetSaveState = 'ResetSaveState';

export type MoveEvent = ActorEvent<{ direction: number; point?: boolean }>;

export type ClickActionEvent = ActorEvent<{ x: number; y: number }>;

export type CursorMoveEvent = ActorEvent<{ x: number; y: number }>;

export type CursorClickEvent = ActorEvent<{ x: number; y: number }>;

export type ApplyItemEvent = ActorEvent<{ item: string }>;

export type TakeItemEvent = SceneEvent<{ item: string }>;
export type SelectItemEvent = SceneEvent<{ item: string }>;
export type RemoveItemEvent = SceneEvent<{ item: string; applicationTarget: string }>;
export type RejectItemEvent = SceneEvent<{ item: string; applicationTarget: string }>;

export type InteractEvent = SceneEvent<{ actionTarget: string; selectedItem?: string }>;

export type UpdateJournalEvent = SceneEvent<{ id: string; title: string }>;

export type EnterRoomEvent = SceneEvent<{ levelId: string, spawnerId: string }>;
export type EnterSceneEvent = SceneEvent<{ levelId: string, sceneId: string }>;
export type LoadRoomEvent = SceneEvent<{ levelId: string }>;

declare module 'remiz' {
  export interface ActorEventMap {
    [Move]: MoveEvent
    [ClickAction]: ClickActionEvent
    [CursorMove]: CursorMoveEvent
    [CursorClick]: CursorClickEvent
    [CursorLeave]: ActorEvent
    [ApplyItem]: ApplyItemEvent
    [StudyItem]: ActorEvent
  }

  export interface SceneEventMap {
    [Interact]: InteractEvent
    [TakeItem]: TakeItemEvent
    [SelectItem]: SelectItemEvent
    [RemoveItem]: RemoveItemEvent
    [RejectItem]: RejectItemEvent
    [CancelItemSelection]: SceneEvent
    [UpdateJournal]: UpdateJournalEvent
    [EnterRoom]: EnterRoomEvent
    [EnterScene]: EnterSceneEvent
    [LoadRoom]: LoadRoomEvent
    [ResetSaveState]: SceneEvent
  }
}
