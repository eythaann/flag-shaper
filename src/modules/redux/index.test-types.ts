import { FlagsToTest } from '../../tests/shared/common';

import { ReduxFlagShaper } from './infrastructure';

import { ExtractByFlags, ModifyUsingInterface } from './app';

import { DefaultConfig } from '../shared/domain/constants';

interface OldITestDeep {
  testDeep1: number;
  testDeep2: number;
  testDeep3: number;
}

type ITestDeep = ModifyUsingInterface<OldITestDeep, [
  [FlagsToTest.flagA, { testDeep1: string }],
  [FlagsToTest.flagC, { addedInC: boolean[] }]
]>;

interface OldIProp4 {
  test1: number;
  test2: string;
  test3: string;
  test4: ITestDeep;
}

type IProp4 = ModifyUsingInterface<OldIProp4, [
  [FlagsToTest.flagA, { test1: string }],
  [FlagsToTest.flagB, { test2: number }]
]>;

interface OldReduxState {
  prop1: string[];
  prop2: string[];
  prop3: string[];
  prop4: IProp4;
}

export type ReduxStateType = ModifyUsingInterface<OldReduxState, [
  [FlagsToTest.flagA, { prop3: number[] }],
  [FlagsToTest.flagB, { prop3: boolean[] }]
]>;

export const ReduxState = {} as ReduxStateType;

const ReduxStateFC = {} as ExtractByFlags<ReduxStateType, [FlagsToTest.flagC]>;

const ReduxStateFA: ExtractByFlags<ReduxStateType, [FlagsToTest.flagA]> = {
  prop1: [String()],
  prop2: [String()],
  prop3: [Number()],
  prop4: {
    test1: String(),
    test2: String(),
    test3: String(),
    test4: {
      testDeep1: String(),
      testDeep2: Number(),
      testDeep3: Number(),
    },
  },
};

const FakeReduxFlagShaper = new ReduxFlagShaper<FlagsToTest, typeof DefaultConfig>((a: FlagsToTest) => {
  return [FlagsToTest.flagA].includes(a);
}, DefaultConfig);

const selectorBuilder = new FakeReduxFlagShaper.SelectorBuilder<ReduxStateType>();

const selectProp4 = selectorBuilder.createSelector('prop4');

const selectTest1 = selectorBuilder.createSelectorFrom(selectProp4, 'test1');
const selectTest4 = selectorBuilder.createSelectorFrom(selectProp4, 'test4');

const selectDeep = selectorBuilder.createSelectorFrom(selectTest4, 'addedInC');

const selectDeepAlternative = selectorBuilder.createSelector(['prop4', 'test4', 'testDeep1']);

const t1 = selectTest4(ReduxStateFA);
//     ^?

const t2 = selectDeep(ReduxState);
//     ^?

const t3 = selectDeep(ReduxStateFC);
//     ^?

const t4 = selectDeepAlternative(ReduxStateFA);
//     ^?

if (FakeReduxFlagShaper.isFlagEnabled(FlagsToTest.flagA)) {

}