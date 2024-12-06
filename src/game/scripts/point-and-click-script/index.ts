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

import {
  Interactable,
  Inventory,
  Entrance,
} from '../../components';
import { WALL_PATH_BLOCK_ID } from '../../../consts/templates';
import * as EventType from '../../events';
import type {
  ClickActionEvent,
  InteractEvent,
  MoveEvent,
} from '../../events';

const DESTINATION_THRESHOLD = 2;

export class PointAndClickScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private destination: number | undefined;
  private destinationTarget: string | undefined;
  private selectedItem: string | undefined;

  private wallPositionX: number | undefined;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.destination = undefined;
    this.destinationTarget = undefined;
    this.selectedItem = undefined;

    this.wallPositionX = undefined;

    this.actor.addEventListener(EventType.ClickAction, this.handleClickAction);
    this.actor.addEventListener(CollisionEnter, this.handleWallCollision);
    this.actor.addEventListener(CollisionLeave, this.handleWallLeave);
    this.actor.addEventListener(EventType.Move, this.handleMove);

    this.scene.addEventListener(EventType.Interact, this.handleInteract);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.ClickAction, this.handleClickAction);
    this.actor.removeEventListener(CollisionEnter, this.handleWallCollision);
    this.actor.removeEventListener(CollisionLeave, this.handleWallLeave);
    this.actor.removeEventListener(EventType.Move, this.handleMove);

    this.scene.removeEventListener(EventType.Interact, this.handleInteract);
  }

  private handleClickAction = (event: ClickActionEvent): void => {
    this.destination = event.x;
  };

  private handleWallCollision = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    if (actor.templateId === WALL_PATH_BLOCK_ID) {
      const transform = actor.getComponent(Transform);
      this.wallPositionX = transform.offsetX;
    }
  };

  private handleWallLeave = (event: CollisionLeaveEvent): void => {
    const { actor } = event;

    if (actor.templateId === WALL_PATH_BLOCK_ID) {
      this.wallPositionX = undefined;
    }
  };

  private handleMove = (event: MoveEvent): void => {
    if (!event.point) {
      this.destination = undefined;
      this.destinationTarget = undefined;
    }
  };

  private handleInteract = (event: InteractEvent): void => {
    this.destinationTarget = event.actionTarget;
    this.selectedItem = event.selectedItem;
  };

  private isDesinationReached(): boolean {
    if (this.destination === undefined) {
      return true;
    }

    const { offsetX } = this.actor.getComponent(Transform);

    if (this.wallPositionX !== undefined) {
      if (offsetX < this.wallPositionX && this.destination > offsetX) {
        return true;
      }
      if (offsetX > this.wallPositionX && this.destination < offsetX) {
        return true;
      }
    }

    return Math.abs(this.destination - offsetX) < DESTINATION_THRESHOLD;
  }

  private interact(): void {
    if (!this.destinationTarget) {
      return;
    }

    const target = this.scene.getEntityById(this.destinationTarget);
    if (!target) {
      return;
    }

    const interactable = target.getComponent(Interactable);

    if (interactable.action === 'take') {
      const inventory = this.actor.getComponent(Inventory);
      inventory.items.push(target.id);

      this.scene.dispatchEvent(EventType.TakeItem, { item: target.id });

      target.remove();
    }
    if (interactable.action === 'inspect' && this.selectedItem) {
      target.dispatchEvent(EventType.ApplyItem, { item: this.selectedItem });
    }
    if (interactable.action === 'enter') {
      const entrance = target.getComponent(Entrance);
      this.scene.dispatchEvent(EventType.EnterRoom, {
        levelId: entrance.levelId,
        spawnerId: entrance.spawnerId,
      });
    }
  }

  update(): void {
    if (!this.destination) {
      return;
    }

    const { offsetX } = this.actor.getComponent(Transform);

    if (this.isDesinationReached()) {
      if (this.destinationTarget) {
        this.interact();
      }

      this.destination = undefined;
      this.destinationTarget = undefined;
      this.selectedItem = undefined;
      return;
    }

    this.actor.dispatchEvent(EventType.Move, {
      direction: offsetX < this.destination ? 1 : -1,
      point: true,
    });
  }
}

PointAndClickScript.scriptName = 'PointAndClickScript';
