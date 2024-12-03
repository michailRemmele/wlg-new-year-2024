import {
  Scene,
  System,
} from 'remiz';
import type {
  SystemOptions,
} from 'remiz';

import * as EventType from '../../events';
import type { SelectItemEvent, TakeItemEvent } from '../../events';
import { ITEM } from '../../../consts/items';

export class Journal extends System {
  private scene: Scene;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectItem, this.handleSelectItem);
    this.scene.addEventListener(EventType.TakeItem, this.handleTakeItem);
    this.scene.addEventListener(EventType.RemoveItem, this.handleRemoveItem);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectItem, this.handleSelectItem);
    this.scene.removeEventListener(EventType.TakeItem, this.handleTakeItem);
    this.scene.removeEventListener(EventType.RemoveItem, this.handleRemoveItem);
  }

  private handleSelectItem = (event: SelectItemEvent): void => {
    this.scene.dispatchEvent(EventType.UpdateJournal, {
      id: crypto.randomUUID(),
      title: `Вы выбрали: ${ITEM[event.item].title}`,
    });
  };

  private handleTakeItem = (event: TakeItemEvent): void => {
    this.scene.dispatchEvent(EventType.UpdateJournal, {
      id: crypto.randomUUID(),
      title: `Вы подобрали: ${ITEM[event.item].title}`,
    });
  };

  private handleRemoveItem = (event: TakeItemEvent): void => {
    this.scene.dispatchEvent(EventType.UpdateJournal, {
      id: crypto.randomUUID(),
      title: `Вы использовали: ${ITEM[event.item].title}`,
    });
  };
}

Journal.systemName = 'Journal';