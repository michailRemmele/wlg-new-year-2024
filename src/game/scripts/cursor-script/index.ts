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

import { Interactable, Cursor } from '../../components';
import * as EventType from '../../events';
import type {
  CursorClickEvent,
  CursorMoveEvent,
  SelectItemEvent,
} from '../../events';
import { PLAYER_NAME } from '../../../consts/actors';

export class CursorScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.actor.addEventListener(EventType.CursorMove, this.handleCursorMove);
    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnterOrStay);
    this.actor.addEventListener(CollisionStay, this.handleCollisionEnterOrStay);
    this.actor.addEventListener(CollisionLeave, this.handleCollisionLeave);
    this.actor.addEventListener(EventType.CursorClick, this.handleCursorClick);

    this.scene.addEventListener(EventType.SelectItem, this.handleSelectItem);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.CursorMove, this.handleCursorMove);
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnterOrStay);
    this.actor.removeEventListener(CollisionStay, this.handleCollisionEnterOrStay);
    this.actor.removeEventListener(CollisionLeave, this.handleCollisionLeave);
    this.actor.removeEventListener(EventType.CursorClick, this.handleCursorClick);

    this.scene.removeEventListener(EventType.SelectItem, this.handleSelectItem);
  }

  private handleCursorMove = (event: CursorMoveEvent): void => {
    const { x, y } = event;

    const transform = this.actor.getComponent(Transform);

    transform.offsetX = x;
    transform.offsetY = y;
  };

  private handleCollisionEnterOrStay = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const interactable = actor.getComponent(Interactable);
    if (!interactable || interactable.disabled) {
      return;
    }

    const cursor = this.actor.getComponent(Cursor);

    if (cursor.selectedItem) {
      if (interactable.action === 'inspect') {
        cursor.action = 'apply';
      } else {
        return;
      }
    } else {
      cursor.action = interactable.action;
    }

    interactable.hover = true;
    cursor.target = actor.id;
  };

  private handleCollisionLeave = (event: CollisionLeaveEvent): void => {
    const { actor } = event;

    const interactable = actor.getComponent(Interactable);
    if (!interactable || interactable.disabled) {
      return;
    }

    const cursor = this.actor.getComponent(Cursor);

    interactable.hover = false;
    cursor.target = undefined;
    cursor.action = 'move';
  };

  private handleCursorClick = (event: CursorClickEvent): void => {
    const cursor = this.actor.getComponent(Cursor);
    const { selectedItem, target, action } = cursor;

    if (selectedItem) {
      this.scene.dispatchEvent(EventType.CancelItemSelection);
      cursor.selectedItem = undefined;
    }

    if (!selectedItem || (selectedItem && action === 'apply')) {
      const player = this.scene.getEntityByName(PLAYER_NAME);
      player?.dispatchEvent(EventType.ClickAction, { x: event.x, y: event.y });
    }

    if (!target) {
      return;
    }

    this.scene.dispatchEvent(EventType.Interact, {
      actionTarget: target,
      selectedItem: selectedItem && action === 'apply' ? selectedItem : undefined,
    });
  };

  private handleSelectItem = (event: SelectItemEvent): void => {
    const cursor = this.actor.getComponent(Cursor);
    cursor.selectedItem = event.item;
  };
}

CursorScript.scriptName = 'CursorScript';
