import { AllowedFlags, FlagCheckerFn } from '../shared/domain/interfaces';

export declare class FlagValidator<Flag extends AllowedFlags> {
  private readonly _isFlagEnabled: FlagCheckerFn<Flag>;
  public constructor(isFlagEnabled: FlagCheckerFn<Flag>);
  public isFlagEnabled(flag: Flag): boolean;
  public someFlagIsEnabled(flag: Flag | Flag[]): boolean;
  public allFlagsAreEnabled(flag: Flag | Flag[]): boolean;
}