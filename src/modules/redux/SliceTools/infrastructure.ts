import { AnyFunction, AnyObject } from 'readable-types';

import { FlagValidator } from 'modules/checker/infrastructure';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';
import { ISliceTools } from './domain';

export const createSliceTools = <State extends AnyObject, Flag extends AllowedFlags, Config extends IConfig>(
  createSliceFn: AnyFunction,
  validator: FlagValidator<Flag>,
): ISliceTools<State, Flag, Config> => {
  return new class {
    public createSlice(opt: any) {
      return createSliceFn(opt);
    };

    private getReducer(x: AnyObject): AnyFunction | void {
      for (const flag of Object.keys(x).reverse()) {
        if (flag !== 'default' && !validator.isFlagEnabled(flag as Flag)) {
          continue;
        }

        const reducerByFlag = x[flag];
        if (typeof reducerByFlag === 'function') {
          return reducerByFlag;
        };

        return this.getReducer(reducerByFlag);
      }
    }

    public reducerByFlag(x: any, reducer?: any): any {
      if (typeof x === 'object' && !Array.isArray(x)) {
        return (...args: any[]) => {
          const reducer = this.getReducer(x);
          return reducer?.(...args);
        };
      }

      return (...args: any[]) => {
        if (validator.allFlagsAreEnabled(x)) {
          return reducer!(...args);
        }
      };
    }
  };
};