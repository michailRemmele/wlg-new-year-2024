import { useCallback, useContext } from 'react';
import type { FC } from 'react';
import { LoadScene } from 'remiz/events';

import { Button } from '../../components';
import { EngineContext } from '../../providers';
import { GAME_ID } from '../../../consts/scenes';

import './style.css';

export const MainMenu: FC = () => {
  const { scene } = useContext(EngineContext);

  const handlePlay = useCallback(() => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  }, [scene]);

  return (
    <div className="main-menu">
      <h1>WLG New Year 2024</h1>
      <Button onClick={handlePlay}>Play</Button>
    </div>
  );
};
