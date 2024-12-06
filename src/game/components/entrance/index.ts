import { Component } from 'remiz';

interface EntranceConfig {
  levelId: string
  spawnerId: string
}

export class Entrance extends Component {
  levelId: string;
  spawnerId: string;

  constructor(config: EntranceConfig) {
    super();

    const { levelId, spawnerId } = config;

    this.levelId = levelId;
    this.spawnerId = spawnerId;
  }

  clone(): Entrance {
    return new Entrance({
      levelId: this.levelId,
      spawnerId: this.spawnerId,
    });
  }
}

Entrance.componentName = 'Entrance';
