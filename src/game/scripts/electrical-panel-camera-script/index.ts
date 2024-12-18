import type {
  Actor,
  ScriptOptions,
} from 'remiz';
import { Script, Camera } from 'remiz';

const VIEWPORT_SIZE_Y = 144;

export class EletricalPanelCameraScript extends Script {
  private actor: Actor;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;

    const root = document.getElementById('root');
    root?.classList.add('fullscreen');

    window.dispatchEvent(new Event('resize'));
  }

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = camera.windowSizeY / VIEWPORT_SIZE_Y;
  }

  update(): void {
    this.updateZoom();
  }
}

EletricalPanelCameraScript.scriptName = 'EletricalPanelCameraScript';
