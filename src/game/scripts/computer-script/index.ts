import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import * as EventType from '../../events';
import {
  SWITCHER_ID,
  CHRISTMAS_TREE_ID,
  ARCADE_CABINET_ID,
} from '../../../consts/actors';
import { STATE as SWITCHER_STATE } from '../switcher-script';
import { STATE as CHRISTMAS_TREE_STATE } from '../christmas-tree-script';
import { STATE as ARCADE_CABINET_STATE } from '../arcade-cabinet-script';

export const STATE = {
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  RUN: 'run',
};

export class ComputerScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (!state) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.DISABLED,
      });
    }

    if (state === STATE.RUN) {
      this.scene.dispatchEvent(EventType.GameOver);
    }

    this.actor.addEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  private handleStudyItem = (): void => {
    const christmasTreeState = window.saveState?.questItems[CHRISTMAS_TREE_ID]?.state;
    const switcherState = window.saveState?.questItems[SWITCHER_ID]?.state;
    const arcadeCabinetState = window.saveState?.questItems[ARCADE_CABINET_ID]?.state;

    if (christmasTreeState !== CHRISTMAS_TREE_STATE.DONE) {
      this.scene.dispatchEvent(EventType.NeedChristmasTree);
      return;
    }
    if (switcherState !== SWITCHER_STATE.ACTIVE_SUCCESS) {
      this.scene.dispatchEvent(EventType.NeedGarland);
      return;
    }
    if (arcadeCabinetState !== ARCADE_CABINET_STATE.DONE) {
      this.scene.dispatchEvent(EventType.NeedFood);
      return;
    }

    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (state === STATE.ENABLED) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.RUN,
      });
      this.scene.dispatchEvent(EventType.GameOver);
    }
  };

  update(): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (state !== STATE.DISABLED) {
      return;
    }

    const christmasTreeState = window.saveState?.questItems[CHRISTMAS_TREE_ID]?.state;
    const switcherState = window.saveState?.questItems[SWITCHER_ID]?.state;
    const arcadeCabinetState = window.saveState?.questItems[ARCADE_CABINET_ID]?.state;

    if (christmasTreeState !== CHRISTMAS_TREE_STATE.DONE) {
      return;
    }
    if (switcherState !== SWITCHER_STATE.ACTIVE_SUCCESS) {
      return;
    }
    if (arcadeCabinetState !== ARCADE_CABINET_STATE.DONE) {
      return;
    }

    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: this.actor.id,
      state: STATE.ENABLED,
    });
  }
}

ComputerScript.scriptName = 'ComputerScript';
