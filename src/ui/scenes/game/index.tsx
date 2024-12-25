import type { FC } from 'react';
import {
  useEffect,
  useContext,
  useState,
  useCallback,
} from 'react';
import { LoadScene } from 'remiz/events';

import { MAIN_MENU_ID } from '../../../consts/scenes';
import { Button } from '../../components';
import { EngineContext } from '../../providers';
import * as EventType from '../../../game/events';

import {
  MenuPanel,
} from './components';
import './style.css';

export const Game: FC = () => {
  const { scene } = useContext(EngineContext);

  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const handleGameOver = (): void => {
      setIsGameOver(true);
    };

    scene.addEventListener(EventType.GameOver, handleGameOver);

    return (): void => {
      scene.removeEventListener(EventType.GameOver, handleGameOver);
    };
  }, []);

  const handleMenuClick = useCallback(() => {
    scene.dispatchEvent(EventType.ResetSaveState);
    scene.dispatchEvent(LoadScene, {
      sceneId: MAIN_MENU_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  }, [scene]);

  return (
    <div className="game">
      {!isGameOver ? (
        <MenuPanel />
      ) : (
        <div className="game__game-over-overlay">
          <img
            src="./images/logo-final.png"
            alt="WLG"
            className="game__logo"
          />
          <span className="game__game-over-title">
            {new Date().getFullYear() === 2024 ? 'С наступающим 2025 годом!' : 'С новым 2025 годом!'}
          </span>
          <Button onClick={handleMenuClick}>В меню</Button>
        </div>
      )}
    </div>
  );
};
