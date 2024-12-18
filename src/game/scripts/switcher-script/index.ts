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

const SHORT_CIRCUIT_TIMEOUT = 2000;

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
        state: 'uselessFail',
      });
    }

    const eletricalPanelState = window.saveState?.questItems[ELECTRICAL_PANEL_ID]?.state;
    if (eletricalPanelState === 'done') {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: 'inactiveSuccess',
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

    if (state === 'inactiveFail') {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: 'activeFail',
      });
    }
    if (state === 'inactiveSuccess') {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: 'activeSuccess',
      });
    }
  };

  private handleApplyItem = (event: ApplyItemEvent): void => {
    if (event.target.id === CHRISTMAS_TREE_ID && event.item === GARLAND_ID) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: 'inactiveFail',
      });
    }
  };

  update(options: UpdateOptions): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;

    if (state !== 'activeFail') {
      return;
    }

    const { deltaTime } = options;

    this.shortCircuitTimeout -= deltaTime;
    if (this.shortCircuitTimeout > 0) {
      return;
    }

    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: this.actor.id,
      state: 'uselessSuccess',
    });
  }
}

SwitcherScript.scriptName = 'SwitcherScript';
