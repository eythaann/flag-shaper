import { FlagsToTest } from '../shared/common';
import { IProp4, ITest4, ITestDeep4, ReduxState } from './mockets';
import { Modify } from 'readable-types';

import { getAllPosibleKeys, ModifyUsingInterface } from '../../modules/redux/Flagger/app';

import { Metadata } from '../../modules/shared/domain/interfaces';

describe('getAllPosibleKeys', () => {
  it('Should give me the keys of path', () => {
    type test1 = getAllPosibleKeys<ReduxState, Metadata<[]>>;
    type test2 = getAllPosibleKeys<ReduxState, Metadata<['prop4']>>;

    assertType<test1>().equals<'prop1' | 'prop2' | 'prop3' | 'prop4'>();
    assertType<test2>().equals<'test1' | 'test2' | 'test3' | 'test4' | 'test4_2'>();
  });

  it('Should give me the keys of metadata on path', () => {
    type State = Modify<ReduxState, { prop4: Modify<IProp4, { test4: Modify<ITest4, { testDeep4: ModifyUsingInterface<ITestDeep4, [
      [FlagsToTest.flagA, {
        addedInA: 'eythanWasHere';
      }]
    ]>; }>; }>; }>;

    type test = getAllPosibleKeys<State, Metadata<['prop4', 'test4', 'testDeep4']>>;
    assertType<test>().equals<'reallyDeep1' | 'reallyDeep2' | 'reallyDeep3' | 'addedInA'>();
  });
});