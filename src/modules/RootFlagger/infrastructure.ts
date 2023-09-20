
import { FlagShaperForFunctions } from '@modules/functions/infrastructure';
import { FlagValidator } from '../checker/infrastructure';
import { FlagShaperDecorators } from '../decorators/infrastructure';
import { FlagShaperJSX } from '../jsx/infrastructure';
import { FlagShaperForObjects } from '../objects/infrastructure';
import { ReduxFlagShaper } from '../redux/Flagger/infrastructure';

import { BaseFlagger } from '@shared/BaseFlagger/app';

import { DefaultConfig } from '@shared/domain/constants';
import { AllowedFlags, FlagCheckerFn, IConfig } from '@shared/domain/interfaces';

export class FlagShaper<
  Flag extends AllowedFlags = string,
  Config extends IConfig = typeof DefaultConfig,
> extends BaseFlagger<Flag, Config> {
  public readonly validator: FlagValidator<Flag>;
  public readonly config: Config;

  /** @alias function */
  public readonly fn: FlagShaperForFunctions<Flag, Config>;
  public readonly function: FlagShaperForFunctions<Flag, Config>;

  /** @alias object */
  public readonly obj: FlagShaperForObjects<Flag, Config>;
  public readonly object: FlagShaperForObjects<Flag, Config>;

  /** @alias decorator */
  public readonly dec: FlagShaperDecorators<Flag, Config>;
  public readonly decorator: FlagShaperDecorators<Flag, Config>;

  /** @alias redux */
  public readonly rx: ReduxFlagShaper<Flag, Config>;
  public readonly redux: ReduxFlagShaper<Flag, Config>;

  public readonly jsx: FlagShaperJSX<Flag, Config>;

  public constructor(isFlagEnabled: FlagCheckerFn<Flag>, config: Readonly<Config> = DefaultConfig as Config) {
    super(new FlagValidator(isFlagEnabled), config);

    const args = [this.validator, this.config] as const;

    this.function = new FlagShaperForFunctions(...args);
    this.object = new FlagShaperForObjects(...args);
    this.decorator = new FlagShaperDecorators(...args);
    this.jsx = new FlagShaperJSX(...args);
    this.redux = new ReduxFlagShaper(...args);

    this.fn = this.function;
    this.obj = this.object;
    this.dec = this.decorator;
    this.rx = this.redux;
  }
}
