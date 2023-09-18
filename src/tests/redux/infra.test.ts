import { Modify } from 'readable-types';
import { ExtractByFlags, ModifyUsingInterface } from '../../modules/redux/app';
import { ReduxFlagShaper } from '../../modules/redux/infra';
import { cloneDeep } from '../../modules/shared/app/utils';
import { DefaultConfig } from '../../modules/shared/domain/constants';
import { FlagsToTest } from '../shared/common';
import { IProp4, ITest4, MocketState, ReduxState } from './mockets';

const FakeReduxFlagShaper = new ReduxFlagShaper<FlagsToTest, typeof DefaultConfig>((a: FlagsToTest) => {
  return [FlagsToTest.flagA].includes(a);
}, DefaultConfig);

describe('ReduxFlagShaper', () => {
  describe('SelectorBuilder', () => {
    let state: ReduxState;

    beforeEach(() => {
      state = cloneDeep(MocketState);
    });

    it('Should allow not flagged states', () => {
      const selectorBuilder = new FakeReduxFlagShaper.SelectorBuilder<ReduxState>();

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
      type State = Modify<ReduxState, { prop4: Modify<IProp4, { test4: ModifyUsingInterface<ITest4, [
        [FlagsToTest.flagA, {
          addedInA: 'eythanWasHere';
        }]
      ]>; }>; }>;

      const state = MocketState as ExtractByFlags<State, [FlagsToTest.flagA]>;
      state.prop4.test4.addedInA = 'eythanWasHere';

      const selectorBuilder = new FakeReduxFlagShaper.SelectorBuilder<State>();
      const selector = selectorBuilder.createSelector(['prop4', 'test4', 'addedInA']);
      const selectedItem = selector(state);

      assertType<typeof selectedItem>().equals(state.prop4.test4.addedInA);
      expect(selectedItem).toEqual(state.prop4.test4.addedInA);
    });

    it('should allow full flagged states');
    it('should allow array Selections');

    it('should allow anidate selectors', () => {
      const selectorBuilder = new FakeReduxFlagShaper.SelectorBuilder<ReduxState>();

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