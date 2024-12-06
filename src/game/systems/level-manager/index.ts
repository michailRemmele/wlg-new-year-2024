import {
  System,
  Transform,
} from 'remiz';
import type {
  Actor,
  Scene,
  ActorSpawner,
  SystemOptions,
  UpdateOptions,
} from 'remiz';
import { LoadLevel } from 'remiz/events';

import { Inventory } from '../../components';
import { INITIAL_SPAWNER_ID, PLAYER_NAME } from '../../../consts/actors';
import { PLAYER_ID } from '../../../consts/templates';
import * as EventType from '../../events';
import type { EnterRoomEvent } from '../../events';

const CHANGE_LEVEL_TIMEOUT = 250;

export class LevelManager extends System {
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private timeout: number;
  private nextLevelId?: string;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.timeout = 0;
  }

  mount(): void {
    this.hideOverlay();

    const player = this.actorSpawner.spawn(PLAYER_ID);
    // @ts-expect-error comment: player actor should hame 'Player' name instead of uuid
    player.name = PLAYER_NAME;

    this.loadPlayerPosition(player);
    this.loadItems(player);

    if (window.levelId) {
      this.scene.dispatchEvent(EventType.LoadRoom, { levelId: window.levelId });
    }

    window.spawnerId = undefined;
    window.levelId = undefined;

    this.scene.appendChild(player);

    this.scene.addEventListener(EventType.EnterRoom, this.handleEnterRoom);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.EnterRoom, this.handleEnterRoom);
  }

  private handleEnterRoom = (event: EnterRoomEvent): void => {
    this.showOverlay();

    this.nextLevelId = event.levelId;
    this.timeout = CHANGE_LEVEL_TIMEOUT;

    window.spawnerId = event.spawnerId;
    window.levelId = event.levelId;
  };

  private loadPlayerPosition(player: Actor): void {
    const transform = player.getComponent(Transform);

    if (window.spawnerId || !window.saveState?.playerPosition) {
      const spawner = this.scene.getEntityById(window.spawnerId ?? INITIAL_SPAWNER_ID)!;
      const spawnerTransform = spawner?.getComponent(Transform);

      transform.offsetX = spawnerTransform.offsetX;
      transform.offsetY = spawnerTransform.offsetY;
    } else {
      transform.offsetX = window.saveState?.playerPosition.x;
      transform.offsetY = window.saveState?.playerPosition.y;
    }
  }

  private loadItems(player: Actor): void {
    const inventory = player.getComponent(Inventory);
    Object.keys(window.saveState!.collectableItems).forEach((itemId) => {
      const { collected, activated } = window.saveState!.collectableItems[itemId];
      if (collected && !activated) {
        inventory.items.push(itemId);
      }
      if (collected) {
        const item = this.scene.getEntityById(itemId);
        item?.remove();
      }
    });
  }

  private showOverlay(): void {
    const overlay = document.getElementById('overlay');
    if (overlay && !overlay.classList.contains('overlay_black')) {
      overlay.classList.add('overlay_black');
    }
  }

  private hideOverlay(): void {
    const overlay = document.getElementById('overlay');
    if (overlay && overlay.classList.contains('overlay_black')) {
      overlay.classList.remove('overlay_black');
    }
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    if (!this.nextLevelId) {
      return;
    }

    this.timeout -= deltaTime;

    if (this.timeout <= 0) {
      this.scene.dispatchEvent(LoadLevel, {
        levelId: this.nextLevelId,
        loaderId: null,
      });

      this.nextLevelId = undefined;
    }
  }
}

LevelManager.systemName = 'LevelManager';
