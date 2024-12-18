import {
  Scene,
  System,
  ActorCollection,
} from 'remiz';
import type {
  Actor,
  SystemOptions,
  UpdateOptions,
} from 'remiz';
import {
  CollisionEnter,
} from 'remiz/events';
import type {
  CollisionEnterEvent,
} from 'remiz/events';

import * as EventType from '../../events';
import type {
  RepairStartEvent,
  CursorMoveEvent,
} from '../../events';
import {
  CURSOR_NAME,
  ELECTRICAL_PANEL_ID,
} from '../../../consts/actors';
import { PASSING_SCORE } from '../../../consts/electrical-panel';
import { PathMark, State } from '../../components';

const TIMER = 5000;
const INITIAL_TIMEOUT = 2000;
const FREQUENCY = 25;
const SCALE_VALUE = (window.devicePixelRatio ?? 1) / 10;
const EXIT_TIMEOUT = 1000;

interface ElectricalPanelGameOptions extends SystemOptions {
  windowNodeId: string
  exitLevelId: string
}

export class ElectricalPanelGame extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;

  private windowNode: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  private exitLevelId: string;

  private cursor: Actor;

  private passedMarks: Set<string>;
  private isRepairStarted: boolean;
  private isRepairFinished: boolean;
  private isScoreShown: boolean;
  private isExited: boolean;

  private marksQueue: Array<string>;
  private challengeTimer: number;
  private resultTimeout: number;
  private score: number;

  private exitTimeout: number;

  constructor(options: ElectricalPanelGameOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(this.scene, {
      components: [PathMark],
    });

    const windowNode = document.getElementById(options.windowNodeId);

    if (!windowNode) {
      throw new Error('Unable to load ElectricalPanelGame. Root canvas node not found');
    }
    if (!(windowNode instanceof HTMLCanvasElement)) {
      throw new Error('Unable to load ElectricalPanelGame. Root canvas node should be an instance of HTMLCanvasElement');
    }

    this.windowNode = windowNode;

    this.context = this.windowNode.getContext('2d') as CanvasRenderingContext2D;
    this.canvasWidth = this.windowNode.clientWidth;
    this.canvasHeight = this.windowNode.clientHeight;

    this.exitLevelId = options.exitLevelId;

    const cursor = this.scene.getEntityByName(CURSOR_NAME);

    if (!cursor) {
      throw Error('Cannot find a cursor');
    }

    this.cursor = cursor;

    this.passedMarks = new Set<string>();
    this.isRepairStarted = false;
    this.isRepairFinished = false;
    this.isScoreShown = false;
    this.isExited = false;

    this.marksQueue = [];
    this.resultTimeout = INITIAL_TIMEOUT;
    this.challengeTimer = TIMER;
    this.score = 0;

    this.exitTimeout = EXIT_TIMEOUT;
  }

  mount(): void {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);

    this.scene.addEventListener(EventType.RepairStart, this.handleRepairStart);
    this.scene.addEventListener(EventType.RepairEnd, this.handleRepairEnd);
    this.scene.addEventListener(EventType.CursorMove, this.handleCursorMove);

    this.cursor.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  unmount(): void {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    window.removeEventListener('resize', this.handleWindowResize);

    this.scene.removeEventListener(EventType.RepairStart, this.handleRepairStart);
    this.scene.removeEventListener(EventType.RepairEnd, this.handleRepairEnd);
    this.scene.removeEventListener(EventType.CursorMove, this.handleCursorMove);

    this.cursor.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleWindowResize = (): void => {
    this.canvasWidth = Math.floor(this.windowNode.clientWidth * SCALE_VALUE);
    this.canvasHeight = Math.floor(this.windowNode.clientHeight * SCALE_VALUE);

    this.windowNode.width = this.canvasWidth;
    this.windowNode.height = this.canvasHeight;

    this.windowNode.style.width = `${this.canvasWidth / SCALE_VALUE}px`;
    this.windowNode.style.height = `${this.canvasHeight / SCALE_VALUE}px`;
  };

  private handleRepairStart = (event: RepairStartEvent): void => {
    if (this.isRepairFinished) {
      return;
    }

    const cursorState = this.cursor.getComponent(State);
    cursorState.value = 'repairStarted';

    this.isRepairStarted = true;

    this.context.strokeStyle = '#f9f265';
    this.context.lineWidth = 3;
    this.context.lineCap = 'round';

    this.context.beginPath();
    this.context.moveTo(
      Math.floor(event.screenX * SCALE_VALUE),
      Math.floor(event.screenY * SCALE_VALUE),
    );
  };

  private handleRepairEnd = (): void => {
    if (this.isRepairFinished) {
      return;
    }

    this.endRepair();
  };

  private handleCursorMove = (event: CursorMoveEvent): void => {
    if (!this.isRepairStarted || this.isRepairFinished) {
      return;
    }

    this.context.lineTo(
      Math.floor(event.screenX * SCALE_VALUE),
      Math.floor(event.screenY * SCALE_VALUE),
    );
    this.context.stroke();
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    if (!this.isRepairStarted || this.isRepairFinished) {
      return;
    }

    const { actor } = event;
    const pathMark = actor.getComponent(PathMark);

    if (!pathMark || this.passedMarks.has(actor.id)) {
      return;
    }

    this.passedMarks.add(actor.id);
  };

  private endRepair(): void {
    const cursorState = this.cursor.getComponent(State);
    cursorState.value = 'repairFinished';

    this.isRepairFinished = true;

    this.marksQueue = Array.from(this.passedMarks);
  }

  private updateChallenge(deltaTime: number): void {
    if (!this.isRepairStarted || this.isRepairFinished) {
      return;
    }

    this.challengeTimer -= deltaTime;

    this.scene.dispatchEvent(EventType.RepairTimerUpdate, {
      timer: Math.max(this.challengeTimer, 0),
    });

    if (this.challengeTimer <= 0) {
      this.endRepair();
    }
  }

  private updateResult(deltaTime: number): void {
    if (!this.isRepairStarted || !this.isRepairFinished) {
      return;
    }

    this.resultTimeout -= deltaTime;
    if (this.resultTimeout > 0) {
      return;
    }

    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (!this.marksQueue.length) {
      this.isScoreShown = true;
      return;
    }

    const markId = this.marksQueue.shift()!;
    const mark = this.actorCollection.getById(markId);

    if (!mark) {
      return;
    }

    const pathMark = mark.getComponent(PathMark);
    pathMark.passed = true;

    this.score += 1;

    this.scene.dispatchEvent(EventType.RepairScoreUpdate, {
      score: this.score / this.actorCollection.size,
    });

    this.resultTimeout = FREQUENCY;
  }

  private updateExit(deltaTime: number): void {
    if (!this.isScoreShown) {
      return;
    }

    this.exitTimeout -= deltaTime;
    if (this.exitTimeout > 0) {
      return;
    }

    this.scene.dispatchEvent(EventType.EnterRoom, {
      levelId: this.exitLevelId,
      spawnerId: '',
    });
    this.scene.dispatchEvent(EventType.ChangeItemState, {
      item: ELECTRICAL_PANEL_ID,
      state: this.score / this.actorCollection.size >= PASSING_SCORE ? 'success' : 'fail',
    });

    this.isExited = true;
  }

  update(options: UpdateOptions): void {
    if (this.isExited) {
      return;
    }

    const { deltaTime } = options;

    this.updateChallenge(deltaTime);
    this.updateResult(deltaTime);
    this.updateExit(deltaTime);
  }
}

ElectricalPanelGame.systemName = 'ElectricalPanelGame';
