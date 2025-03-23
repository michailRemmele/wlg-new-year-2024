import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'dacha';
import { Script } from 'dacha';
import { PlayAudio } from 'dacha/events';

import * as EventType from '../../events';

interface AudioManagerScriptOptions extends ScriptOptions {
  buttonPress: string
  enterRoom: string
  takeItem: string
  selectItem: string
  switchOn: string
  lockerOpen: string
  shortCircuit: string
}

export class AudioManagerScript extends Script {
  private scene: Scene;

  private buttonPress: Actor;
  private enterRoom: Actor;
  private takeItem: Actor;
  private selectItem: Actor;
  private switchOn: Actor;
  private lockerOpen: Actor;
  private shortCircuit: Actor;

  constructor(options: AudioManagerScriptOptions) {
    super();

    this.scene = options.scene;

    this.buttonPress = this.scene.getEntityById(options.buttonPress)!;
    this.enterRoom = this.scene.getEntityById(options.enterRoom)!;
    this.takeItem = this.scene.getEntityById(options.takeItem)!;
    this.selectItem = this.scene.getEntityById(options.selectItem)!;
    this.switchOn = this.scene.getEntityById(options.switchOn)!;
    this.lockerOpen = this.scene.getEntityById(options.lockerOpen)!;
    this.shortCircuit = this.scene.getEntityById(options.shortCircuit)!;

    this.scene.addEventListener(EventType.ButtonPress, this.handleButtonPress);
    this.scene.addEventListener(EventType.EnterRoom, this.handleEnterRoom);
    this.scene.addEventListener(EventType.TakeItem, this.handleTakeItem);
    this.scene.addEventListener(EventType.SelectItem, this.handleSelectItem);
    this.scene.addEventListener(EventType.SwitchOn, this.handleSwitchOn);
    this.scene.addEventListener(EventType.LockerOpen, this.handleLockerOpen);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.ButtonPress, this.handleButtonPress);
    this.scene.removeEventListener(EventType.EnterRoom, this.handleEnterRoom);
    this.scene.removeEventListener(EventType.TakeItem, this.handleTakeItem);
    this.scene.removeEventListener(EventType.SelectItem, this.handleSelectItem);
    this.scene.removeEventListener(EventType.SwitchOn, this.handleSwitchOn);
    this.scene.removeEventListener(EventType.LockerOpen, this.handleLockerOpen);
  }

  private handleButtonPress = (): void => {
    this.buttonPress.dispatchEvent(PlayAudio);
  };

  private handleEnterRoom = (): void => {
    this.enterRoom.dispatchEvent(PlayAudio);
  };

  private handleTakeItem = (): void => {
    this.takeItem.dispatchEvent(PlayAudio);
  };

  private handleSelectItem = (): void => {
    this.selectItem.dispatchEvent(PlayAudio);
  };

  private handleSwitchOn = (): void => {
    this.switchOn.dispatchEvent(PlayAudio);
    this.shortCircuit.dispatchEvent(PlayAudio);
  };

  private handleLockerOpen = (): void => {
    this.lockerOpen.dispatchEvent(PlayAudio);
  };
}

AudioManagerScript.scriptName = 'AudioManagerScript';
