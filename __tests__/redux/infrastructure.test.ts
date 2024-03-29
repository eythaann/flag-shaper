import { FlagsToTest } from '../shared/common';
import { IProp4, ITest4, MocketState, ReduxState } from './mockets';
import { Modify } from 'readable-types';

import { FlagValidator } from '../../src/modules/checker/infrastructure';
import { ReduxFlagShaper } from '../../src/modules/redux/infrastructure';

class ReduxFlagShaperForTest extends ReduxFlagShaper<FlagsToTest> {
}

type FakeReduxFlagShaper = typeof FakeReduxFlagShaper;
const FakeReduxFlagShaper = new ReduxFlagShaperForTest(new FlagValidator((a: FlagsToTest) => {
  return [FlagsToTest.flagA].includes(a);
}));

describe('ReduxFlagShaper', () => {
  describe('SelectorBuilder', () => {
    let state: ReduxState;

    beforeEach(() => {
      state = cloneDeep(MocketState);
    });

    it('Should allow not flagged states', () => {
      const selectorBuilder = FakeReduxFlagShaper.getSelectorBuilder<ReduxState>();

      const selector = selectorBuilder.createSelector('prop1');
      const deepSelector = selectorBuilder.createSelector(['prop4', 'test4', 'testDeep4', 'reallyDeep3']);

      const selectedItem = selector(state);
      const selectedDeepItem = deepSelector(state);

      assertType<typeof selectedItem>().equals(state.prop1);
      expect(selectedItem).toEqual(state.prop1);

      assertType<typeof selectedDeepItem>().equals(state.prop4.test4.testDeep4.reallyDeep3);
      expect(selectedItem).toEqual(state.prop4.test4.testDeep4.reallyDeep3);
    });

    it('Should allow mix states', () => {
      type State = Modify<ReduxState, { prop4: Modify<IProp4, { test4: OverwriteByFlag<FakeReduxFlagShaper, ITest4, [
        [FlagsToTest.flagA, {
          addedInA: 'eythanWasHere';
        }]
      ]>; }>; }>;

      const state = MocketState as ExtractByFlags<FakeReduxFlagShaper, State, [FlagsToTest.flagA]>;
      state.prop4.test4.addedInA = 'eythanWasHere';

      const selectorBuilder = FakeReduxFlagShaper.getSelectorBuilder<State>();
      const selector = selectorBuilder.createSelector(['prop4', 'test4', 'addedInA']);
      const selectedItem = selector(state);

      assertType<typeof selectedItem>().equals(state.prop4.test4.addedInA);
      expect(selectedItem).toEqual(state.prop4.test4.addedInA);
    });

    it('should allow full flagged states');
    it('should allow array Selections');

    it('should allow anidate selectors', () => {
      const selectorBuilder = FakeReduxFlagShaper.getSelectorBuilder<ReduxState>();

      const selectProp4 = selectorBuilder.createSelector('prop4');
      const selectTest4 = selectorBuilder.createSelectorFrom(selectProp4, 'test4');
      const selectTestDeep4 = selectorBuilder.createSelectorFrom(selectTest4, 'testDeep4');
      const selectReallyDeep3 = selectorBuilder.createSelectorFrom(selectTestDeep4, 'reallyDeep3');

      const selectedItem = selectReallyDeep3(state);

      assertType<typeof selectedItem>().equals(state.prop4.test4.testDeep4.reallyDeep3);
      expect(selectedItem).toEqual(state.prop4.test4.testDeep4.reallyDeep3);
    });
  });
});