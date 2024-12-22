import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import * as EventType from '../../events';
import type { ChangeItemStateEvent } from '../../events';
import {
  SWITCHER_ID,
} from '../../../consts/actors';
import { STATE as SWITCHER_STATE } from '../switcher-script';

const STATE = {
  ONLINE: 'online',
  ACTIVE_FAIL: 'activeFail',
  ACTIVE_SUCCESS: 'activeSuccess',
  OFFLINE: 'offline',
};

export class GarlandScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    const switcherState = window.saveState?.questItems[SWITCHER_ID]?.state;

    this.updateState(switcherState);

    this.scene.addEventListener(EventType.ChangeItemState, this.handleChangeItemState);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.ChangeItemState, this.handleChangeItemState);
  }

  private handleChangeItemState = (event: ChangeItemStateEvent): void => {
    const { state, item } = event;

    if (item === SWITCHER_ID) {
      this.updateState(state);
    }
  };

  private updateState(
    switcherState?: string | undefined,
  ): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;
    let nextState = STATE.OFFLINE;

    if (switcherState === SWITCHER_STATE.ACTIVE_FAIL) {
      nextState = STATE.ACTIVE_FAIL;
    }
    if (switcherState === SWITCHER_STATE.ACTIVE_SUCCESS) {
      nextState = STATE.ACTIVE_SUCCESS;
    }

    if (state !== nextState) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: nextState,
      });
    }
  }
}

GarlandScript.scriptName = 'GarlandScript';
