import { FlagsToTest } from '../shared/common';

import { CreateFlaggedInterface } from '../../src/modules/RootFlagger/app';

interface OldITestDeep {
  testDeep1: number;
  testDeep2: number;
  testDeep3: number;
}

export type ITestDeep = CreateFlaggedInterface<OldITestDeep, [
  [FlagsToTest.flagA, { testDeep1: string }],
  [FlagsToTest.flagC, { addedInC: boolean[] }]
]>;

interface OldIProp4 {
  test1: number;
  test2: string;
  test3: string;
  test4: ITestDeep;
}

type IProp4 = CreateFlaggedInterface<OldIProp4, [
  [FlagsToTest.flagA, { test1: string }],
  [FlagsToTest.flagB, { test2: number }]
]>;

interface OldReduxState {
  prop1: string[];
  prop2: string[];
  prop3: string[];
  prop4: IProp4;
}

export type ReduxStateType = CreateFlaggedInterface<OldReduxState, [
  [FlagsToTest.flagA, { prop3: number[] }],
  [FlagsToTest.flagB, { prop3: boolean[] }]
]>;

const T0 = {} as ReduxStateType;