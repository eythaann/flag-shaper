
import { BaseFlagger } from '../../../shared/BaseFlagger/app';

export class CaseReducerBuilder extends BaseFlagger {
  _caseReducers = [];
  _defaultCase;

  setDefault(reducer) {
    this._defaultCase = reducer;
    return this;
  }

  addCase(flag, reducer, forceEnableOn = []) {
    this._caseReducers.push([flag, reducer, forceEnableOn]);
    return this;
  }

  build() {
    const caseReducers = this._caseReducers.reverse();
    const defaultFn = this._defaultCase || (() => {});

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
