import { FlagShaperChecker } from '../../checker/infrastructure';

import { AllowedFlags, IConfig } from '../domain/interfaces';

export abstract class BaseFlagger<Flag extends AllowedFlags, Config extends IConfig> {
  constructor(protected readonly checker: FlagShaperChecker<Flag>, protected readonly config: Config) {}
}