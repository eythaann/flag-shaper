import { ActionReducerMapBuilder, CaseReducer, CaseReducerWithPrepare, PayloadAction, Slice, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import { AnyObject, IsFunction, IsStrictObject, NonUndefined, ValueOf } from 'readable-types';

import { ExtractByFlags } from '../Flagger/app';

import { AllowedFlags } from '@shared/domain/interfaces';

type reducerCallback<
  _state extends AnyObject,
  keys extends [string, ...string[]] | [],
  State = ExtractByFlags<_state, keys>
> = CaseReducer<State, PayloadAction<any>> | CaseReducerWithPrepare<State, PayloadAction<any, string, any, any>>;

type NoInfer<T> = [T][T extends any ? 0 : never];

type ReducersObject<State extends AnyObject, Flags extends string, AnidatedIn extends [string, ...string[]] | []> = {
  'default': reducerCallback<State, [...AnidatedIn]>;
} & {
  [Flag in Flags]?: Flag extends AnidatedIn[number]
    ? never
    : reducerCallback<State, [...AnidatedIn, Flag]> | ReducersObject<State, Flags, [...AnidatedIn, Flag]>;
};

type TestExtract<T, V = NonUndefined<ValueOf<T>>> = V extends infer A
  ? IsFunction<A> extends true
    ? A
    : IsStrictObject<A> extends true
      ? TestExtract<A>
      : any
  : any;

export interface ISliceTools<State extends AnyObject, Flag extends AllowedFlags> {
  createSlice<S, R extends SliceCaseReducers<any>, Name extends string>(opt: {
    name: Name;
    initialState: S | (() => S);
    reducers: ValidateSliceCaseReducers<any, R>;
    extraReducers?: (builder: ActionReducerMapBuilder<any>) => void;
  }): Slice<any, R, Name>;

  reducerByFlag<flag extends Flag, reducer extends reducerCallback<State, [flag]>>(flag: flag, reducer: reducer): NoInfer<reducer>;

  reducerByFlag<flags extends [Flag, ...Flag[]], reducer extends reducerCallback<State, flags>>(flags: flags, reducer: reducer): NoInfer<reducer>;

  reducerByFlag<T extends ReducersObject<State, Flag, []>>(cases: T): TestExtract<T>;
};