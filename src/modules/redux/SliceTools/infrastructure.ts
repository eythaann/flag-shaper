import { AnyFunction, AnyObject } from 'readable-types';

import { FlagShaperChecker } from '@modules/checker/infra';

import { ISliceTools } from './domain';
import { AllowedFlags } from '@shared/domain/interfaces';

class SliceTools<State extends AnyObject, Flag extends AllowedFlags> implements ISliceTools<State, Flag> {
  constructor(private createSliceFn: AnyFunction, private checker: FlagShaperChecker<Flag>) {}

  public createSlice(opt: any) {
    return this.createSliceFn(opt);
  };

  public reducerByFlag(x: any, reducer?: any): any {
    if (typeof x === 'object' && !Array.isArray(x)) {
      return; // todo implemente case 3
    }

    return (...args: any[]) => {
      if (this.checker.allFlagsAreEnabled(x)) {
        return reducer!(...args);
      }
    };
  }
};

export const createSliceTools = <State extends AnyObject, Flag extends string>(
  createSliceFn: AnyFunction,
  checker: FlagShaperChecker<Flag>,
): ISliceTools<State, Flag> => {
  return new SliceTools<State, Flag>(createSliceFn, checker);
};