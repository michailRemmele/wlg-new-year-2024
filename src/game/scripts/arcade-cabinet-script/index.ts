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

    this.actor.addEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  private handleStudyItem = (): void => {
    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (state) {
      return;
    }

    this.scene.dispatchEvent(EventType.EnterScene, {
      levelId: ARCADE_CABINET_LEVEL_ID,
      sceneId: ARCADE_CABINET_GAME_ID,
    });
  };

  update(options: UpdateOptions): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (!state || state === 'done') {
      return;
    }

    const { deltaTime } = options;

    this.timeout -= deltaTime;
    if (this.timeout > 0) {
      return;
    }

    if (state === 'success') {
      this.scene.dispatchEvent(EventType.CourierSuccess);
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: 'done',
      });

      const player = this.scene.getEntityByName(PLAYER_NAME);
      const inventory = player?.getComponent(Inventory);
      inventory?.items.push(PIZZA_ID);

      this.scene.dispatchEvent(EventType.GiveItem, { item: PIZZA_ID });
    }
    if (state === 'fail') {
      this.scene.dispatchEvent(EventType.CourierFail);
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: undefined,
      });
    }
  }
}

ArcadeCabinetScript.scriptName = 'ArcadeCabinetScript';
