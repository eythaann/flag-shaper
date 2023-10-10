import { FlagValidator } from '../../checker/infrastructure';

import { AllowedFlags } from '../domain/interfaces';

export declare abstract class BaseFlagger<Flag extends AllowedFlags> {
  protected readonly validator: FlagValidator<Flag>;
  constructor(validator: FlagValidator<Flag>);
}