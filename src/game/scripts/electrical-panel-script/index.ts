import type {
  Actor,
  Scene,
  ScriptOptions,
  UpdateOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import { ELECTRICAL_PANEL_LEVEL_ID } from '../../../consts/levels';
import { ELECTRICAL_PANEL_GAME_ID } from '../../../consts/scenes';
import * as EventType from '../../events';

const TIMEOUT = 1000;

export class ElectricalPanelScript extends Script {
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
      levelId: ELECTRICAL_PANEL_LEVEL_ID,
      sceneId: ELECTRICAL_PANEL_GAME_ID,
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
      this.scene.dispatchEvent(EventType.RepairSuccess);
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: 'done',
      });
    }
    if (state === 'fail') {
      this.scene.dispatchEvent(EventType.RepairFail);
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: undefined,
      });
    }
  }
}

ElectricalPanelScript.scriptName = 'ElectricalPanelScript';
