import {
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import type { FC } from 'react';

import * as EventType from '../../../game/events';
import { Button } from '../../components';
import { EngineContext } from '../../providers';

import './style.css';

type State = 'menu' | 'game' | 'count';

export const ArcadeCabinetGame: FC = () => {
  const { scene } = useContext(EngineContext);

  const [state, setState] = useState<State>('menu');
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (state !== 'count') {
      return (): void => {};
    }

    if (count > 0) {
      const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
      return (): void => clearTimeout(timer);
    }

    setState('game');
    scene.dispatchEvent(EventType.CourierStart);
    return (): void => {};
  }, [state, count]);

  const handlePlay = useCallback(() => {
    setState('count');
    scene.dispatchEvent(EventType.CourierPlay);
  }, [scene]);

  return (
    <div className="arcade-cabinet-game">
      {state === 'menu' && (
        <div className="arcade-cabinet-game__menu">
          <Button className="arcade-cabinet-game__button" onClick={handlePlay}>Играть</Button>
        </div>
      )}
      {state === 'count' && (
        <div className="arcade-cabinet-game__menu">
          <span className="arcade-cabinet-game__count">{count}</span>
        </div>
      )}
      {state === 'game' && (
        <div className="arcade-cabinet-game__header" />
      )}
    </div>
  );
};
