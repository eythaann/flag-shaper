
import { BaseFlagger } from '../../../shared/BaseFlagger/app';

export class CaseReducerBuilder extends BaseFlagger {
  #caseReducers = [];
  #defaultCase;

  setDefault(reducer) {
    this.#defaultCase = reducer;
    return this;
  }

  addCase(flag, reducer, forceEnableOn = []) {
    this.#caseReducers.push([flag, reducer, forceEnableOn]);
    return this;
  }

  build() {
    const caseReducers = this.#caseReducers.reverse();
    const defaultFn = this.#defaultCase || (() => {});

    return (...args) => {
      for (const [flag, reducer, flagsToForce] of caseReducers) {
        if (this.validator.allFlagsAreEnabled(flag) || this.validator.someFlagIsEnabled(flagsToForce)) {
          return reducer(...args);
        }
      }
      return defaultFn(...args);
    };
  }
}
