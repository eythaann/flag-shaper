import { FlagChecker } from '../shared/interfaces';

export class FlagShaperChecker<Flag extends string> {
  readonly #isFlagEnabled: FlagChecker<Flag>;

  constructor(isFlagEnabled: FlagChecker<Flag>) {
    this.#isFlagEnabled = isFlagEnabled;
  }

  isFlagEnabled(flag: Flag): boolean {
    return this.#isFlagEnabled(flag);
  }

  someFlagIsEnabled(flag: Flag | Flag[]) {
    return [flag].flat().some(currentFlag => this.isFlagEnabled(currentFlag as Flag));
  }
}