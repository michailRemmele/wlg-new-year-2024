import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import * as EventType from '../../../../../game/events';
import type { RepairTimerUpdateEvent } from '../../../../../game/events';
import { EngineContext } from '../../../../providers';

import './style.css';

export const TimerBar: FC = () => {
  const { scene } = useContext(EngineContext);

  const [points, setPoints] = useState(100);
  const [maxPoints, setMaxPoints] = useState(100);

  useEffect(() => {
    const handleTimerUpdate = (event: RepairTimerUpdateEvent): void => {
      const timer = Math.floor(event.timer);

      setPoints(timer);
      setMaxPoints((prev) => Math.max(prev, timer));
    };

    scene.addEventListener(EventType.RepairTimerUpdate, handleTimerUpdate);
    return (): void => scene.removeEventListener(EventType.RepairTimerUpdate, handleTimerUpdate);
  }, []);

  return (
    <div className="timer-bar">
      <div
        className="timer-bar__points"
        style={{ width: `${maxPoints ? ((points / maxPoints) * 100) : 0}%` }}
      />
    </div>
  );
};
