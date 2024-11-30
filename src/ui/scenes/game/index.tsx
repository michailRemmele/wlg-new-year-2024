import type { FC } from 'react';
import { isTouchDevice } from '../../../utils/is-touch-device';

import {
  MoveControl,
} from './components';
import './style.css';

export const Game: FC = () => (
  <div className="game">
    <header className="game__header">
      <div className="header__left" />
    </header>
    {/* {process.env.NODE_ENV === 'development' && <FpsMeter />} */}

    {isTouchDevice() && (
      <MoveControl className="game__move-control" />
    )}
  </div>
);
