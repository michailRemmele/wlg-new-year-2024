import { useCallback, useContext } from 'react';
import type { FC } from 'react';
import { LoadScene } from 'remiz/events';

import * as EventType from '../../../game/events';
import { Button } from '../../components';
import { EngineContext } from '../../providers';
import { GAME_ID } from '../../../consts/scenes';
import { isMobileDevice } from '../../../utils/is-mobile-device';
import { showOverlay } from '../../../utils/overlay';

import './style.css';

const CHANGE_SCENE_TIMEOUT = 250;

export const MainMenu: FC = () => {
  const { scene } = useContext(EngineContext);

  const handleContinue = useCallback(() => {
    showOverlay();
    setTimeout(() => {
      scene.dispatchEvent(LoadScene, {
        sceneId: GAME_ID,
        clean: true,
        loaderId: null,
        levelId: window.saveState?.currentLevelId ?? null,
      });
    }, CHANGE_SCENE_TIMEOUT);
  }, [scene]);
  const handleNewGame = useCallback(() => {
    showOverlay();
    setTimeout(() => {
      scene.dispatchEvent(EventType.ResetSaveState);
      scene.dispatchEvent(LoadScene, {
        sceneId: GAME_ID,
        clean: true,
        loaderId: null,
        levelId: null,
      });
    }, CHANGE_SCENE_TIMEOUT);
  }, [scene]);

  return (
    <div className="main-menu">
      <img
        src="./images/logo.png"
        alt="WLG"
        className="main-menu__logo"
      />
      <h1 className="main-menu__title">WLG Новый Год 2025</h1>
      {!isMobileDevice() ? (
        <div className="main-menu__buttons">
          {window.saveState!.touched && <Button onClick={handleContinue}>Продолжить</Button>}
          <Button onClick={handleNewGame}>Новая игра</Button>
        </div>
      ) : (
        <p className="main-menu__warning">
          Мобильные устройства не поддерживаются. Открой меня с компьютера
        </p>
      )}
    </div>
  );
};
