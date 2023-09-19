import { ActionReducerMapBuilder, CaseReducer, CaseReducerWithPrepare, PayloadAction, Slice, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import { AnyFunction, AnyObject, NonUndefined, ValueOf } from 'readable-types';
import { AllowedFlags } from '../../shared/domain/interfaces';
import { ExtractByFlags } from '../app';

type reducerCallback<
  _state extends AnyObject,
  keys extends [string, ...string[]] | [],
  State = ExtractByFlags<_state, keys>
> = CaseReducer<State, PayloadAction<any>> | CaseReducerWithPrepare<State, PayloadAction<any, string, any, any>>;

type NoInfer<T> = [T][T extends any ? 0 : never];

export class SliceTools<State extends AnyObject, Flag extends AllowedFlags> {
  constructor(private createSliceFn: AnyFunction) {}

  public createSlice<S, R extends SliceCaseReducers<any>, Name extends string>(opt: {
    name: Name;
    initialState: S | (() => S);
    reducers: ValidateSliceCaseReducers<any, R>;
    extraReducers?: (builder: ActionReducerMapBuilder<any>) => void;
  }): Slice<any, R, Name>;

  public createSlice(opt: any) {
    return this.createSliceFn(opt);
  };

  public reducerByFlag<
    flag extends Flag,
    reducer extends reducerCallback<State, [flag]>
  >(flag: flag, reducer: reducer): NoInfer<reducer>;

  public reducerByFlag<
    flags extends [Flag, ...Flag[]],
    reducer extends reducerCallback<State, flags>
  >(flags: flags, reducer: reducer): NoInfer<reducer>;

  public reducerByFlag<
    T extends {
      'default': reducerCallback<State, []>;
    } & {
      [K in Flag]?: reducerCallback<State, [K]>;
    }
  >(cases: T): NonUndefined<ValueOf<T>>;

  public reducerByFlag(): any {
    return; // TODO make implementation;
  }
};