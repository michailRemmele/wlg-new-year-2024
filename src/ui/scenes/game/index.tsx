import type { FC } from 'react';

import {
  MenuPanel,
} from './components';
import './style.css';

export const Game: FC = () => (
  <div className="game">
    {/* {process.env.NODE_ENV === 'development' && <FpsMeter />} */}

    <MenuPanel />
  </div>
);
