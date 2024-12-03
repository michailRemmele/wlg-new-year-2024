import { Component } from 'remiz';

export type Action = 'take' | 'enter' | 'inspect';

interface InteractableConfig {
  action: Action
}

export class Interactable extends Component {
  action: Action;
  hover: boolean;

  constructor(config: InteractableConfig) {
    super();

    const { action } = config;

    this.action = action;
    this.hover = false;
  }

  clone(): Interactable {
    return new Interactable({
      action: this.action,
    });
  }
}

Interactable.componentName = 'Interactable';
