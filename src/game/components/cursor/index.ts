import { Component } from 'remiz';

import type { Action } from '../interactable';

export class Cursor extends Component {
  target: string | undefined;
  action: Action | 'move';

  constructor() {
    super();

    this.target = undefined;
    this.action = 'move';
  }

  clone(): Cursor {
    return new Cursor();
  }
}

Cursor.componentName = 'Cursor';
