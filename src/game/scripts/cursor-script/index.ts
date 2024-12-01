import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import { Script, Transform } from 'remiz';
import { CollisionEnter, CollisionLeave } from 'remiz/events';
import type {
  CollisionEnterEvent,
  CollisionLeaveEvent,
} from 'remiz/events';

import { Interactable, Cursor } from '../../components';
import * as EventType from '../../events';
import type {
  CursorMoveEvent,
} from '../../events';

export class CursorScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.actor.addEventListener(EventType.CursorMove, this.handleCursorMove);
    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnter);
    this.actor.addEventListener(CollisionLeave, this.handleCollisionLeave);
    this.actor.addEventListener(EventType.CursorClick, this.handleCursorClick);

    const transform = this.actor.getComponent(Transform);
    transform.offsetX = 0;
    transform.offsetY = 0;
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.CursorMove, this.handleCursorMove);
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnter);
    this.actor.removeEventListener(CollisionLeave, this.handleCollisionLeave);
    this.actor.removeEventListener(EventType.CursorClick, this.handleCursorClick);
  }

  private handleCursorMove = (event: CursorMoveEvent): void => {
    const { x, y } = event;

    const transform = this.actor.getComponent(Transform);

    transform.offsetX = x;
    transform.offsetY = y;
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const interactable = actor.getComponent(Interactable);

    if (!interactable) {
      return;
    }

    interactable.hover = true;

    const cursor = this.actor.getComponent(Cursor);
    cursor.target = actor.id;
    cursor.action = interactable.action;
  };

  private handleCollisionLeave = (event: CollisionLeaveEvent): void => {
    const { actor } = event;

    const interactable = actor.getComponent(Interactable);

    if (!interactable) {
      return;
    }

    interactable.hover = false;

    const cursor = this.actor.getComponent(Cursor);
    cursor.target = undefined;
    cursor.action = 'move';
  };

  private handleCursorClick = (): void => {
    const cursor = this.actor.getComponent(Cursor);

    if (!cursor.target) {
      return;
    }

    this.scene.dispatchEvent(EventType.Interact, { actionTarget: cursor.target });
  };
}

CursorScript.scriptName = 'CursorScript';
