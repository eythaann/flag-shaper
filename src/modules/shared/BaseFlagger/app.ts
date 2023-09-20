import { FlagValidator } from '../../checker/infrastructure';

import { AllowedFlags, IConfig } from '../domain/interfaces';

export abstract class BaseFlagger<Flag extends AllowedFlags, Config extends IConfig> {
  constructor(protected readonly validator: FlagValidator<Flag>, protected readonly config: Config) {}
}