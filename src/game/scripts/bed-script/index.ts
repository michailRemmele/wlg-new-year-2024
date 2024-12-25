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

const TIMEOUT = 1000;
export const STATE = {
  INITIAL: 'initial',
  DONE: 'done',
};

export class BedScript extends Script {
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
  }

  update(options: UpdateOptions): void {
    const state = window.saveState?.questItems[this.actor.id]?.state;

    if (state !== STATE.INITIAL) {
      return;
    }

    const { deltaTime } = options;

    this.timeout -= deltaTime;
    if (this.timeout > 0) {
      return;
    }

    this.scene.dispatchEvent(EventType.StartGame);
    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: this.actor.id,
      state: STATE.DONE,
    });
  }
}

BedScript.scriptName = 'BedScript';
