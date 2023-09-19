import { FlagShaperForFunctions } from './modules/functions/index';

import { FlagShaperChecker } from './modules/checker/infrastructure';
import { FlagShaperDecorators } from './modules/decorators/infrastructure';
import { FlagShaperJSX } from './modules/jsx/infrastructure';
import { FlagShaperForObjects } from './modules/objects/infrastructure';
import { ReduxFlagShaper } from './modules/redux/infrastructure';

import { DefaultConfig } from '@shared/domain/constants';
import { AllowedFlags, FlagCheckerFn, IConfig } from '@shared/domain/interfaces';

export class FlagShaper<
  Flag extends AllowedFlags = string,
  Config extends IConfig = typeof DefaultConfig,
> {
  readonly checker: FlagShaperChecker<Flag>;

  /** @alias function */
  readonly fn: FlagShaperForFunctions<Flag, Config>;
  readonly function: FlagShaperForFunctions<Flag, Config>;

  /** @alias object */
  readonly obj: FlagShaperForObjects<Flag, Config>;
  readonly object: FlagShaperForObjects<Flag, Config>;

  /** @alias decorator */
  readonly dec: FlagShaperDecorators<Flag, Config>;
  readonly decorator: FlagShaperDecorators<Flag, Config>;

  /** @alias redux */
  readonly rx: ReduxFlagShaper<Flag, Config>;
  readonly redux: ReduxFlagShaper<Flag, Config>;

  readonly jsx: FlagShaperJSX<Flag, Config>;

  public constructor(isFlagEnabled: FlagCheckerFn<Flag>, config: Readonly<Config> = DefaultConfig as Config) {
    this.checker = new FlagShaperChecker(isFlagEnabled);

    this.function = new FlagShaperForFunctions(this.checker, config);
    this.object = new FlagShaperForObjects(this.checker, config);
    this.decorator = new FlagShaperDecorators(this.checker, config);
    this.jsx = new FlagShaperJSX(this.checker, config);
    this.redux = new ReduxFlagShaper(this.checker, config);

    this.fn = this.function;
    this.obj = this.object;
    this.dec = this.decorator;
    this.rx = this.redux;
  }
}
