import { CaseReducerBuilder } from './ReducerBuilder/infrastructure';

import { BaseFlagger } from '../../shared/BaseFlagger/app';

export class SliceTools extends BaseFlagger {
  constructor(validator, createSliceFn) {
    super(validator);
    this._createSlice = createSliceFn;
  };

  createSlice(options) {
    // TODO
    return this._createSlice(options);
  };

  reducerByFlag(flags, reducer) {
    return (...args) => {
      if (this.validator.allFlagsAreEnabled(flags)) {
        return reducer(...args);
      }
    };
  }

  reducerBuilder() {
    return new CaseReducerBuilder(validator);
  }
}