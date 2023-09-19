import { AllowedFlags, FlagCheckerFn } from '@shared/domain/interfaces';

export class FlagShaperChecker<Flag extends AllowedFlags> {
  private readonly _isFlagEnabled: FlagCheckerFn<Flag>;

  public constructor(isFlagEnabled: FlagCheckerFn<Flag>) {
    this._isFlagEnabled = isFlagEnabled;
  }

  public isFlagEnabled(flag: Flag): boolean {
    return this._isFlagEnabled(flag);
  }

  public someFlagIsEnabled(flag: Flag | Flag[]): boolean {
    return [flag].flat().some((currentFlag) => this._isFlagEnabled(currentFlag as Flag));
  }

  public allFlagsAreEnabled(flag: Flag | Flag[]): boolean {
    return [flag].flat().every((currentFlag) => this._isFlagEnabled(currentFlag as Flag));
  }
}