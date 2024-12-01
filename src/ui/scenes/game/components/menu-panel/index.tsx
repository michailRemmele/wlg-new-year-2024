import type { FC } from 'react';
import { useContext, useEffect, useState } from 'react';

import * as EventType from '../../../../../game/events';
import { Inventory } from '../../../../../game/components';
import { ITEM } from '../../../../../consts/items';
import { EngineContext } from '../../../../providers';

import './style.css';

const PLAYER_NAME = 'Player';

export interface MenuPanelProps {
  className?: string
}

export const MenuPanel: FC<MenuPanelProps> = ({ className = '' }) => {
  const { scene } = useContext(EngineContext);

  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const player = scene.getEntityByName(PLAYER_NAME);

    if (!player) {
      return (): void => {};
    }

    const inventory = player.getComponent(Inventory);
    setItems([...inventory.items]);

    const handleTakeItem = (): void => {
      setItems([...inventory.items]);
    };

    player.addEventListener(EventType.TakeItem, handleTakeItem);

    return (): void => {
      player.removeEventListener(EventType.TakeItem, handleTakeItem);
    };
  }, []);

  return (
    <div className={`menu-panel ${className}`}>
      <div className="inventory">
        <ul className="inventory__list">
          {items.map((id) => (
            <li className="inventory__item" key={id}>
              <img
                className="inventory__item-image"
                src={ITEM[id].imageUrl}
                alt={ITEM[id].title}
                title={ITEM[id].title}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
