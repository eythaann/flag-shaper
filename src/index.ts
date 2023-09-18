import { Component } from 'react';
import { connect } from 'react-redux';
import { Cast, If, IsUndefined, IsUnknown, IteratorHKT, Modify, ModifyByKeyPlusOrderedCombinations, Or, TupleIncludes, TupleReduceHTK } from 'readable-types';
import { FlagShaper } from './modules';
import { ConfigToConnect, FSConnectCreator } from './modules/jsx';
import { ReduxState, selectTest1, selectTest2 } from './modules/redux/index.test-types';

enum Features {
  feature1 = 'feature1',
  feature2 = 'feature2',
  feature3 = 'feature3',
}

const CustomConnect = FSConnectCreator(connect);

const EnabledFeatures: Features[] = [Features.feature1];

const FlagByEnv = new FlagShaper((feature: Features) => {
  return EnabledFeatures.includes(feature);
}, { keyForOverwrites: 'flagToUse' });

const sum = FlagByEnv.fn.callableIn(Features.feature1, (a: number, b: number) => {
  return a + b;
});
console.log(sum(1, 3));

const sum2 = FlagByEnv.fn.executableIn(Features.feature3, (a: number, b: number) => {
  return a + b;
});
console.log(sum2(1, 4));

const testObj = FlagByEnv.obj.overwriteOnDeclaration({
  prop1: 'test',
  prop2: 'test',
}, [
  [Features.feature1, {
    prop3: 'new',
  }],
  [Features.feature2, {
    prop4: 'new',
    prop1: 'overridedIn2',
  }],
  [Features.feature3, {
    prop5: 'new',
    prop1: 123,
  }],
]);

if (
  FlagByEnv.obj.wasObjectDeclaredWith(testObj)
) {
  testObj;
}

// ----- --------- --------- --------- --------- --------- --------- ----------

interface testR2<KeyToFilter> extends IteratorHKT.Tuple<[string, {}]> {
  initialAcc: {};
  return: KeyToFilter extends this['current'][0]
    ? Modify<this['acc'], this['current'][1]>
    : this['acc'];
}

interface testR1 extends IteratorHKT.Tuple<[string, {}]> {
  initialAcc: [];
  return: TupleIncludes<this['acc'], this['current']> extends true
    ? this['acc']
    : _RT.Array.forceConcat<this['acc'], [[this['current'][0], TupleReduceHTK<this['tuple'], testR2<this['current'][0]>>]]>;
}

type DefaultValue<T, Default> = If<Or<[IsUnknown<T>, IsUndefined<T>]>, Default, T>;

interface MagnifigThing<T extends ConfigToConnect, Key extends string> {
  __metadata: T & {
    keyToMainObj: 'stateProps';
    keyToOverwrites: 'statePropsOverwrites';
  };

  ExternalProps: ModifyByKeyPlusOrderedCombinations<T['props'], T['propsOverwrites'], Key> & {};
  InternalState: ModifyByKeyPlusOrderedCombinations<T['internalState'], T['internalStateOverwrites'], Key>;
  ReduxStateProps: ModifyByKeyPlusOrderedCombinations<T['stateProps'], T['statePropsOverwrites'], Key> & {};
  ReduxDispatchProps: ModifyByKeyPlusOrderedCombinations<T['dispatchProps'], T['dispatchPropsOverwrites'], Key>;

  completeProps: ModifyByKeyPlusOrderedCombinations<
  Modify<Modify<T['props'], T['stateProps']>, T['dispatchProps']>,
  TupleReduceHTK<[
    ...Cast<DefaultValue<T['propsOverwrites'], []>, any[]>,
    ...Cast<DefaultValue<T['statePropsOverwrites'], []>, any[]>,
    ...Cast<DefaultValue<T['dispatchPropsOverwrites'], []>, any[]>,
  ], testR1>,
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
    [Features.feature1, {
      prop1: 'overrided';
      prop2: 'overrided';
      prop3: 'overrided';
      prop_for_1: 'newProp';
    }],
    [Features.feature2, {
      prop1: 'overridedIn2';
      prop2: 'overridedIn2';
      prop3: 'overridedIn2';
      prop_for_2: 'newProp';
    }],
  ];

  internalState: IState;
  internalStateOverwrites: [
    [Features.feature1, {
      state1: string;
      state2: string;
      state_for_1: string;
    }],
    [Features.feature2, {
      state1: string;
      state2: string;
      state_for_2: string;
    }],
  ];

  stateProps: IMapStateToProps;
  statePropsOverwrites: [
    [Features.feature2, {
      stateToProp1: string[];
      stateToProp2: string;
    }],
  ];
}

type ComponentStateAndProps = MagnifigThing<testjsx, 'flagToUse'>;

const TestComponent = class TestClassComponent extends Component<ComponentStateAndProps['completeProps'], ComponentStateAndProps['InternalState']> {
  constructor(props: ComponentStateAndProps['completeProps']) {
    super(props);
    this.state = FlagByEnv.obj.overwriteOnDeclaration({
      state1: '1',
      state2: '2',
    }, [
      [Features.feature1, {
        state1: 'overrided',
        state2: 'overrided',
        state_for_1: 'newProp',
      }],
      [Features.feature2, {
        state1: 'overridedIn2',
        state2: 'overridedIn2',
        state_for_2: 'newProp',
      }],
    ]);
  }

  render() {
    if (FlagByEnv.obj.wasObjectDeclaredWith(this.props, [Features.feature2])) {
      this.props.flagToUse;
    }

    if (FlagByEnv.obj.wasObjectDeclaredWith(this.props, [Features.feature2, Features.feature1])) {
      this.props.flagToUse;
    }

    if (FlagByEnv.obj.wasObjectDeclaredWith(this.state, [Features.feature1])) {
      this.state.flagToUse;
    }

    return undefined;
  }
};

const test = selectTest1({} as ReduxState);

const mapStateToProps = (state: ReduxState, ownProps: ComponentStateAndProps['ExternalProps']) => {
  return FlagByEnv.obj.overwriteOnDeclaration<ComponentStateAndProps>({
    stateToProp1: selectTest1(state),
  }, [
    [Features.feature2, {
      stateToProp1: selectTest1<['featureA']>(state),
      stateToProp2: selectTest2(state),
    }],
  ]);
};

const P = CustomConnect<ComponentStateAndProps>(mapStateToProps)(TestComponent);