import { CaseReducerBuilder } from './ReducerBuilder/infrastructure';

import { BaseFlagger } from '../../shared/BaseFlagger/app';

export class SliceTools extends BaseFlagger {
  createSlice(options) {
    return this.config.createSliceFn(options);
  };

  reducerByFlag(flags, reducer) {
    return (...args) => {
      if (validator.allFlagsAreEnabled(flags)) {
        return reducer(...args);
      }
    };
  }

  reducerBuilder() {
    return new CaseReducerBuilder(validator, config);
  }
}