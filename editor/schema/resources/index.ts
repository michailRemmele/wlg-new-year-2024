import { ScriptSystem } from 'remiz';

import {
  CameraScript,
  PointAndClickScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  pointAndClickScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
    [PointAndClickScript.scriptName]: pointAndClickScript,
  },
};
