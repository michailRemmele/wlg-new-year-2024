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
  SwitcherScript,
  LockerScript,
  PackageScript,
  WallLampScript,
  GarlandScript,
  BedScript,
  ComputerScript,
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
  switcherScript,
  lockerScript,
  packageScript,
  wallLampScript,
  garlandScript,
  bedScript,
  computerScript,
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
    [SwitcherScript.scriptName]: switcherScript,
    [LockerScript.scriptName]: lockerScript,
    [PackageScript.scriptName]: packageScript,
    [WallLampScript.scriptName]: wallLampScript,
    [GarlandScript.scriptName]: garlandScript,
    [BedScript.scriptName]: bedScript,
    [ComputerScript.scriptName]: computerScript,
  },
};
