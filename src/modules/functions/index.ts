import { FlagShaperChecker } from "../checker/index";
import { AllowedFlags } from "../shared/interfaces";

export class FlagShaperForFunctions<Flag extends AllowedFlags> extends FlagShaperChecker<Flag> {
  /** 
   * This method returns a function that can be executed if the specified feature flag is enabled. 
   * If the feature flag is not enabled, the returned function will do nothing and return `undefined`.
   */
  public executableIn<T extends (...args: any[]) => any>(flag: Flag | Flag[], fn: T) {
    return (...args: Parameters<T>): ReturnType<T> | undefined => {
      if (!this.someFlagIsEnabled(flag)) return;
      return fn(...args);
    }
  }

  /**
   * This method returns a function that can be called if the specified feature flag is enabled.
   * If the feature flag is not enabled, the returned function will throw an error with a message
   * indicating that the function cannot be called because the feature flag is not enabled.
   */
  public callableIn<T extends (...args: any[]) => any>(flag: Flag | Flag[], fn: T) {
    return (...args: Parameters<T>): ReturnType<T> => {
      if (!this.someFlagIsEnabled(flag)) throw new Error(`${fn.name || 'anonymous'} fn() not is callable if flag not is enabled`);
      return fn(...args);
    }
  }
}