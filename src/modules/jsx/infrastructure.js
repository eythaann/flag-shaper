import { BaseFlagger } from '../shared/BaseFlagger/app';

export class FlagShaperJSX extends BaseFlagger {
  enableComponentIn(flag, component) {
    if (this.validator.someFlagIsEnabled(flag)) {
      return component;
    }
    return () => null;
  }
};