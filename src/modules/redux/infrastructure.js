import { SelectorBuilder } from './SelectorBuilder/infrastructure';
import { SliceTools } from './SliceTools/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';

export class ReduxFlagShaper extends BaseFlagger {
  constructor(validator, connectFn, createSliceFn) {
    super(validator);
    this._connect = connectFn;
    this._createSlice = createSliceFn;
  };

  getSelectorBuilder() {
    return new SelectorBuilder();
  };

  getSliceTools() {
    return new SliceTools(this.validator, this._createSlice);
  }

  connect(...args) {
    return (component) => {
      return this._connect(args)(component);
    };
  };
}