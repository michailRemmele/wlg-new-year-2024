import { Component } from 'remiz';

export class State extends Component {
  private _value: string | undefined;

  get value(): string | undefined {
    if (this._value !== undefined) {
      return this._value;
    }
    return this.actor?.id ? window.saveState?.questItems[this.actor?.id]?.state : undefined;
  }

  set value(newValue: string | undefined) {
    this._value = newValue;
  }

  clone(): State {
    return new State();
  }
}

State.componentName = 'State';
