import { Component } from 'dacha';

export class Inventory extends Component {
  items: string[];

  constructor() {
    super();

    this.items = [];
  }

  clone(): Inventory {
    return new Inventory();
  }
}

Inventory.componentName = 'Inventory';
