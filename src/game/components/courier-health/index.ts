import { Component } from 'remiz';

interface CourierHealthConfig {
  points: number
}

export class CourierHealth extends Component {
  points: number;
  maxPoints: number;

  constructor(config: CourierHealthConfig) {
    super();

    const { points } = config;

    this.points = points;
    this.maxPoints = points;
  }

  clone(): CourierHealth {
    return new CourierHealth({ points: this.points });
  }
}

CourierHealth.componentName = 'CourierHealth';
