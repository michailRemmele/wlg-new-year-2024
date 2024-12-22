import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import {
  Script,
  Sprite,
} from 'remiz';

import { Interactable } from '../../components';
import * as EventType from '../../events';

const STATE = {
  OPEN: 'open',
  CLOSED: 'closed',
};

interface LockerScriptOptions extends ScriptOptions {
  items: string[]
}

export class LockerScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private items: string[];

  constructor(options: LockerScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.items = options.items;

    this.actor.addEventListener(EventType.StudyItem, this.handleStudyItem);

    const state = window.saveState?.questItems[this.actor.id]?.state;

    if (state === undefined) {
      this.scene.dispatchEvent(EventType.ChangeItemState, {
        item: this.actor.id,
        state: STATE.CLOSED,
      });
    }

    if (state === STATE.OPEN) {
      this.showItems();
    } else {
      this.hideItems();
    }
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  private handleStudyItem = (): void => {
    const state = window.saveState?.questItems[this.actor.id]?.state;

    if (state === STATE.OPEN) {
      return;
    }

    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: this.actor.id,
      state: STATE.OPEN,
    });

    this.showItems();
  };

  private hideItems(): void {
    this.items.forEach((id) => {
      const itemActor = this.scene.getEntityById(id);
      if (!itemActor) {
        return;
      }

      const sprite = itemActor.getComponent(Sprite);
      sprite.disabled = true;

      const interactable = itemActor.getComponent(Interactable);
      interactable.disabled = true;
    });
  }

  private showItems(): void {
    this.items.forEach((id) => {
      const itemActor = this.scene.getEntityById(id);
      if (!itemActor) {
        return;
      }

      const sprite = itemActor.getComponent(Sprite);
      sprite.disabled = false;

      const interactable = itemActor.getComponent(Interactable);
      interactable.disabled = false;
    });

    const interactable = this.actor.getComponent(Interactable);
    interactable.disabled = true;
  }
}

LockerScript.scriptName = 'LockerScript';
