import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import * as EventType from '../../../../../game/events';
import type { RepairScoreUpdateEvent } from '../../../../../game/events';
import { EngineContext } from '../../../../providers';
import { PASSING_SCORE } from '../../../../../consts/electrical-panel';

import './style.css';

export const ScoreBar: FC = () => {
  const { scene } = useContext(EngineContext);

  const [isRepairEnd, setIsRepairEnd] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleRepairEnd = (): void => {
      setIsRepairEnd(true);
    };

    const handleScoreUpdate = (event: RepairScoreUpdateEvent): void => {
      setScore(Math.round(event.score * 100));
    };

    scene.addEventListener(EventType.RepairEnd, handleRepairEnd);
    scene.addEventListener(EventType.RepairScoreUpdate, handleScoreUpdate);
    return (): void => {
      scene.removeEventListener(EventType.RepairEnd, handleRepairEnd);
      scene.removeEventListener(EventType.RepairScoreUpdate, handleScoreUpdate);
    };
  }, []);

  return (
    <div className="score-bar">
      {isRepairEnd && (
        <div className="score-bar__score">
          {`Оценка: ${score}%`}
        </div>
      )}
      <div className="score-bar__passing-score">
        {`Проходной балл: ${PASSING_SCORE * 100}%`}
      </div>
    </div>
  );
};
