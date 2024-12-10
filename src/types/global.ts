import type { SaveState } from '../game/systems/saver';

declare global {
  interface Window {
    spawnerId?: string
    levelId?: string
    sceneId?: string
    saveState?: SaveState
    cursorX?: number
    cursorY?: number
  }
}
