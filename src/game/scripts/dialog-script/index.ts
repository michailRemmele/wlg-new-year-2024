import type {
  Actor,
  Scene,
  ScriptOptions,
  UpdateOptions,
  ActorEvent,
} from 'remiz';
import {
  Transform,
  Script,
  Camera,
  CameraService,
} from 'remiz';

import {
  CHRISTMAS_TREE_ID,
  ELECTRICAL_PANEL_ID,
  ARCADE_CABINET_ID,
  SWITCHER_ID,
} from '../../../consts/actors';
import * as EventType from '../../events';

const OFFSET_Y = 14;
const DIALOG_TIMEOUT = 5000;

const DIALOGS: Record<string, string | Record<string, string | undefined> | undefined> = {
  [CHRISTMAS_TREE_ID]: 'На елке не хватает украшений',
  [ELECTRICAL_PANEL_ID]: {
    done: 'Это мне больше не нужно',
  },
  [ARCADE_CABINET_ID]: {
    done: 'Это мне больше не нужно',
  },
  [SWITCHER_ID]: {
    uselessFail: 'Мне нечего включать',
    uselessSuccess: 'Это бессмысленно. Похоже выбило пробки',
    activeSuccess: 'Это мне больше не нужно',
  },
};

export class DialogScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private cameraService: CameraService;

  private timeout: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.cameraService = this.scene.getService(CameraService);

    this.timeout = 0;

    this.scene.addEventListener(EventType.StudyItem, this.handleStudyItem);
    this.scene.addEventListener(EventType.RejectItem, this.handleRejectItem);
    this.scene.addEventListener(EventType.RepairFail, this.handleFail);
    this.scene.addEventListener(EventType.CourierFail, this.handleFail);

    this.scene.addEventListener(EventType.EnterRoom, this.handleEnterScene);
    this.scene.addEventListener(EventType.EnterScene, this.handleEnterScene);

    this.hideDialog();
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.StudyItem, this.handleStudyItem);
    this.scene.removeEventListener(EventType.RejectItem, this.handleRejectItem);
    this.scene.removeEventListener(EventType.RepairFail, this.handleFail);
    this.scene.removeEventListener(EventType.CourierFail, this.handleFail);

    this.scene.removeEventListener(EventType.EnterRoom, this.handleEnterScene);
    this.scene.removeEventListener(EventType.EnterScene, this.handleEnterScene);
  }

  private handleStudyItem = (event: ActorEvent): void => {
    const message = DIALOGS[event.target.id];
    const state = window.saveState?.questItems[event.target.id]?.state;

    if (!message) {
      return;
    }

    if (typeof message === 'object') {
      if (!state || !message[state]) {
        return;
      }
      this.showDialog(message[state]);
    } else {
      this.showDialog(message);
    }

    this.updateDialogPosition();

    this.timeout = DIALOG_TIMEOUT;
  };

  private handleRejectItem = (): void => {
    this.showDialog('Это сюда не подходит');
    this.updateDialogPosition();

    this.timeout = DIALOG_TIMEOUT;
  };

  private handleFail = (): void => {
    this.showDialog('Зараза! Нужно попробовать еще раз');
    this.updateDialogPosition();

    this.timeout = DIALOG_TIMEOUT;
  };

  private handleEnterScene = (): void => {
    this.hideDialog();
  };

  private showDialog(value: string): void {
    const dialog = document.getElementById('dialog');
    if (!dialog) {
      return;
    }

    dialog.style.display = 'block';
    dialog.innerText = value;
  }

  private hideDialog(): void {
    const dialog = document.getElementById('dialog');
    if (!dialog) {
      return;
    }

    dialog.style.display = 'none';
    dialog.innerText = '';
  }

  private updateDialogPosition(): void {
    const transform = this.actor.getComponent(Transform);

    const cameraActor = this.cameraService.getCurrentCamera();
    const cameraTransform = cameraActor.getComponent(Transform);
    const { windowSizeX, windowSizeY, zoom } = cameraActor.getComponent(Camera);

    const x = (transform.offsetX - cameraTransform.offsetX) * zoom + (windowSizeX / 2);
    const y = (transform.offsetY - OFFSET_Y - cameraTransform.offsetY) * zoom + (windowSizeY / 2);

    const dialog = document.getElementById('dialog');
    if (!dialog) {
      return;
    }

    dialog.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    if (this.timeout === 0) {
      return;
    }

    this.timeout -= deltaTime;

    if (this.timeout > 0) {
      this.updateDialogPosition();
    } else {
      this.hideDialog();
      this.timeout = 0;
    }
  }
}

DialogScript.scriptName = 'DialogScript';
