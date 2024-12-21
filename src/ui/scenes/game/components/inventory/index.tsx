import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

import * as EventType from '../../../../../game/events';
import { Inventory as InventoryComponent } from '../../../../../game/components';
import { ITEM } from '../../../../../consts/items';
import { PLAYER_NAME } from '../../../../../consts/actors';
import { EngineContext } from '../../../../providers';
import { useMedia } from '../../../../hooks';
import type { MediaChecks } from '../../../../hooks';

import './style.css';

const getInventorySize = (mediaChecks: MediaChecks): number => {
  if (mediaChecks.isDesktopL) {
    return 6;
  }
  if (mediaChecks.isDesktopM) {
    return 5;
  }
  if (mediaChecks.isDesktopS) {
    return 3;
  }
  if (mediaChecks.isTablet) {
    return 2;
  }
  return 1;
};

export const Inventory: FC = () => {
  const { scene } = useContext(EngineContext);

  const [items, setItems] = useState<string[]>([]);
  const [itemsStartIndex, setItemsStartIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | undefined>();

  const mediaChecks = useMedia();

  useEffect(() => {
    const player = scene.getEntityByName(PLAYER_NAME);

    if (!player) {
      return (): void => {};
    }

    const inventory = player.getComponent(InventoryComponent);
    setItems([...inventory.items]);

    const handleUpdateItems = (): void => {
      setItems([...inventory.items]);
    };

    const handleCancelItemSelection = (): void => {
      setSelectedItem(undefined);
    };

    scene.addEventListener(EventType.TakeItem, handleUpdateItems);
    scene.addEventListener(EventType.GiveItem, handleUpdateItems);
    scene.addEventListener(EventType.RemoveItem, handleUpdateItems);
    scene.addEventListener(EventType.CancelItemSelection, handleCancelItemSelection);

    return (): void => {
      scene.removeEventListener(EventType.TakeItem, handleUpdateItems);
      scene.removeEventListener(EventType.GiveItem, handleUpdateItems);
      scene.removeEventListener(EventType.RemoveItem, handleUpdateItems);
      scene.removeEventListener(EventType.CancelItemSelection, handleCancelItemSelection);
    };
  }, []);

  const handleSelectItem = (id: string): void => {
    if (selectedItem === id) {
      return;
    }

    setSelectedItem(id);

    scene.dispatchEvent(EventType.SelectItem, { item: id });
  };

  const inventoryItems: JSX.Element[] = [];
  const inventorySize = getInventorySize(mediaChecks);
  for (let i = 0; i < inventorySize; i += 1) {
    const itemId = items.at((i + itemsStartIndex) % Math.max(items.length, inventorySize));
    inventoryItems.push(
      (
        <li className="inventory__item" key={itemId ?? i}>
          {itemId ? (
            <button
              className={`item ${itemId === selectedItem ? 'item_selected' : ''}`}
              type="button"
              onClick={() => handleSelectItem(itemId)}
            >
              <img
                className="item-image"
                src={ITEM[itemId].imageUrl}
                alt={ITEM[itemId].title}
                title={ITEM[itemId].title}
              />
            </button>
          ) : (<span />)}
        </li>
      ),
    );
  }

  return (
    <div className="inventory">
      <div className="inventory__controls">
        <button
          className="inventory__control"
          type="button"
          onClick={() => setItemsStartIndex((prev) => prev + 1)}
          disabled={items.length <= inventorySize}
        >
          ⬆
        </button>
        <button
          className="inventory__control inventory__control_down"
          type="button"
          onClick={() => setItemsStartIndex((prev) => prev - 1)}
          disabled={items.length <= inventorySize}
        >
          ⬇
        </button>
      </div>
      <ul className="inventory__list">
        {inventoryItems}
      </ul>
    </div>
  );
};
