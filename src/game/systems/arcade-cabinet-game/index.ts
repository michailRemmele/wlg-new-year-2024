import {
  Scene,
  System,
  Vector2,
  RigidBody,
  Transform,
  Sprite,
} from 'remiz';
import type {
  Actor,
  ActorSpawner,
  SystemOptions,
  UpdateOptions,
} from 'remiz';
import { CollisionEnter, AddImpulse } from 'remiz/events';
import type {
  CollisionEnterEvent,
} from 'remiz/events';

import * as EventType from '../../events';
import {
  COURIER_NAME,
  ARCADE_CABINET_ID,
  FINISH_ID,
  PRE_FINISH_ID,
  HEALTH_BAR_PLACEMENT_ID,
  DISTANCE_MARKER_ID,
  DISTANCE_BAR_ID,
} from '../../../consts/actors';
import { HEALTH } from '../../../consts/templates';
import { Trap, CourierHealth } from '../../components';

const EXIT_TIMEOUT = 1000;

const JUMP_IMPULSE = -125;
const MOVEMENT_SPEED = 100;
const DISTANCE_BAR_LENGTH = 90;

interface ArcadeCabinetGameOptions extends SystemOptions {
  exitLevelId: string
}

export class ArcadeCabinetGame extends System {
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private exitLevelId: string;

  private courier: Actor;
  private healthBarPlacement: Actor;
  private distanceMarker: Actor;
  private distanceBar: Actor;

  private speed: number;

  private markerStart: number;
  private courierStart: number;

  private isPlaying: boolean;
  private isExited: boolean;
  private isFailed: boolean;
  private isFinished: boolean;
  private isJumping: boolean;
  private isFinishing: boolean;

  private exitTimeout: number;

  constructor(options: ArcadeCabinetGameOptions) {
    super();

    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.exitLevelId = options.exitLevelId;

    const courier = this.scene.getEntityByName(COURIER_NAME);
    const healthBarPlacement = this.scene.getEntityById(HEALTH_BAR_PLACEMENT_ID);
    const distanceMarker = this.scene.getEntityById(DISTANCE_MARKER_ID);
    const distanceBar = this.scene.getEntityById(DISTANCE_BAR_ID);

    if (!courier || !healthBarPlacement || !distanceMarker || !distanceBar) {
      throw Error('Cannot find some required actors');
    }

    const markerTransform = distanceMarker.getComponent(Transform);
    const courierTransform = courier.getComponent(Transform);

    this.markerStart = markerTransform.relativeOffsetX;
    this.courierStart = courierTransform.offsetX;

    this.courier = courier;
    this.healthBarPlacement = healthBarPlacement;
    this.distanceMarker = distanceMarker;
    this.distanceBar = distanceBar;

    this.speed = MOVEMENT_SPEED;

    this.isPlaying = false;
    this.isExited = false;
    this.isFailed = false;
    this.isFinished = false;
    this.isJumping = false;
    this.isFinishing = false;

    this.exitTimeout = EXIT_TIMEOUT;
  }

  mount(): void {
    this.scene.addEventListener(EventType.CourierStart, this.handleStart);
    this.scene.addEventListener(EventType.CourierJump, this.handleCourierJump);

    this.courier.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.CourierStart, this.handleStart);
    this.scene.removeEventListener(EventType.CourierJump, this.handleCourierJump);

    this.courier.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleStart = (): void => {
    this.isPlaying = true;

    this.updateHealthBar();
  };

  private handleCourierJump = (): void => {
    if (!this.isPlaying || this.isFailed || this.isFinished || this.isFinishing) {
      return;
    }

    if (this.isJumping) {
      return;
    }

    this.courier.dispatchEvent(AddImpulse, {
      value: new Vector2(0, JUMP_IMPULSE),
    });
    this.isJumping = true;
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    if (!this.isPlaying) {
      return;
    }

    const { actor, mtv } = event;

    if (actor.id === PRE_FINISH_ID) {
      this.speed /= 2;
      this.isFinishing = true;
      return;
    }
    if (actor.id === FINISH_ID) {
      this.isFinished = true;
      return;
    }

    if (mtv.x === 0 && mtv.y < 0 && actor.getComponent(RigidBody)) {
      this.isJumping = false;
    }

    const trap = actor.getComponent(Trap);

    if (!trap) {
      return;
    }

    const health = this.courier.getComponent(CourierHealth);
    health.points -= 1;

    this.courier.dispatchEvent(EventType.CourierDamage, { value: 1 });

    if (health.points === 0) {
      this.isFailed = true;
    }
  };

  private updateHealthBar(): void {
    const health = this.courier.getComponent(CourierHealth);

    if (health.points === this.healthBarPlacement.children.length) {
      return;
    }

    while (this.healthBarPlacement.children.length !== 0) {
      this.healthBarPlacement.children[0].remove();
    }

    for (let i = 0; i < health.points; i += 1) {
      const point = this.actorSpawner.spawn(HEALTH);

      const transform = point.getComponent(Transform);
      const sprite = point.getComponent(Sprite);
      transform.offsetX = sprite.width * i;

      this.healthBarPlacement.appendChild(point);
    }
  }

  private updateDistanceMarker(): void {
    const finish = this.scene.getEntityById(FINISH_ID);
    if (!finish) {
      return;
    }

    const distanceMarkerSprite = this.distanceMarker.getComponent(Sprite);
    const distanceBarSprite = this.distanceBar.getComponent(Sprite);

    distanceMarkerSprite.material.options.opacity = 1;
    distanceBarSprite.material.options.opacity = 1;

    const courierTransform = this.courier.getComponent(Transform);
    const finishTransform = finish.getComponent(Transform);
    const markerTransform = this.distanceMarker.getComponent(Transform);

    const currentX = courierTransform.offsetX - this.courierStart;
    const distance = finishTransform.offsetX - this.courierStart;
    const offset = (currentX / distance) * DISTANCE_BAR_LENGTH;
    markerTransform.relativeOffsetX = Math.floor(this.markerStart + offset);
  }

  private updateExit(deltaTime: number): void {
    if (!this.isFailed && !this.isFinished) {
      return;
    }

    this.exitTimeout -= deltaTime;
    if (this.exitTimeout > 0) {
      return;
    }

    this.scene.dispatchEvent(EventType.EnterRoom, {
      levelId: this.exitLevelId,
      spawnerId: '',
    });
    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: ARCADE_CABINET_ID,
      state: this.isFinished ? 'success' : 'fail',
    });

    this.isExited = true;
  }

  private updateMovement(deltaTime: number): void {
    if (this.isFailed || this.isFinished) {
      return;
    }

    const deltaTimeInSeconds = deltaTime / 1000;

    const movementDelta = Math.round(this.speed * deltaTimeInSeconds);

    const transform = this.courier.getComponent(Transform);
    transform.offsetX += movementDelta;
  }

  update(options: UpdateOptions): void {
    if (!this.isPlaying || this.isExited) {
      return;
    }

    const { deltaTime } = options;

    this.updateHealthBar();
    this.updateDistanceMarker();
    this.updateExit(deltaTime);
  }

  fixedUpdate(options: UpdateOptions): void {
    if (!this.isPlaying || this.isExited) {
      return;
    }

    const { deltaTime } = options;

    this.updateMovement(deltaTime);
  }
}

ArcadeCabinetGame.systemName = 'ArcadeCabinetGame';
