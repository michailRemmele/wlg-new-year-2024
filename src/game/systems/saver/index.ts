import {
  System,
  Transform,
} from 'remiz';
import type {
  Scene,
  SystemOptions,
} from 'remiz';

import * as EventType from '../../events';
import type {
  TakeItemEvent,
  RemoveItemEvent,
  LoadRoomEvent,
  UpdateJournalEvent,
} from '../../events';
import { PLAYER_NAME } from '../../../consts/actors';
import { ROOM_1_ID } from '../../../consts/levels';
import { MAX_JOURNAL_SIZE } from '../../../consts/journal';

const SAVE_STATE_LS_KEY = 'saveState';

const INITIAL_SAVE_STATE: SaveState = {
  playerPosition: null,
  currentLevelId: ROOM_1_ID,
  collectableItems: {},
  questItems: {},
  journal: [],
  touched: false,
};

export type SaveState = {
  playerPosition: {
    x: number
    y: number
  } | null
  currentLevelId: string
  collectableItems: Record<string, {
    collected: boolean
    activated: boolean
  }>
  questItems: Record<string, {
    state?: string
    appliedItems: string[]
  }>
  journal: { id: string; title: string }[]
  touched: boolean
};

export class Saver extends System {
  private scene: Scene;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    let saveState: SaveState;
    try {
      const lsEntry = window.localStorage.getItem(SAVE_STATE_LS_KEY);
      saveState = lsEntry ? JSON.parse(lsEntry) as SaveState : structuredClone(INITIAL_SAVE_STATE);
    } catch (err) {
      saveState = structuredClone(INITIAL_SAVE_STATE);
      console.error('An error occured during save load');
    }

    window.saveState = saveState;
  }

  mount(): void {
    this.scene.addEventListener(EventType.TakeItem, this.handleTakeItem);
    this.scene.addEventListener(EventType.RemoveItem, this.handleRemoveItem);
    this.scene.addEventListener(EventType.LoadRoom, this.handleLoadRoom);
    this.scene.addEventListener(EventType.UpdateJournal, this.handleUpdateJournal);

    this.scene.addEventListener(EventType.ResetSaveState, this.handleResetSaveState);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.TakeItem, this.handleTakeItem);
    this.scene.removeEventListener(EventType.RemoveItem, this.handleRemoveItem);
    this.scene.removeEventListener(EventType.LoadRoom, this.handleLoadRoom);
    this.scene.removeEventListener(EventType.UpdateJournal, this.handleUpdateJournal);

    this.scene.removeEventListener(EventType.ResetSaveState, this.handleResetSaveState);
  }

  private handleTakeItem = (event: TakeItemEvent): void => {
    window.saveState!.collectableItems[event.item] = { collected: true, activated: false };

    this.save();
  };

  private handleRemoveItem = (event: RemoveItemEvent): void => {
    window.saveState!.collectableItems[event.item] = { collected: true, activated: true };

    window.saveState!.questItems[event.applicationTarget] ??= { appliedItems: [] };
    window.saveState!.questItems[event.applicationTarget].appliedItems = [
      ...window.saveState!.questItems[event.applicationTarget].appliedItems,
      event.item,
    ];

    this.save();
  };

  private handleLoadRoom = (event: LoadRoomEvent): void => {
    window.saveState!.currentLevelId = event.levelId;

    this.save();
  };

  private handleUpdateJournal = (event: UpdateJournalEvent): void => {
    const prevJournal = window.saveState!.journal;
    window.saveState!.journal = [
      ...prevJournal.slice(Math.max(prevJournal.length - (MAX_JOURNAL_SIZE - 1), 0)),
      { id: event.id, title: event.title },
    ];

    this.save();
  };

  private handleResetSaveState = (): void => {
    window.saveState = structuredClone(INITIAL_SAVE_STATE);
    window.localStorage.removeItem(SAVE_STATE_LS_KEY);
  };

  private save(): void {
    const player = this.scene.getEntityByName(PLAYER_NAME)!;
    const transform = player.getComponent(Transform);

    window.saveState!.playerPosition = {
      x: transform.offsetX,
      y: transform.offsetY,
    };

    window.saveState!.touched = true;

    window.localStorage.setItem(SAVE_STATE_LS_KEY, JSON.stringify(window.saveState));
  }
}

Saver.systemName = 'Saver';