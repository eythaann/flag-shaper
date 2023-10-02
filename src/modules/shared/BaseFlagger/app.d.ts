import { FlagValidator } from '../../checker/infrastructure';

import { AllowedFlags, IConfig } from '../domain/interfaces';

export declare abstract class BaseFlagger<Flag extends AllowedFlags, Config extends IConfig> {
  protected readonly validator: FlagValidator<Flag>;
  protected readonly config: Config;
  constructor(validator: FlagValidator<Flag>, config: Config);
}