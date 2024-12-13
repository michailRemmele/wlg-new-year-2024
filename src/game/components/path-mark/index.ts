import { Component } from 'remiz';

export class PathMark extends Component {
  passed: boolean;

  constructor() {
    super();

    this.passed = false;
  }

  clone(): PathMark {
    return new PathMark();
  }
}

PathMark.componentName = 'PathMark';
