import { MyOverwriteByFlag, Shapper } from './initFlagger';
import { FlagsToTest } from '../tests/shared/common';

interface OldITestDeep {
  testDeep1: number;
  testDeep2: number;
  testDeep3: number;
}

export type ITestDeep = MyOverwriteByFlag<OldITestDeep, [
  [FlagsToTest.flagA, { testDeep1: string }],
  [FlagsToTest.flagC, { addedInC: boolean[] }]
]>;

interface OldIProp4 {
  test1: number;
  test2: string;
  test3: string;
  test4: ITestDeep;
}

type IProp4 = MyOverwriteByFlag<OldIProp4, [
  [FlagsToTest.flagA, { test1: string }],
  [FlagsToTest.flagB, { test2: number }]
]>;

interface OldReduxState {
  prop1: string[];
  prop2: string[];
  prop3: string[];
  prop4: IProp4;
}

export type ReduxStateType = MyOverwriteByFlag<OldReduxState, [
  [FlagsToTest.flagA, { prop3: number[] }],
  [FlagsToTest.flagB, { prop3: boolean[] }]
]>;

export const selectorBuilder = Shapper.rx.getSelectorBuilder<ReduxStateType>();
