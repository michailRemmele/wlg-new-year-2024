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
  PACKAGE_1_ID,
  PACKAGE_2_ID,
} from '../../../consts/templates';
import * as EventType from '../../events';

const OFFSET_Y = 14;
const DIALOG_TIMEOUT = 2000;
const DIALOG_DELAY = 1500;

const DIALOGS: Record<string, string | Record<string, string | undefined> | undefined> = {
  [CHRISTMAS_TREE_ID]: {
    inProgress: 'На елке не хватает украшений',
    done: 'Вроде бы все украшения повесил',
  },
  [ELECTRICAL_PANEL_ID]: {
    disabled: 'Сейчас мне это не нужно',
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
  [PACKAGE_1_ID]: {
    closed: 'Чем бы его открыть...',
  },
  [PACKAGE_2_ID]: {
    closed: 'Чем бы его открыть...',
  },
};

export class DialogScript extends Script {
  private actor: Actor;
  private scene: Scene;
  private cameraService: CameraService;

  private delay: number;
  private delayDialog: string | undefined;
  private timeout: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;
    this.cameraService = this.scene.getService(CameraService);

    this.timeout = 0;
    this.delay = 0;

    this.scene.addEventListener(EventType.StudyItem, this.handleStudyItem);
    this.scene.addEventListener(EventType.RejectItem, this.handleRejectItem);
    this.scene.addEventListener(EventType.RepairFail, this.handleFail);
    this.scene.addEventListener(EventType.CourierFail, this.handleFail);
    this.scene.addEventListener(EventType.ShortCircuit, this.handleShortCircuit);
    this.scene.addEventListener(EventType.StartGame, this.handleStartGame);
    this.scene.addEventListener(EventType.NeedChristmasTree, this.handleNeedChristmasTree);
    this.scene.addEventListener(EventType.NeedGarland, this.handleNeedGarland);
    this.scene.addEventListener(EventType.NeedFood, this.handleNeedFood);

    this.scene.addEventListener(EventType.EnterRoom, this.handleEnterScene);
    this.scene.addEventListener(EventType.EnterScene, this.handleEnterScene);

    this.hideDialog();
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.StudyItem, this.handleStudyItem);
    this.scene.removeEventListener(EventType.RejectItem, this.handleRejectItem);
    this.scene.removeEventListener(EventType.RepairFail, this.handleFail);
    this.scene.removeEventListener(EventType.CourierFail, this.handleFail);
    this.scene.removeEventListener(EventType.ShortCircuit, this.handleShortCircuit);
    this.scene.removeEventListener(EventType.StartGame, this.handleStartGame);
    this.scene.removeEventListener(EventType.NeedChristmasTree, this.handleNeedChristmasTree);
    this.scene.removeEventListener(EventType.NeedGarland, this.handleNeedGarland);
    this.scene.removeEventListener(EventType.NeedFood, this.handleNeedFood);

    this.scene.removeEventListener(EventType.EnterRoom, this.handleEnterScene);
    this.scene.removeEventListener(EventType.EnterScene, this.handleEnterScene);
  }

  private handleStudyItem = (event: ActorEvent): void => {
    if (!event.target.templateId) {
      return;
    }

    const message = DIALOGS[event.target.templateId];
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
  };

  private handleRejectItem = (): void => {
    this.showDialog('Это сюда не подходит');
  };

  private handleFail = (): void => {
    this.showDialog('Зараза! Нужно попробовать еще раз');
  };

  private handleShortCircuit = (): void => {
    this.showDialogWithDelay('Черт! Похоже выбило пробки');
  };

  private handleStartGame = (): void => {
    this.showDialog(
      'До стрима всего несколько минут, а я не подготовился к трансляции!',
      3000,
    );
  };

  private handleNeedChristmasTree = (): void => {
    this.showDialog('Сначала нужно нарядить елку');
  };

  private handleNeedGarland = (): void => {
    this.showDialog('Без гирлянды стрим запускать нельзя');
  };

  private handleNeedFood = (): void => {
    this.showDialog('Не хочу запускать стрим голодным');
  };

  private handleEnterScene = (): void => {
    this.hideDialog();
  };

  private showDialogWithDelay(value: string): void {
    this.delayDialog = value;
    this.delay = DIALOG_DELAY;
  }

  private showDialog(value: string, timeout = DIALOG_TIMEOUT): void {
    const dialog = document.getElementById('dialog');
    if (!dialog) {
      return;
    }

    dialog.style.display = 'block';
    dialog.innerText = value;

    this.updateDialogPosition();
    this.timeout = timeout;
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

  private updateDelayDialog(deltaTime: number): void {
    if (this.delay === 0 || !this.delayDialog) {
      return;
    }

    this.delay -= deltaTime;

    if (this.delay <= 0) {
      this.showDialog(this.delayDialog);

      this.delay = 0;
      this.delayDialog = undefined;
    }
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.updateDelayDialog(deltaTime);

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
