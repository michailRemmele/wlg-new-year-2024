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

import { CHRISTMAS_TREE_ID } from '../../../consts/actors';
import * as EventType from '../../events';

const OFFSET_Y = 10;
const DIALOG_TIMEOUT = 2000;

const DIALOGS: Record<string, string | undefined> = {
  [CHRISTMAS_TREE_ID]: 'На елке не хватает украшений',
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
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.StudyItem, this.handleStudyItem);
    this.scene.removeEventListener(EventType.RejectItem, this.handleRejectItem);
  }

  private handleStudyItem = (event: ActorEvent): void => {
    const message = DIALOGS[event.target.id];
    if (!message) {
      return;
    }

    this.showDialog(message);
    this.updateDialogPosition();

    this.timeout = DIALOG_TIMEOUT;
  };

  private handleRejectItem = (): void => {
    this.showDialog('Это сюда не подходит');
    this.updateDialogPosition();

    this.timeout = DIALOG_TIMEOUT;
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
