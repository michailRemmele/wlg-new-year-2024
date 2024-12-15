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
  ArcadeCabinetCameraScript,
  ArcadeCabinetCursorScript,
  ArcadeCabinetScript,
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
  arcadeCabinetCameraScript,
  arcadeCabinetCursorScript,
  arcadeCabinetScript,
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
    [ArcadeCabinetCameraScript.scriptName]: arcadeCabinetCameraScript,
    [ArcadeCabinetCursorScript.scriptName]: arcadeCabinetCursorScript,
    [ArcadeCabinetScript.scriptName]: arcadeCabinetScript,
  },
};
