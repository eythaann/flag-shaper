import { BaseFlagger } from '../shared/BaseFlagger/app';

export class FlagShaperForFunctions extends BaseFlagger {
  executableIn(flag, fn) {
    return (...args) => {
      if (!this.validator.allFlagsAreEnabled(flag)) {
        return;
      }
      return fn(...args);
    };
  }

  callableIn(flag, fn) {
    return (...args) => {
      if (!this.validator.allFlagsAreEnabled(flag)) {
        throw new Error(`${fn.name || 'anonymous'} fn() is not callable if flags are not enabled`);
      }
      return fn(...args);
    };
  }
}