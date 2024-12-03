import type {
  Actor,
  ActorSpawner,
  Scene,
  ScriptOptions,
} from 'remiz';
import { Script, Transform } from 'remiz';

import {
  EXAMPLE_ITEM_1_ID,
  EXAMPLE_ITEM_2_ID,
  DECORATION_PLACE_1_ID,
  DECORATION_PLACE_2_ID,
  PLAYER_NAME,
} from '../../../consts/actors';
import { ITEM } from '../../../consts/items';
import * as EventType from '../../events';
import type { ApplyItemEvent } from '../../events';
import { Interactable, Inventory } from '../../components';

const DECORATIONS_MAP: Record<string, string> = {
  [EXAMPLE_ITEM_1_ID]: DECORATION_PLACE_1_ID,
  [EXAMPLE_ITEM_2_ID]: DECORATION_PLACE_2_ID,
};

export class ChristmasTreeScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.actorSpawner = options.actorSpawner;

    this.actor.addEventListener(EventType.ApplyItem, this.handleApplyItem);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.ApplyItem, this.handleApplyItem);
  }

  private handleApplyItem = (event: ApplyItemEvent): void => {
    const { item } = event;

    if (!DECORATIONS_MAP[item]) {
      return;
    }

    const place = this.actor.getEntityById(DECORATIONS_MAP[item]);
    if (!place) {
      return;
    }

    const placeTransform = place.getComponent(Transform);

    const decoration = this.actorSpawner.spawn(ITEM[item].templateId);
    const transform = decoration.getComponent(Transform);

    transform.relativeOffsetX = placeTransform.relativeOffsetX;
    transform.relativeOffsetY = placeTransform.relativeOffsetY;

    decoration.removeComponent(Interactable);

    this.actor.appendChild(decoration);

    place.remove();

    const player = this.scene.getEntityByName(PLAYER_NAME)!;
    const inventory = player.getComponent(Inventory);

    inventory.items.splice(inventory.items.findIndex((id) => id === item), 1);
    this.scene.dispatchEvent(EventType.RemoveItem, { item });
  };
}

ChristmasTreeScript.scriptName = 'ChristmasTreeScript';