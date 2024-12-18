import { Component } from 'remiz';

export class State extends Component {
  value: string | undefined;

  constructor() {
    super();

    this.value = this.actor?.id ? window.saveState?.questItems[this.actor?.id]?.state : undefined;
  }

  clone(): State {
    return new State();
  }
}

State.componentName = 'State';
