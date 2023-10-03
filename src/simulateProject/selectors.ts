import { FlagsToTest } from '../../__tests__/shared/common';
import { Shapper } from './initFlagger';
import { ReduxStateType, selectorBuilder } from './state';

import { ApplyFlagsOnType } from '../modules/RootFlagger/app';

const selectProp4 = selectorBuilder.createSelector('prop4');

export const selectTest1 = selectorBuilder.createSelectorFrom(selectProp4, 'test1');
const selectTest4 = selectorBuilder.createSelectorFrom(selectProp4, 'test4');

export const selectAddedInC = selectorBuilder.createSelectorFrom(selectTest4, 'addedInC');

const selectDeepAlternative = selectorBuilder.createSelector(['prop4', 'test4', 'testDeep1']);

const utilForFlagC = Shapper.fn.executableIn(FlagsToTest.flagC, (state: ReduxStateType) => {
  const concreteState = Shapper.concrete(state, FlagsToTest.flagC);
  return concreteState.prop4.test4.addedInC;
});

// testing

const ReduxState = {} as ReduxStateType;

const ReduxStateFC = {} as ApplyFlagsOnType<Shapper, ReduxStateType, [FlagsToTest.flagC]>;

const ReduxStateFA: ApplyFlagsOnType<Shapper, ReduxStateType, [FlagsToTest.flagA]> = {
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

const P = utilForFlagC(ReduxState);

const t1 = selectTest4(ReduxStateFA);
//     ^?

const t2 = selectAddedInC(ReduxState);
//     ^?

const t3 = selectAddedInC(ReduxStateFC);
//     ^?

const t4 = selectDeepAlternative(ReduxStateFA);
//     ^?

