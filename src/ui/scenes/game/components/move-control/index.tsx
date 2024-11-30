import {
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import type { FC } from 'react';

import * as EventType from '../../../../../game/events';
import { EngineContext } from '../../../../providers';
import { ThumbStick } from '../../../../components';
import { PLAYER_ID } from '../../../../../consts/actors';

const THRESHOLD = 0.25;

export interface MoveControlProps {
  className: string
}

export const MoveControl: FC<MoveControlProps> = ({ className }) => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const pointerRef = useRef({ x: 0, y: 0 });

  const handleMove = useCallback((x: number, y: number): void => {
    pointerRef.current.x = x;
    pointerRef.current.y = y;
  }, []);

  useEffect(() => {
    const handleUpdate = (): void => {
      const { x, y } = pointerRef.current;
      if (!x && !y) {
        return;
      }

      if (Math.abs(x) < THRESHOLD && Math.abs(y) < THRESHOLD) {
        return;
      }

      let directionX = 0;
      let directionY = 0;

      if (Math.abs(x) > Math.abs(y)) {
        directionX = x > 0 ? 1 : -1;
      } else {
        directionY = y > 0 ? 1 : -1;
      }

      const player = scene.getEntityById(PLAYER_ID);

      player?.dispatchEvent(
        EventType.MovementDirection,
        { x: directionX, y: directionY },
      );
    };

    gameStateObserver.subscribe(handleUpdate);
    return (): void => gameStateObserver.unsubscribe(handleUpdate);
  }, []);

  return (
    <ThumbStick className={className} onMove={handleMove} sticky />
  );
};
