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
import { LoadScene } from 'remiz/events';

import { Inventory } from '../../components';
import { INITIAL_SPAWNER_ID, PLAYER_NAME } from '../../../consts/actors';
import { GAME_ID } from '../../../consts/scenes';
import { PLAYER_ID } from '../../../consts/templates';
import { ITEM } from '../../../consts/items';
import * as EventType from '../../events';
import type { EnterRoomEvent, EnterSceneEvent } from '../../events';
import { showOverlay, hideOverlay } from '../../../utils/overlay';

const CHANGE_LEVEL_TIMEOUT = 250;

export class LevelManager extends System {
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private timeout: number;
  private nextLevelId?: string;
  private nextSceneId?: string;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.timeout = 0;
  }

  mount(): void {
    hideOverlay();

    if (this.scene.id === GAME_ID) {
      const player = this.actorSpawner.spawn(PLAYER_ID);
      // @ts-expect-error comment: player actor should hame 'Player' name instead of uuid
      player.name = PLAYER_NAME;

      this.loadPlayerPosition(player);
      this.loadItems(player);

      this.scene.appendChild(player);
    }

    if (window.levelId && !window.sceneId) {
      this.scene.dispatchEvent(EventType.LoadRoom, { levelId: window.levelId });
    }

    window.spawnerId = undefined;
    window.levelId = undefined;
    window.sceneId = undefined;

    this.scene.addEventListener(EventType.EnterRoom, this.handleEnterRoom);
    this.scene.addEventListener(EventType.EnterScene, this.handleEnterScene);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.EnterRoom, this.handleEnterRoom);
    this.scene.removeEventListener(EventType.EnterScene, this.handleEnterScene);
  }

  private handleEnterRoom = (event: EnterRoomEvent): void => {
    showOverlay();

    this.nextLevelId = event.levelId;
    this.timeout = CHANGE_LEVEL_TIMEOUT;

    window.spawnerId = event.spawnerId;
    window.levelId = event.levelId;
  };

  private handleEnterScene = (event: EnterSceneEvent): void => {
    showOverlay();

    this.nextLevelId = event.levelId;
    this.nextSceneId = event.sceneId;
    this.timeout = CHANGE_LEVEL_TIMEOUT;

    window.levelId = event.levelId;
    window.sceneId = event.sceneId;
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
      if (collected && !ITEM[itemId]?.onlyTemplate) {
        const item = this.scene.getEntityById(itemId);
        item?.remove();
      }
    });
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    if (!this.nextLevelId) {
      return;
    }

    this.timeout -= deltaTime;

    if (this.timeout > 0) {
      return;
    }

    if (!this.nextSceneId) {
      this.scene.dispatchEvent(LoadScene, {
        sceneId: GAME_ID,
        levelId: this.nextLevelId,
        loaderId: null,
        clean: true,
        unloadCurrent: true,
      });
    } else {
      this.scene.dispatchEvent(LoadScene, {
        sceneId: this.nextSceneId,
        levelId: this.nextLevelId,
        loaderId: null,
        clean: true,
        unloadCurrent: true,
      });
    }

    this.nextLevelId = undefined;
    this.nextSceneId = undefined;
  }
}

LevelManager.systemName = 'LevelManager';
