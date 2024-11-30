import type {
  Actor,
  ScriptOptions,
} from 'remiz';
import { Script, Transform } from 'remiz';
import { CollisionEnter, CollisionStay } from 'remiz/events';
import type {
  CollisionEnterEvent,
} from 'remiz/events';

import { WALL_PATH_BLOCK_ID } from '../../../consts/templates';
import * as EventType from '../../events';
import type { ClickActionEvent } from '../../events';

const DESTINATION_THRESHOLD = 2;

export class PointAndClickScript extends Script {
  private actor: Actor;
  private destination: number | undefined;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;

    this.destination = undefined;

    this.actor.addEventListener(EventType.ClickAction, this.handleClickAction);
    this.actor.addEventListener(CollisionEnter, this.handleWallCollision);
    this.actor.addEventListener(CollisionStay, this.handleWallCollision);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.ClickAction, this.handleClickAction);
    this.actor.removeEventListener(CollisionStay, this.handleWallCollision);
  }

  private handleClickAction = (event: ClickActionEvent): void => {
    const { x } = event;

    this.destination = x;
  };

  private handleWallCollision = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    if (actor.templateId === WALL_PATH_BLOCK_ID) {
      this.destination = undefined;
    }
  };

  update(): void {
    if (!this.destination) {
      return;
    }

    const { offsetX } = this.actor.getComponent(Transform);

    if (Math.abs(this.destination - offsetX) < DESTINATION_THRESHOLD) {
      this.destination = undefined;
      return;
    }

    this.actor.dispatchEvent(EventType.Move, { direction: offsetX < this.destination ? 1 : -1 });
  }
}

PointAndClickScript.scriptName = 'PointAndClickScript';
