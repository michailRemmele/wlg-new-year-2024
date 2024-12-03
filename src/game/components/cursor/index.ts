import { Component } from 'remiz';

import type { Action } from '../interactable';

export class Cursor extends Component {
  target: string | undefined;
  action: Action | 'move' | 'apply';
  selectedItem: string | undefined;

  constructor() {
    super();

    this.target = undefined;
    this.action = 'move';
    this.selectedItem = undefined;
  }

  clone(): Cursor {
    return new Cursor();
  }
}

Cursor.componentName = 'Cursor';
