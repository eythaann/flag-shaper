import { FlagValidator } from '../checker/infrastructure';
import { FlagShaperDecorators } from '../decorators/infrastructure';
import { FlagShaperForFunctions } from '../functions/infrastructure';
import { FlagShaperJSX } from '../jsx/infrastructure';
import { FlagShaperForObjects } from '../objects/infrastructure';
import { ReduxFlagShaper } from '../redux/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';

import { DefaultConfig } from '../shared/domain/constants';

export class FlagShaper extends BaseFlagger {
  constructor(isFlagEnabled, config = DefaultConfig) {
    super(new FlagValidator(isFlagEnabled), config);

    const args = [this.validator, this.config];

    this.fn = new FlagShaperForFunctions(...args);
    this.obj = new FlagShaperForObjects(...args);
    this.dec = new FlagShaperDecorators(...args);
    this.jsx = new FlagShaperJSX(...args);
    this.redux = new ReduxFlagShaper(...args);

    this.rx = this.redux;
  }

  concrete(obj, flags) {
    if (!this.validator.allFlagsAreEnabled(flags)) {
      const flagsString = [flags].flat().join(', ');
      throw new Error(`You are trying to concrete an object with [${flagsString}], but these are not enabled`);
    }
    return obj;
  }

  softConcrete(obj, flags) {
    if (!this.validator.allFlagsAreEnabled(flags)) {
      return;
    }
    return obj;
  }

  getValueByFlag(init, over) {
    return init; // TODO MAKE IMPLEMENTATION
  }
}