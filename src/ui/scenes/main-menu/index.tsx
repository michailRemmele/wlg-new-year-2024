import { useCallback, useContext } from 'react';
import type { FC } from 'react';
import { LoadScene } from 'remiz/events';

import * as EventType from '../../../game/events';
import { Button } from '../../components';
import { EngineContext } from '../../providers';
import { GAME_ID } from '../../../consts/scenes';

import './style.css';

export const MainMenu: FC = () => {
  const { scene } = useContext(EngineContext);

  const handleContinue = useCallback(() => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      clean: true,
      loaderId: null,
      levelId: window.saveState?.currentLevelId ?? null,
    });
  }, [scene]);
  const handleNewGame = useCallback(() => {
    scene.dispatchEvent(EventType.ResetSaveState);
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  }, [scene]);

  return (
    <div className="main-menu">
      <h1>WLG Новый Год 2024</h1>
      <div className="main-menu__buttons">
        {window.saveState!.touched && <Button onClick={handleContinue}>Продолжить</Button>}
        <Button onClick={handleNewGame}>Новая игра</Button>
      </div>
    </div>
  );
};
