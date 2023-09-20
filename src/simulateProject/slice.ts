import { Shapper } from './initFlagger';
import { ReduxStateType } from './state';
import { PayloadAction } from '@reduxjs/toolkit';
import { FlagsToTest } from 'tests/shared/common';

const { createSlice, reducerByFlag } = Shapper.redux.getSliceTools<ReduxStateType>();

const state = {} as ReduxStateType;

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

    'setProp3': reducerByFlag({
      default: (state, action: PayloadAction<string[]>) => {
        state.prop3 = action.payload;
      },
      [FlagsToTest.flagA]: {
        default: (state, action: PayloadAction<number[]>) => {
          state.prop3 = action.payload;
        },
        [FlagsToTest.flagC]: (state, action: PayloadAction<{ prop3: number[]; c: boolean[] }>) => {
          state.prop4.test4.addedInC = action.payload.c;
          state.prop3 = action.payload.prop3;
        },
      },
    }),
  },
});

export const actions = _slice.actions;
