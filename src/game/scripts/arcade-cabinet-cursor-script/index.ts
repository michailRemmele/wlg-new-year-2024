import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import { Script, Transform } from 'remiz';
import {
  CollisionEnter,
  CollisionStay,
  CollisionLeave,
} from 'remiz/events';
import type {
  CollisionEnterEvent,
  CollisionLeaveEvent,
} from 'remiz/events';

import { Interactable, Cursor, Entrance } from '../../components';
import * as EventType from '../../events';
import type {
  CursorMoveEvent,
} from '../../events';

export class ArcadeCabinetCursorScript extends Script {
  private actor: Actor;
  private scene: Scene;

  private isPlaying: boolean;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.isPlaying = false;

    this.actor.addEventListener(EventType.CursorMove, this.handleCursorMove);
    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnterOrStay);
    this.actor.addEventListener(CollisionStay, this.handleCollisionEnterOrStay);
    this.actor.addEventListener(CollisionLeave, this.handleCollisionLeave);
    this.actor.addEventListener(EventType.CursorClick, this.handleCursorClick);
    this.actor.addEventListener(EventType.CursorDown, this.handleCursorDown);

    this.scene.addEventListener(EventType.CourierPlay, this.handleCourierPlay);

    const transform = this.actor.getComponent(Transform);
    transform.offsetX = 0;
    transform.offsetY = 0;
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.CursorMove, this.handleCursorMove);
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnterOrStay);
    this.actor.removeEventListener(CollisionStay, this.handleCollisionEnterOrStay);
    this.actor.removeEventListener(CollisionLeave, this.handleCollisionLeave);
    this.actor.removeEventListener(EventType.CursorClick, this.handleCursorClick);
    this.actor.removeEventListener(EventType.CursorDown, this.handleCursorDown);

    this.scene.removeEventListener(EventType.CourierPlay, this.handleCourierPlay);
  }

  private handleCursorMove = (event: CursorMoveEvent): void => {
    const { x, y } = event;

    const transform = this.actor.getComponent(Transform);

    transform.offsetX = x;
    transform.offsetY = y;
  };

  private handleCollisionEnterOrStay = (event: CollisionEnterEvent): void => {
    if (this.isPlaying) {
      return;
    }

    const { actor } = event;

    const interactable = actor.getComponent(Interactable);
    if (!interactable) {
      return;
    }

    const cursor = this.actor.getComponent(Cursor);

    cursor.action = interactable.action;

    interactable.hover = true;
    cursor.target = actor.id;
  };

  private handleCollisionLeave = (event: CollisionLeaveEvent): void => {
    if (this.isPlaying) {
      return;
    }

    const { actor } = event;

    const interactable = actor.getComponent(Interactable);
    if (!interactable) {
      return;
    }

    const cursor = this.actor.getComponent(Cursor);

    interactable.hover = false;
    cursor.target = undefined;
    cursor.action = 'move';
  };

  private handleCursorClick = (): void => {
    const cursor = this.actor.getComponent(Cursor);
    const { target, action } = cursor;

    if (!target || this.isPlaying) {
      return;
    }

    const targetActor = this.scene.getEntityById(target);
    if (!targetActor) {
      return;
    }

    if (action === 'enter') {
      const entrance = targetActor.getComponent(Entrance);
      this.scene.dispatchEvent(EventType.EnterRoom, {
        levelId: entrance.levelId,
        spawnerId: '',
      });
    }
  };

  private handleCursorDown = (): void => {
    const cursor = this.actor.getComponent(Cursor);
    const { action } = cursor;

    if (action === 'move') {
      this.scene.dispatchEvent(EventType.CourierJump);
    }
  };

  private handleCourierPlay = (): void => {
    this.isPlaying = true;
  };
}

ArcadeCabinetCursorScript.scriptName = 'ArcadeCabinetCursorScript';
