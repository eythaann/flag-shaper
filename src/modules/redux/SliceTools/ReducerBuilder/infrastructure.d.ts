import { AnyObject, IteratorHKT, nLengthTuple, TupleReduceHKT } from 'readable-types';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';
import { reducerCallback } from './app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';

interface ReducersToUnion extends IteratorHKT.Tuple<[unknown, AnyObject]> {
  initialAcc: never;
  return: this['acc'] | this['current'][1];
}

export class CaseReducerBuilder<
  State extends AnyObject,
  FlagType extends AllowedFlags,
  Config extends IConfig,
  CaseReducers extends nLengthTuple<[FlagType | FlagType[], AnyObject]> = [],
  DefaultCase = undefined,
> extends BaseFlagger<FlagType, Config> {
  /** When flags added to cases are not enabled ejecute default reducer */
  setDefault<T extends reducerCallback<State, [], Config['keyForOverwrites']>>(reducer: T): CaseReducerBuilder<State, FlagType, Config, CaseReducers, T>;
  // @ts-ignore
  addCase<flag extends FlagType, reducer extends reducerCallback<State, [flag], Config['keyForOverwrites']>>(flag: flag, reducer: reducer, forceEnableOn?: FlagType[]): CaseReducerBuilder<State, FlagType, Config, [...CaseReducers, [flag, reducer]], DefaultCase>;
  // @ts-ignore
  addCase<flags extends [FlagType, ...FlagType[]], reducer extends reducerCallback<State, flags, Config['keyForOverwrites']>>(flags: flags, reducer: reducer, forceEnableOn?: FlagType[]): CaseReducerBuilder<State, FlagType, Config, [...CaseReducers, [flags, reducer]], DefaultCase>;

  build(): DefaultCase | TupleReduceHKT<CaseReducers, ReducersToUnion>;
}
