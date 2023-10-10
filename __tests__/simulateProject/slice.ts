import { FlagsToTest } from '../shared/common';
import { Shapper } from './initFlagger';
import { ReduxStateType } from './state';
import { PayloadAction } from '@reduxjs/toolkit';

import { HiddenToExplicit } from '../../src/modules/RootFlagger/app';

const { createSlice, reducerByFlag, reducerBuilder } = Shapper.redux.getSliceTools<ReduxStateType>();

const state = {} as HiddenToExplicit<ReduxStateType>;

const _slice = createSlice({
  name: 'test',
  initialState: state,
  reducers: {
    'setAddedInC': reducerByFlag(FlagsToTest.flagC, (state, action: PayloadAction<{ test: '123' }>) => {
      action.payload.test;
      state.prop4.test4.addedInC = [true, false, true, false];
    }),

    'setAddedInCAndProp3': reducerByFlag([FlagsToTest.flagA, FlagsToTest.flagC], (state) => {
      state.prop4.test4.addedInC = [true, false, true, false];
      state.prop3 = [1, 2, 3];
    }),

    'setProp3': reducerBuilder()
      .setDefault((state, action: PayloadAction<string[]>) => {
        state.prop3 = action.payload;
      })
      .addCase(FlagsToTest.flagA, (state, action: PayloadAction<number[]>) => {
        state.prop3 = action.payload;
      })
      .addCase([FlagsToTest.flagA, FlagsToTest.flagC], (state, action: PayloadAction<{ prop3: number[]; c: boolean[] }>) => {
        state.prop4.test4.addedInC = action.payload.c;
        state.prop3 = action.payload.prop3;
      })
      .build(),
  },
});

export const actions = _slice.actions;