import { ScriptSystem } from 'remiz';

import {
  CameraScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
  },
};
