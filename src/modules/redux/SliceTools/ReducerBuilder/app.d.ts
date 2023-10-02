import type { CaseReducer, CaseReducerWithPrepare, PayloadAction } from '@reduxjs/toolkit';
import { AnyObject } from 'readable-types';

import { ApplyFlagsOnType } from '../../../RootFlagger/app';

export type reducerCallback<
  _state extends AnyObject,
  keys extends [string, ...string[]] | [],
  KeyToDiscriminate extends string,
  State = ApplyFlagsOnType<{ config: { keyForOverwrites: KeyToDiscriminate } }, _state, keys>
> = CaseReducer<State, PayloadAction<any>> | CaseReducerWithPrepare<State, PayloadAction<any, string, any, any>>;