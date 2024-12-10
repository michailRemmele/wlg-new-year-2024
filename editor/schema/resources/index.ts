import { ScriptSystem } from 'remiz';

import {
  CameraScript,
  PointAndClickScript,
  CursorScript,
  ChristmasTreeScript,
  DialogScript,
  ElectricalPanelScript,
  EletricalPanelCameraScript,
  ElectricalPanelCursorScript,
} from '../../../src/game/scripts';

import {
  cameraScript,
  pointAndClickScript,
  cursorScript,
  christmasTreeScript,
  dialogScript,
  electricalPanelScript,
  electricalPanelCameraScript,
  electricalPanelCursorScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [CameraScript.scriptName]: cameraScript,
    [PointAndClickScript.scriptName]: pointAndClickScript,
    [CursorScript.scriptName]: cursorScript,
    [ChristmasTreeScript.scriptName]: christmasTreeScript,
    [DialogScript.scriptName]: dialogScript,
    [ElectricalPanelScript.scriptName]: electricalPanelScript,
    [EletricalPanelCameraScript.scriptName]: electricalPanelCameraScript,
    [ElectricalPanelCursorScript.scriptName]: electricalPanelCursorScript,
  },
};
