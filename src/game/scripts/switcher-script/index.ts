import type {
  Actor,
  Scene,
  ScriptOptions,
  UpdateOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import * as EventType from '../../events';
import type { ApplyItemEvent } from '../../events';
import {
  ELECTRICAL_PANEL_ID,
  CHRISTMAS_TREE_ID,
  GARLAND_ID,
} from '../../../consts/actors';
import { STATE as ELECTRICAL_PANEL_STATE } from '../electrical-panel-script';

const SHORT_CIRCUIT_TIMEOUT = 1000;
export const STATE = {
  USELESS_FAIL: 'uselessFail',
  INACTIVE_FAIL: 'inactiveFail',
  ACTIVE_FAIL: 'activeFail',
  USELESS_SUCCESS: 'uselessSuccess',
  INACTIVE_SUCCESS: 'inactiveSuccess',
  ACTIVE_SUCCESS: 'activeSuccess',
};

export class SwitcherScript extends Script {
  private actor: Actor;
  private scene: Scene;

  private shortCircuitTimeout: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.shortCircuitTimeout = SHORT_CIRCUIT_TIMEOUT;

    const state = window.saveState?.questItems[this.actor.id]?.state;
    if (!state) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.USELESS_FAIL,
      });
    }

    const eletricalPanelState = window.saveState?.questItems[ELECTRICAL_PANEL_ID]?.state;
    if (eletricalPanelState === 'done' && state !== STATE.ACTIVE_SUCCESS) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.INACTIVE_SUCCESS,
      });
    }

    this.actor.addEventListener(EventType.StudyItem, this.handleStudyItem);
    this.scene.addEventListener(EventType.ApplyItem, this.handleApplyItem);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.StudyItem, this.handleStudyItem);
    this.scene.removeEventListener(EventType.ApplyItem, this.handleApplyItem);
  }

  private handleStudyItem = (): void => {
    const state = window.saveState?.questItems[this.actor.id]?.state;

    if (state === STATE.INACTIVE_FAIL) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.ACTIVE_FAIL,
      });
    }
    if (state === STATE.INACTIVE_SUCCESS) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.ACTIVE_SUCCESS,
      });
    }
  };

  private handleApplyItem = (event: ApplyItemEvent): void => {
    if (event.target.id === CHRISTMAS_TREE_ID && event.item === GARLAND_ID) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.INACTIVE_FAIL,
      });
    }
  };

  update(options: UpdateOptions): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;

    if (state !== STATE.ACTIVE_FAIL) {
      return;
    }

    const { deltaTime } = options;

    this.shortCircuitTimeout -= deltaTime;
    if (this.shortCircuitTimeout > 0) {
      return;
    }

    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: this.actor.id,
      state: STATE.USELESS_SUCCESS,
    });
    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: ELECTRICAL_PANEL_ID,
      state: ELECTRICAL_PANEL_STATE.ENABLED,
    });
  }
}

SwitcherScript.scriptName = 'SwitcherScript';
