import type { ActorEvent, SceneEvent } from 'remiz';

export const Move = 'Move';
export const PlayerAction = 'PlayerAction';
export const ClickAction = 'ClickAction';
export const CursorMove = 'CursorMove';
export const CursorClick = 'CursorClick';
export const CursorDown = 'CursorDown';
export const CursorUp = 'CursorUp';
export const CursorLeave = 'CursorLeave';
export const Interact = 'Interact';
export const TakeItem = 'TakeItem';
export const GiveItem = 'GiveItem';
export const SelectItem = 'SelectItem';
export const CancelItemSelection = 'CancelItemSelection';
export const UpdateJournal = 'UpdateJournal';
export const ApplyItem = 'ApplyItem';
export const RemoveItem = 'RemoveItem';
export const StudyItem = 'StudyItem';
export const RejectItem = 'RejectItem';
export const ChangeItemState = 'ChangeItemState';
export const EnterRoom = 'EnterRoom';
export const EnterScene = 'EnterScene';
export const LoadRoom = 'LoadRoom';
export const ResetSaveState = 'ResetSaveState';
export const ShortCircuit = 'ShortCircuit';
export const RepairStart = 'RepairStart';
export const RepairEnd = 'RepairEnd';
export const RepairTimerUpdate = 'RepairTimerUpdate';
export const RepairScoreUpdate = 'RepairScoreUpdate';
export const RepairSuccess = 'RepairSuccess';
export const RepairFail = 'RepairFail';
export const CourierPlay = 'CourierPlay';
export const CourierStart = 'CourierStart';
export const CourierJump = 'CourierJump';
export const CourierJumpSuccess = 'CourierJumpSuccess';
export const CourierDamage = 'CourierDamage';
export const CourierDeath = 'CourierDeath';
export const CourierSuccess = 'CourierSuccess';
export const CourierFail = 'CourierFail';
export const StartGame = 'StartGame';
export const NeedChristmasTree = 'NeedChristmasTree';
export const NeedGarland = 'NeedGarland';
export const NeedFood = 'NeedFood';
export const GameOver = 'GameOver';

export type MoveEvent = ActorEvent<{ direction: number; point?: boolean }>;

export type ClickActionEvent = ActorEvent<{ x: number; y: number }>;
export type CursorMoveEvent = ActorEvent<{
  x: number;
  y: number;
  screenX: number;
  screenY: number;
}>;
export type CursorClickEvent = ActorEvent<{
  x: number;
  y: number;
  screenX: number;
  screenY: number;
}>;
export type CursorDownEvent = ActorEvent<{
  x: number;
  y: number;
  screenX: number;
  screenY: number;
}>;
export type CursorUpEvent = ActorEvent<{
  x: number;
  y: number;
  screenX: number;
  screenY: number;
}>;

export type ApplyItemEvent = ActorEvent<{ item: string }>;

export type CourierDamageEvent = ActorEvent<{ value: number }>;

export type TakeItemEvent = SceneEvent<{ item: string }>;
export type GiveItemEvent = SceneEvent<{ item: string }>;
export type SelectItemEvent = SceneEvent<{ item: string }>;
export type RemoveItemEvent = SceneEvent<{ item: string; applicationTarget: string }>;
export type RejectItemEvent = SceneEvent<{ item: string; applicationTarget: string }>;
export type ChangeItemStateEvent = SceneEvent<{
  item: string;
  itemTemplate?: string;
  state: string | undefined;
}>;

export type InteractEvent = SceneEvent<{ actionTarget: string; selectedItem?: string }>;

export type UpdateJournalEvent = SceneEvent<{ id: string; title: string }>;

export type EnterRoomEvent = SceneEvent<{ levelId: string, spawnerId: string }>;
export type EnterSceneEvent = SceneEvent<{ levelId: string, sceneId: string }>;
export type LoadRoomEvent = SceneEvent<{ levelId: string }>;

export type RepairStartEvent = SceneEvent<{ screenX: number; screenY: number }>;
export type RepairEndEvent = SceneEvent<{ screenX: number; screenY: number }>;
export type RepairTimerUpdateEvent = SceneEvent<{ timer: number }>;
export type RepairScoreUpdateEvent = SceneEvent<{ score: number }>;

declare module 'remiz' {
  export interface ActorEventMap {
    [Move]: MoveEvent
    [PlayerAction]: ActorEvent
    [ClickAction]: ClickActionEvent
    [CursorMove]: CursorMoveEvent
    [CursorClick]: CursorClickEvent
    [CursorLeave]: ActorEvent
    [CursorDown]: CursorDownEvent
    [CursorUp]: CursorUpEvent
    [ApplyItem]: ApplyItemEvent
    [StudyItem]: ActorEvent
    [CourierJumpSuccess]: ActorEvent
    [CourierDamage]: CourierDamageEvent
    [CourierDeath]: ActorEvent
  }

  export interface SceneEventMap {
    [Interact]: InteractEvent
    [TakeItem]: TakeItemEvent
    [GiveItem]: GiveItemEvent
    [SelectItem]: SelectItemEvent
    [RemoveItem]: RemoveItemEvent
    [RejectItem]: RejectItemEvent
    [ChangeItemState]: ChangeItemStateEvent
    [CancelItemSelection]: SceneEvent
    [UpdateJournal]: UpdateJournalEvent
    [EnterRoom]: EnterRoomEvent
    [EnterScene]: EnterSceneEvent
    [LoadRoom]: LoadRoomEvent
    [ResetSaveState]: SceneEvent
    [ShortCircuit]: SceneEvent
    [RepairStart]: RepairStartEvent
    [RepairEnd]: RepairEndEvent
    [RepairTimerUpdate]: RepairTimerUpdateEvent
    [RepairScoreUpdate]: RepairScoreUpdateEvent
    [RepairSuccess]: SceneEvent
    [RepairFail]: SceneEvent
    [CourierPlay]: SceneEvent
    [CourierStart]: SceneEvent
    [CourierJump]: SceneEvent
    [CourierSuccess]: SceneEvent
    [CourierFail]: SceneEvent
    [StartGame]: SceneEvent
    [NeedChristmasTree]: SceneEvent
    [NeedGarland]: SceneEvent
    [NeedFood]: SceneEvent
    [GameOver]: SceneEvent
  }
}
