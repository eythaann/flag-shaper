import type { CaseReducer, CaseReducerWithPrepare, PayloadAction } from '@reduxjs/toolkit';
import { AnyObject } from 'readable-types';

import { ApplyFlagsOnType } from '../../../RootFlagger/app';

export type reducerCallback<
  _state extends AnyObject,
  keys extends [string, ...string[]] | [],
  State = ApplyFlagsOnType<_state, keys>
> = CaseReducer<State, PayloadAction<any>> | CaseReducerWithPrepare<State, PayloadAction<any, string, any, any>>;