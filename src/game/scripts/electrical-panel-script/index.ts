import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import { ELECTRICAL_PANEL_LEVEL_ID } from '../../../consts/levels';
import { ELECTRICAL_PANEL_GAME_ID } from '../../../consts/scenes';
import * as EventType from '../../events';

export class ElectricalPanelScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.actor.addEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.StudyItem, this.handleStudyItem);
  }

  private handleStudyItem = (): void => {
    this.scene.dispatchEvent(EventType.EnterScene, {
      levelId: ELECTRICAL_PANEL_LEVEL_ID,
      sceneId: ELECTRICAL_PANEL_GAME_ID,
    });
  };
}

ElectricalPanelScript.scriptName = 'ElectricalPanelScript';
