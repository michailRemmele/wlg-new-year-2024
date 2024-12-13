import type { FC } from 'react';

import {
  TimerBar,
  ScoreBar,
} from './components';
import './style.css';

export const ElectricalPanelGame: FC = () => (
  <div className="electrical-panel-game">
    <div className="electrical-panel-game__footer">
      <ScoreBar />
      <TimerBar />
    </div>
  </div>
);
