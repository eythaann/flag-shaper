import { ActionCreatorWithoutPayload, ActionReducerMapBuilder, PayloadAction, Slice, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import { _ActionCreatorWithPreparedPayload, BaseActionCreator } from '@reduxjs/toolkit/dist/createAction';
import { AnyObject, IsNever, Modify, NoInfer } from 'readable-types';

import { CaseReducerBuilder } from './ReducerBuilder/infrastructure';

import { BaseFlagger } from '../../shared/BaseFlagger/app';
import { reducerCallback } from './ReducerBuilder/app';

import { AllowedFlags, IConfig } from '../../shared/domain/interfaces';

/* type ReducersObject<
  State extends AnyObject,
  Flags extends string,
  AnidatedIn extends [string, ...string[]] | [],
  KeyToDiscriminate extends string,
> = {
  'default': reducerCallback<State, [...AnidatedIn], KeyToDiscriminate>;
} & {
  [Flag in Flags]?: Flag extends AnidatedIn[number]
    ? never
    : reducerCallback<State, [...AnidatedIn, Flag], KeyToDiscriminate>
    | ReducersObject<State, Flags, [...AnidatedIn, Flag], KeyToDiscriminate>;
}; */

/* type TestExtract<T, V = NonUndefined<ValueOf<T>>> = V extends infer A
  ? IsFunction<A> extends true
    ? A
    : IsStrictObject<A> extends true
      ? TestExtract<A>
      : any
  : any; */

interface ActionCreatorWithPayload<Payload, Type extends string = string> extends BaseActionCreator<Payload, Type> {
  <T extends Payload>(payload: T): PayloadAction<T, Type>;
}

type GetAllPosiblePayloads<CR> = CR extends (state: any, action: infer Action) => any
  ? Action extends { payload: infer P }
    ? P
    : never
  : never;

type ActionCreatorForCaseReducer<CR, Type extends string, P = GetAllPosiblePayloads<CR>> = IsNever<P> extends true
  ? ActionCreatorWithoutPayload<Type>
  : ActionCreatorWithPayload<P, Type>;

type SliceActionType<SliceName extends string, ActionName extends keyof any> = ActionName extends string | number ? `${SliceName}/${ActionName}` : string;

type ActionCreatorForCaseReducerWithPrepare<CR extends {
  prepare: any;
}, Type extends string> = _ActionCreatorWithPreparedPayload<CR['prepare'], Type>;

type CaseReducerActions<CaseReducers extends SliceCaseReducers<any>, SliceName extends string> = {
  [ActionName in keyof CaseReducers]: CaseReducers[ActionName] extends {
    prepare: any;
  } ? ActionCreatorForCaseReducerWithPrepare<CaseReducers[ActionName], SliceActionType<SliceName, ActionName>>
    : ActionCreatorForCaseReducer<CaseReducers[ActionName], SliceActionType<SliceName, ActionName>>
};

export declare class SliceTools<State extends AnyObject, Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  createSlice<_S, R extends SliceCaseReducers<any>, Name extends string>(opt: {
    name: Name;
    initialState: any | (() => any);
    reducers: ValidateSliceCaseReducers<any, R>;
    extraReducers?: (builder: ActionReducerMapBuilder<any>) => void;
  }): Modify<Slice<any, R, Name>, {
    actions: CaseReducerActions<R, Name>;
  }>;

  reducerByFlag<flag extends Flag, reducer extends reducerCallback<State, [flag], Config['keyForOverwrites']>>(flag: flag, reducer: reducer): NoInfer<reducer>;

  reducerByFlag<flags extends [Flag, ...Flag[]], reducer extends reducerCallback<State, flags, Config['keyForOverwrites']>>(flags: flags, reducer: reducer): NoInfer<reducer>;

  /**
   * In this case reducerByFlag will return a function that on ejecution will select
   * one of the functions in the map, imagine map as a tree that will be searched from
   * left to right, in this case is from down to top, so the last keys will be checket first,
   * this is important if you are making logic with many flags.
   * @param cases
   *
   * @example
   * // in this case the first trigger to check will be flagB and flagA, if flagA is not enable
   * // will ejecute default on flagB, if flagB not is enabled will check only for flagA and
   * // if it not is enabled will trigger the default fn if exist
   * // (default is optional if do not match any fn when reducer is call just nothing will happen)
   * const obj = {
   *    default: fn,
   *    flagA: fn,
   *    flagB: {
   *      default: fn,
   *      flagA: fn,
   *    }
   * }
   */
  // reducerByFlag<T extends ReducersObject<State, Flag, [], Config['keyForOverwrites']>>(cases: T): TestExtract<T>;

  reducerBuilder(): CaseReducerBuilder<State, Flag, Config>;
}