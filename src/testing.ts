import { FlagsToTest } from './tests/shared/common';
import { createSlice as createSliceFn, PayloadAction } from '@reduxjs/toolkit';
import { Component } from 'react';
import { connect as connectFn } from 'react-redux';
import { AnyObject, Cast, If, IsUndefined, IsUnknown, IteratorHKT, Modify, ModifyByKeyPlusOrderedCombinations, NonUndefined, Or, TupleIncludes, TupleReduceHKT } from 'readable-types';

import { ConfigToConnect } from './modules/jsx/infrastructure';
import { FlagShaper } from './modules/RootFlagger/infrastructure';

import { ExtractByFlags, ModifyUsingInterface } from '@modules/redux/Flagger/app';

const EnabledFeatures: FlagsToTest[] = [FlagsToTest.flagA];

type Flagger = typeof Flagger;
const Flagger = new FlagShaper((feature: FlagsToTest) => {
  return EnabledFeatures.includes(feature);
}, {
  keyForOverwrites: 'flagToUse',
  createSliceFn: createSliceFn,
  connectFn: connectFn,
});

const sum = Flagger.fn.callableIn(FlagsToTest.flagA, (a: number, b: number) => {
  return a + b;
});
console.log(sum(1, 3));

const sum2 = Flagger.fn.executableIn(FlagsToTest.flagA, (a: number, b: number) => {
  return a + b;
});
console.log(sum2(1, 4));

const testObj = Flagger.obj.overwriteOnDeclaration({
  prop1: 'test',
  prop2: 'test',
}, [
  [FlagsToTest.flagA, {
    prop3: 'new',
  }],
  [FlagsToTest.flagB, {
    prop4: 'new',
    prop1: 'overridedIn2',
  }],
  [FlagsToTest.flagC, {
    prop5: 'new',
    prop1: 123,
  }],
]);

if (
  Flagger.obj.wasObjectDeclaredWith(testObj, [FlagsToTest.flagC])
) {
  testObj;
}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ----- --------- -------- REDUX CREATING A STATE --------- --------- ----------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

interface OldITestDeep {
  testDeep1: number;
  testDeep2: number;
  testDeep3: number;
}

type ITestDeep = ModifyUsingInterface<Flagger, OldITestDeep, [
  [FlagsToTest.flagA, { testDeep1: string }],
  [FlagsToTest.flagC, { addedInC: boolean[] }]
]>;

interface OldIProp4 {
  test1: number;
  test2: string;
  test3: string;
  test4: ITestDeep;
}

type IProp4 = ModifyUsingInterface<Flagger, OldIProp4, [
  [FlagsToTest.flagA, { test1: string }],
  [FlagsToTest.flagB, { test2: number }]
]>;

interface OldReduxState {
  prop1: string[];
  prop2: string[];
  prop3: string[];
  prop4: IProp4;
}

export type ReduxStateType = ModifyUsingInterface<Flagger, OldReduxState, [
  [FlagsToTest.flagA, { prop3: number[] }],
  [FlagsToTest.flagB, { prop3: boolean[] }]
]>;

export const ReduxState = {} as ReduxStateType;

const ReduxStateFC = {} as ExtractByFlags<Flagger, ReduxStateType, [FlagsToTest.flagC]>;

const ReduxStateFA: ExtractByFlags<Flagger, ReduxStateType, [FlagsToTest.flagA]> = {
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

const selectorBuilder = Flagger.rx.getSelectorBuilder<ReduxStateType>();

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

if (Flagger.checker.isFlagEnabled(FlagsToTest.flagA)) {

}

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ----------------------- REACT CLASS WITH REDUX ----------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

interface testR2<KeyToFilter> extends IteratorHKT.Tuple<[string, {}]> {
  initialAcc: {};
  return: KeyToFilter extends this['current'][0]
    ? Modify<this['acc'], this['current'][1]>
    : this['acc'];
}

interface testR1 extends IteratorHKT.Tuple<[string, {}], [string, AnyObject][]> {
  initialAcc: [];
  return: TupleIncludes<this['acc'], this['current']> extends true
    ? this['acc']
    : [...this['acc'], [this['current'][0], TupleReduceHKT<this['tuple'], testR2<this['current'][0]>>]];
}

type DefaultValue<T, Default> = If<Or<[IsUnknown<T>, IsUndefined<T>]>, Default, T>;

interface MagnifigThing<T extends ConfigToConnect, Key extends string> {
  __metadata: T & {
    keyToMainObj: 'stateProps';
    keyToOverwrites: 'statePropsOverwrites';
  };

  ExternalProps: ModifyByKeyPlusOrderedCombinations<T['props'], NonUndefined<T['propsOverwrites']>, Key> & {};
  InternalState: ModifyByKeyPlusOrderedCombinations<T['internalState'], NonUndefined<T['internalStateOverwrites']>, Key>;
  ReduxStateProps: ModifyByKeyPlusOrderedCombinations<T['stateProps'], NonUndefined<T['statePropsOverwrites']>, Key> & {};
  ReduxDispatchProps: ModifyByKeyPlusOrderedCombinations<T['dispatchProps'], NonUndefined<T['dispatchPropsOverwrites']>, Key>;

  completeProps: ModifyByKeyPlusOrderedCombinations<
  Modify<Modify<T['props'], T['stateProps']>, T['dispatchProps']>,
  Cast<TupleReduceHKT<[
    ...Cast<DefaultValue<T['propsOverwrites'], []>, any[]>,
    ...Cast<DefaultValue<T['statePropsOverwrites'], []>, any[]>,
    ...Cast<DefaultValue<T['dispatchPropsOverwrites'], []>, any[]>,
  ], testR1>, [[string, AnyObject], ...[string, AnyObject][]]>,
  Key
  >;
}

interface IProps {
  prop1: '1';
  prop2: 1;
  prop3: null;
}

interface IState {
  state1: '1';
  state2: '2';
}

interface IMapStateToProps {
  stateToProp1: number;
}

interface testjsx {
  props: IProps;
  propsOverwrites: [
    [FlagsToTest.flagA, {
      prop1: 'overrided';
      prop2: 'overrided';
      prop3: 'overrided';
      prop_for_1: 'newProp';
    }],
    [FlagsToTest.flagB, {
      prop1: 'overridedIn2';
      prop2: 'overridedIn2';
      prop3: 'overridedIn2';
      prop_for_2: 'newProp';
    }],
  ];

  internalState: IState;
  internalStateOverwrites: [
    [FlagsToTest.flagA, {
      state1: string;
      state2: string;
      state_for_1: string;
    }],
    [FlagsToTest.flagB, {
      state1: string;
      state2: string;
      state_for_2: string;
    }],
  ];

  stateProps: IMapStateToProps;
  statePropsOverwrites: [
    [FlagsToTest.flagB, {
      stateToProp1: string[];
      stateToProp2: string;
    }],
  ];
}

type ComponentStateAndProps = MagnifigThing<testjsx, 'flagToUse'>;

const TestComponent = class TestClassComponent extends Component<ComponentStateAndProps['completeProps'], ComponentStateAndProps['InternalState']> {
  constructor(props: ComponentStateAndProps['completeProps']) {
    super(props);
    this.state = Flagger.obj.overwriteOnDeclaration({
      state1: '1',
      state2: '2',
    }, [
      [FlagsToTest.flagA, {
        state1: 'overrided',
        state2: 'overrided',
        state_for_1: 'newProp',
      }],
      [FlagsToTest.flagB, {
        state1: 'overridedIn2',
        state2: 'overridedIn2',
        state_for_2: 'newProp',
      }],
    ]);
  }

  render() {
    let a = this.props;

    a = {
      'flagToUse': [FlagsToTest.flagA],
      'prop1': '1',
      'prop2': 1,
      'prop3': null,
      'stateToProp1': 123,
    };

    if (Flagger.obj.wasObjectDeclaredWith(this.props, [FlagsToTest.flagB])) {
      this.props.flagToUse;
    }

    if (Flagger.obj.wasObjectDeclaredWith(this.props, [FlagsToTest.flagB, FlagsToTest.flagA])) {
      this.props.flagToUse;
    }

    if (Flagger.obj.wasObjectDeclaredWith(this.state, [FlagsToTest.flagA])) {
      this.state.flagToUse;
    }

    return undefined;
  }
};

const test = selectTest1({} as ReduxStateType);

const mapStateToProps = (state: ReduxStateType, ownProps: ComponentStateAndProps['ExternalProps']) => {
  return Flagger.obj.overwriteOnDeclaration<ComponentStateAndProps>({
    stateToProp1: selectTest1(state),
  }, [
    [FlagsToTest.flagB, {
      stateToProp1: selectTest1<['featureA']>(state),
      stateToProp2: selectTest2(state),
    }],
  ]);
};

const _P = Flagger.redux.connect<ComponentStateAndProps>(mapStateToProps)(TestComponent);

// ----------------------- CREATING REDUCER WITH REDUX ----------------------

const { createSlice, reducerByFlag } = Flagger.redux.getSliceTools<ReduxStateType>();

const _slice = createSlice({
  name: 'test',
  initialState: ReduxState,
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

const _sliceOld = createSliceFn({
  name: 'test',
  initialState: ReduxState as any,
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

_sliceOld.actions.setAddedInC;
_slice.actions.setAddedInC;

_sliceOld.actions.setProp3;
_slice.actions.setProp3;