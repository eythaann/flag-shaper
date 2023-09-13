import { DefaultConfig } from '../shared/domain/constants';
import { AllowedFlags, FlagChecker, IConfig } from '../shared/domain/interfaces';

export class FlagShaperChecker<Flag extends AllowedFlags, Config extends IConfig> {
  readonly #isFlagEnabled: FlagChecker<Flag>;
  readonly config: Config

  constructor(isFlagEnabled: FlagChecker<Flag>, config: Config) {
    this.#isFlagEnabled = isFlagEnabled;
    this.config = config;
  }

  isFlagEnabled(flag: Flag): boolean {
    return this.#isFlagEnabled(flag);
  }

  someFlagIsEnabled(flag: Flag | Flag[]): boolean {
    return [flag].flat().some(currentFlag => this.isFlagEnabled(currentFlag as Flag));
  }
}