import {
  Scene,
  System,
} from 'remiz';
import type { SystemOptions } from 'remiz';

import { Cursor } from '../../components';
import { CURSOR_NAME } from '../../../consts/actors';

import { ImageLoader } from './image-loader';

const CURSOR_SOURCE_SIZE = 32;
const CURSOR_SIZE = 32;
const CURSOR_STATE: Record<string, number> = {
  move: 0,
  enter: 1,
  pick: 2,
  take: 3,
  inspect: 4,
  apply: 5,
};

interface CursorPainterOptions extends SystemOptions {
  windowNodeId: string
  src: string
}

export class CursorPainter extends System {
  private scene: Scene;

  private windowNode: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  private imageLoader: ImageLoader;

  private cursorSrc: string;
  private cursorImage?: CanvasImageSource;
  private cursorX?: number;
  private cursorY?: number;

  constructor(options: SystemOptions) {
    super();

    const {
      scene,
      windowNodeId,
      src,
    } = options as CursorPainterOptions;

    this.scene = scene;

    const windowNode = document.getElementById(windowNodeId);

    if (!windowNode) {
      throw new Error('Unable to load CursorPainter. Root canvas node not found');
    }
    if (!(windowNode instanceof HTMLCanvasElement)) {
      throw new Error('Unable to load CursorPainter. Root canvas node should be an instance of HTMLCanvasElement');
    }

    this.windowNode = windowNode;

    this.context = this.windowNode.getContext('2d') as CanvasRenderingContext2D;
    this.canvasWidth = this.windowNode.clientWidth;
    this.canvasHeight = this.windowNode.clientHeight;

    this.imageLoader = new ImageLoader();

    this.cursorSrc = src;
    this.cursorX = window.cursorX;
    this.cursorY = window.cursorY;
  }

  async load(): Promise<void> {
    const image = await this.imageLoader.load(this.cursorSrc);

    this.cursorImage = image as CanvasImageSource;
  }

  mount(): void {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  private handleWindowResize = (): void => {
    const ratio = window.devicePixelRatio ?? 1;

    this.canvasWidth = Math.floor(window.innerWidth * ratio);
    this.canvasHeight = Math.floor(window.innerHeight * ratio);

    this.windowNode.width = this.canvasWidth;
    this.windowNode.height = this.canvasHeight;

    this.windowNode.style.width = `${this.canvasWidth / ratio}px`;
    this.windowNode.style.height = `${this.canvasHeight / ratio}px`;
  };

  private handleMouseMove = (event: MouseEvent): void => {
    if (this.cursorX === undefined || this.cursorY === undefined) {
      if (!document.body.classList.contains('cursor-hidden')) {
        document.body.classList.add('cursor-hidden');
      }
    }

    this.cursorX = event.clientX;
    this.cursorY = event.clientY;

    window.cursorX = this.cursorX;
    window.cursorY = this.cursorY;
  };

  update(): void {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (!this.cursorImage) {
      return;
    }
    if (this.cursorX === undefined || this.cursorY === undefined) {
      return;
    }

    let state = 'move';

    const cursorActor = this.scene.getEntityByName(CURSOR_NAME);

    if (cursorActor) {
      const cursor = cursorActor.getComponent(Cursor);
      state = cursor.action;
    }

    const ratio = window.devicePixelRatio ?? 1;

    this.context.imageSmoothingEnabled = false;
    this.context.drawImage(
      this.cursorImage,
      CURSOR_SOURCE_SIZE * CURSOR_STATE[state],
      0,
      CURSOR_SOURCE_SIZE,
      CURSOR_SOURCE_SIZE,
      Math.floor(this.cursorX * ratio),
      Math.floor(this.cursorY * ratio),
      CURSOR_SIZE * Math.floor(ratio),
      CURSOR_SIZE * Math.floor(ratio),
    );
  }
}

CursorPainter.systemName = 'CursorPainter';
