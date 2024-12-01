import {
  Scene,
  ActorCollection,
  Transform,
  System,
} from 'remiz';
import type {
  SystemOptions,
  UpdateOptions,
} from 'remiz';

import {
  Movement,
} from '../../components';
import * as EventType from '../../events';
import type { MoveEvent } from '../../events';

export class MovementSystem extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        Transform,
        Movement,
      ],
    });
  }

  mount(): void {
    this.scene.addEventListener(EventType.Move, this.handleMove);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.Move, this.handleMove);
  }

  private handleMove = (event: MoveEvent): void => {
    const movement = event.target.getComponent(Movement);
    if (!movement) {
      return;
    }

    movement.direction = event.direction;
    movement.isMoving = true;
  };

  fixedUpdate(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorCollection.forEach((actor) => {
      const movement = actor.getComponent(Movement);

      if (!movement.isMoving) {
        return;
      }

      const movementDelta = movement.direction * movement.speed * deltaTimeInSeconds;

      const transform = actor.getComponent(Transform);
      transform.offsetX += movementDelta;
    });
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      const movement = actor.getComponent(Movement);

      if (!movement.isMoving) {
        movement.direction = 0;
        return;
      }

      movement.viewDirection = movement.direction;
      movement.isMoving = false;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
