import { FlagsToTest } from '../shared/common';
import { Shapper } from './initFlagger';
import { ReduxStateType } from './state';

export const selectorBuilder = Shapper.rx.getSelectorBuilder<ReduxStateType>();

export const selectProp4 = selectorBuilder.createSelector('prop4');

export const selectTest1 = selectorBuilder.createSelectorFrom(selectProp4, 'test1');
export const selectTest4 = selectorBuilder.createSelectorFrom(selectProp4, 'test4');

export const selectAddedInC = selectorBuilder.createSelectorFrom(selectTest4, 'addedInC');
export const selectDeepAlternative = selectorBuilder.createSelector(['prop4', 'test4', 'testDeep1']);

export const utilForFlagC = Shapper.fn.executableIn(FlagsToTest.flagC, (state: ReduxStateType) => {
  const concreteState = Shapper.concrete(state, FlagsToTest.flagC);
  return concreteState.prop4.test4.addedInC;
});