import { $, nLengthTuple, TupleReduce } from 'readable-types';

import { BaseFlagger } from '../../../shared/BaseFlagger/app';
import { reducerCallback } from './app';

import { AllowedFlags } from '../../../shared/domain/interfaces';

interface $ReducersToUnion extends $<[acc: anyObject, current: [unknown, anyObject]]> {
  return: this[0] | this[1][1];
}

export declare class CaseReducerBuilder<
  State extends anyObject,
  FlagType extends AllowedFlags,
  CaseReducers extends nLengthTuple<[FlagType | FlagType[], anyObject]> = [],
  DefaultCase = () => void,
> extends BaseFlagger<FlagType> {
  /** When flags added to cases are not enabled ejecute default reducer */
  setDefault<T extends reducerCallback<State, []>>(reducer: T): CaseReducerBuilder<State, FlagType, CaseReducers, T>;
  // @ts-ignore
  addCase<flag extends FlagType, reducer extends reducerCallback<State, [flag]>>(flag: flag, reducer: reducer, forceEnableOn?: FlagType[]): CaseReducerBuilder<State, FlagType, [...CaseReducers, [flag, reducer]], DefaultCase>;
  // @ts-ignore
  addCase<flags extends [FlagType, ...FlagType[]], reducer extends reducerCallback<State, flags>>(flags: flags, reducer: reducer, forceEnableOn?: FlagType[]): CaseReducerBuilder<State, FlagType, [...CaseReducers, [flags, reducer]], DefaultCase>;

  build(): DefaultCase | TupleReduce<CaseReducers, $ReducersToUnion, never>;
}
