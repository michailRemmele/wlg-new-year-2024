import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import { Script, Camera, Transform } from 'remiz';

import { COURIER_NAME } from '../../../consts/actors';

const VIEWPORT_SIZE_Y = 144;

export class ArcadeCabinetCameraScript extends Script {
  private actor: Actor;
  private scene: Scene;

  private initialOffset: number;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    const transform = this.actor.getComponent(Transform);
    const courier = this.scene.getEntityByName(COURIER_NAME);
    if (!courier) {
      throw Error('Cannot find a courier');
    }

    const courierTransform = courier.getComponent(Transform);

    this.initialOffset = courierTransform.offsetX - transform.offsetX;

    const root = document.getElementById('root');
    root?.classList.add('fullscreen');

    window.dispatchEvent(new Event('resize'));
  }

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = camera.windowSizeY / VIEWPORT_SIZE_Y;
  }

  private updatePosition(): void {
    const transform = this.actor.getComponent(Transform);
    const courier = this.scene.getEntityByName(COURIER_NAME);
    if (!courier) {
      return;
    }

    const courierTransform = courier.getComponent(Transform);
    transform.offsetX = Math.round(courierTransform.offsetX - this.initialOffset);
  }

  update(): void {
    this.updateZoom();
    this.updatePosition();
  }
}

ArcadeCabinetCameraScript.scriptName = 'ArcadeCabinetCameraScript';
