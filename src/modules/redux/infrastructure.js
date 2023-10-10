import { SelectorBuilder } from './SelectorBuilder/infrastructure';
import { SliceTools } from './SliceTools/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';

export class ReduxFlagShaper extends BaseFlagger {
  getSelectorBuilder() {
    return new SelectorBuilder();
  };

  getSliceTools() {
    return new SliceTools(this.validator);
  }

  connect(...args) {
    return (component) => {
      // TODO
      return this.config.connectFn(args)(component);
    };
  };
}