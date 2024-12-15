import { useContext, useEffect } from 'react';
import type { FC } from 'react';

import {
  MAIN_MENU_ID,
  GAME_ID,
  ELECTRICAL_PANEL_GAME_ID,
  ARCADE_CABINET_GAME_ID,
} from '../consts/scenes';
import { createLongPressFixHandler } from '../utils/long-press-fix';

import { EngineContext } from './providers';
import {
  MainMenu,
  Game,
  ElectricalPanelGame,
  ArcadeCabinetGame,
} from './scenes';

export const App: FC = () => {
  const { scene } = useContext(EngineContext);

  // To fix an issue when after a double click longpress leads to a context menu opening on iOS
  useEffect(() => {
    const handleTouchstart = createLongPressFixHandler();

    document.body.addEventListener('touchstart', handleTouchstart, { passive: false });
    return (): void => document.body.removeEventListener('touchstart', handleTouchstart);
  });

  return (
    <>
      {scene.id === MAIN_MENU_ID && <MainMenu />}
      {scene.id === GAME_ID && <Game />}
      {scene.id === ELECTRICAL_PANEL_GAME_ID && <ElectricalPanelGame />}
      {scene.id === ARCADE_CABINET_GAME_ID && <ArcadeCabinetGame />}
    </>
  );
};
