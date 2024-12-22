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
import type { ChangeItemStateEvent } from '../../events';
import {
  ELECTRICAL_PANEL_ID,
} from '../../../consts/actors';
import { STATE as ELECTRICAL_PANEL_STATE } from '../electrical-panel-script';

const STATE = {
  ONLINE: 'online',
  EMERGENCY: 'emergency',
  OFFLINE: 'offline',
};

const CHANGE_STATE_TIMEOUT = 1000;

export class WallLampScript extends Script {
  private actor: Actor;
  private scene: Scene;

  private nextState: string | undefined;
  private timeout: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.timeout = 0;

    const panelState = window.saveState?.questItems[ELECTRICAL_PANEL_ID]?.state;

    this.updateState(panelState);

    this.scene.addEventListener(EventType.ChangeItemState, this.handleChangeItemState);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.ChangeItemState, this.handleChangeItemState);
  }

  private handleChangeItemState = (event: ChangeItemStateEvent): void => {
    const { state, item } = event;

    if (item === ELECTRICAL_PANEL_ID) {
      this.updateState(state, true);
    }
  };

  private updateState(
    panelState?: string | undefined,
    withTimeout?: boolean,
  ): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;
    let nextState: string | undefined;
    let timeoutState: string | undefined;

    if (!state) {
      nextState = STATE.ONLINE;
    }
    if (panelState === ELECTRICAL_PANEL_STATE.DONE) {
      nextState = STATE.ONLINE;
    }
    if (panelState === ELECTRICAL_PANEL_STATE.ENABLED) {
      nextState = STATE.OFFLINE;
      timeoutState = STATE.EMERGENCY;
    }

    if (nextState) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: nextState,
      });
    }
    if (timeoutState && !withTimeout) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: timeoutState,
      });
    }
    if (withTimeout && timeoutState) {
      this.nextState = timeoutState;
      this.timeout = CHANGE_STATE_TIMEOUT;
    }
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    if (!this.nextState) {
      return;
    }

    this.timeout -= deltaTime;
    if (this.timeout > 0) {
      return;
    }

    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: this.actor.id,
      state: this.nextState,
    });

    this.nextState = undefined;
  }
}

WallLampScript.scriptName = 'WallLampScript';
