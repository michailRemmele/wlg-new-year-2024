import { ScriptSystem } from 'remiz';

import {
  CameraScript,
  PointAndClickScript,
  CursorScript,
  ChristmasTreeScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  pointAndClickScript,
  cursorScript,
  christmasTreeScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
    [PointAndClickScript.scriptName]: pointAndClickScript,
    [CursorScript.scriptName]: cursorScript,
    [ChristmasTreeScript.scriptName]: christmasTreeScript,
  },
};
