import type {
  Actor,
  Scene,
  ScriptOptions,
  UpdateOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import { PLAYER_NAME } from '../../../consts/actors';
import { ARCADE_CABINET_LEVEL_ID } from '../../../consts/levels';
import { ARCADE_CABINET_GAME_ID } from '../../../consts/scenes';
import { PIZZA_ID } from '../../../consts/templates';
import { Inventory } from '../../components';
import * as EventType from '../../events';

export const STATE = {
  INITIAL: 'initial',
  DONE: 'done',
  SUCCESS: 'success',
  FAIL: 'fail',
};
const TIMEOUT = 1000;

export class ArcadeCabinetScript extends Script {
  private actor: Actor;
  private scene: Scene;

  private timeout: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.timeout = TIMEOUT;

    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (!state) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.INITIAL,
      });
    }

    this.actor.addEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  private handleStudyItem = (): void => {
    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (state !== STATE.INITIAL) {
      return;
    }

    this.scene.dispatchEvent(EventType.EnterScene, {
      levelId: ARCADE_CABINET_LEVEL_ID,
      sceneId: ARCADE_CABINET_GAME_ID,
    });
  };

  update(options: UpdateOptions): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (state === STATE.INITIAL || state === STATE.DONE) {
      return;
    }

    const { deltaTime } = options;

    this.timeout -= deltaTime;
    if (this.timeout > 0) {
      return;
    }

    if (state === STATE.SUCCESS) {
      this.scene.dispatchEvent(EventType.CourierSuccess);
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.DONE,
      });

      const player = this.scene.getEntityByName(PLAYER_NAME);
      const inventory = player?.getComponent(Inventory);
      inventory?.items.push(PIZZA_ID);

      this.scene.dispatchEvent(EventType.GiveItem, { item: PIZZA_ID });
    }
    if (state === STATE.FAIL) {
      this.scene.dispatchEvent(EventType.CourierFail);
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.INITIAL,
      });
    }
  }
}

ArcadeCabinetScript.scriptName = 'ArcadeCabinetScript';
