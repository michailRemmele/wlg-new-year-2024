import { Component } from 'remiz';

interface TrapConfig {
  damage: number
}

export class Trap extends Component {
  damage: number;

  constructor(config: TrapConfig) {
    super();

    const { damage } = config;

    this.damage = damage;
  }

  clone(): Trap {
    return new Trap({ damage: this.damage });
  }
}

Trap.componentName = 'Trap';
