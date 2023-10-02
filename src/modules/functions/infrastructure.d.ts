import { AnyFunction } from 'readable-types';

import { BaseFlagger } from '../shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from '../shared/domain/interfaces';

export declare class FlagShaperForFunctions<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  /**
   * This method returns a function that can be executed if the specified feature flag is enabled.
   * If the feature flag is not enabled, the returned function will do nothing and return `undefined`.
   */
  public executableIn<T extends AnyFunction>(flag: Flag | Flag[], fn: T): (...args: Parameters<T>) => ReturnType<T> | undefined;

  /**
   * This method returns a function that can be called if the specified feature flag is enabled.
   * If the feature flag is not enabled, the returned function will throw an error with a message
   * indicating that the function cannot be called because the feature flag is not enabled.
   */
  public callableIn<T extends AnyFunction>(flag: Flag | Flag[], fn: T): (...args: Parameters<T>) => ReturnType<T>;
}