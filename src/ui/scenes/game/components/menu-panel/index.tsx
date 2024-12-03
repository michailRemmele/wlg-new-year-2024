import type { FC } from 'react';

import { Inventory } from '../inventory';
import { Journal } from '../journal';

import './style.css';

export interface MenuPanelProps {
  className?: string
}

export const MenuPanel: FC<MenuPanelProps> = ({ className = '' }) => (
  <div className={`menu-panel ${className}`}>
    <Journal />
    <Inventory />
  </div>
);
