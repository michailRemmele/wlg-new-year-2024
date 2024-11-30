import type {
  Actor,
  ScriptOptions,
} from 'remiz';
import { Script, Camera } from 'remiz';

const VIEWPORT_SIZE = 120;

export class CameraScript extends Script {
  private actor: Actor;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
  }

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = camera.windowSizeY / VIEWPORT_SIZE;
  }

  update(): void {
    this.updateZoom();
  }
}

CameraScript.scriptName = 'CameraScript';
