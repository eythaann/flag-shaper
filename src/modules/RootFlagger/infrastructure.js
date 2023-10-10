import { FlagShaperForFunctions } from '../functions/infrastructure';
import { FlagShaperJSX } from '../jsx/infrastructure';
import { FlagShaperForObjects } from '../objects/infrastructure';
import { ReduxFlagShaper } from '../redux/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';

export class FlagShaper extends BaseFlagger {
  constructor(builder) {
    super(builder.validator);

    const args = [builder.validator];

    this.fn = new FlagShaperForFunctions(...args);
    this.obj = new FlagShaperForObjects(...args);
    //this.dec = new FlagShaperDecorators(...args);

    if (builder._JSXEnabled) {
      this.jsx = new FlagShaperJSX(...args);
    }

    if (builder._ReduxEnabled) {
      this.redux = new ReduxFlagShaper(builder.validator, builder.connectFn, builder.createSliceFn);
    }
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

  static builder() {
    return class FlagShaper_Builder extends BaseFlagger {
      _JSXEnabled;
      _ReduxEnabled;
      _connectFn;
      _createSliceFn;

      get connectFn() {
        return this._connectFn;
      }

      get createSliceFn() {
        return this._createSliceFn;
      }

      constructor(isFlagEnabled) {
        super(isFlagEnabled);
      };

      withJSX() {
        this._JSXEnabled = true;
        return this;
      };

      withRedux(connectFn, createSliceFn) {
        this._ReduxEnabled = tue;
        this._connectFn = connectFn;
        this._createSliceFn = createSliceFn;
        return this;
      };

      build() {
        return new FlagShaper(this);
      };
    };
  }
}