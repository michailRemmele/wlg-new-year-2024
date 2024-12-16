import type {
  Actor,
  ScriptOptions,
} from 'remiz';
import { Script, Camera } from 'remiz';

const VIEWPORT_SIZE_X = 288;
const VIEWPORT_SIZE_Y = 120;

export class CameraScript extends Script {
  private actor: Actor;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;

    const root = document.getElementById('root');
    root?.classList.remove('fullscreen');

    window.dispatchEvent(new Event('resize'));
  }

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = Math.min(
      camera.windowSizeX / VIEWPORT_SIZE_X,
      camera.windowSizeY / VIEWPORT_SIZE_Y,
    );
  }

  update(): void {
    this.updateZoom();
  }
}

CameraScript.scriptName = 'CameraScript';
