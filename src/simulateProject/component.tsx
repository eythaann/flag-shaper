import { actions, Flagger, ReduxStateType, selectAddedInC, selectTest1 } from './testing';
import React, { Component, useState } from 'react';
import { Prettify } from 'readable-types';
import { FlagsToTest } from 'tests/shared/common';

import { MagnifigThing } from '@modules/jsx/domain';

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

interface IMapDispatchToProps {
  setProp3: typeof actions.setProp3;
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
    [FlagsToTest.flagC, {
      addedInC: boolean[];
    }]
  ];

  dispatchProps: IMapDispatchToProps;
  dispatchPropsOverwrites: [
    [FlagsToTest.flagC, {
      setAddedInC: typeof actions.setAddedInC;
    }]
  ];
}

type ComponentStateAndProps = MagnifigThing<Flagger, testjsx>;

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

    this.props.setProp3([1, 2, 3]);

    this.props.setProp3(['1', '2', '3']);

    if (Flagger.obj.wasObjectDeclaredWith(this.props, [FlagsToTest.flagC])) {
      this.props.setAddedInC({ test: '123' });
    }
    /*
    if (Flagger.obj.wasObjectDeclaredWith(this.props, [FlagsToTest.flagB, FlagsToTest.flagA])) {
      this.props.flagToUse;
    }

    if (Flagger.obj.wasObjectDeclaredWith(this.state, [FlagsToTest.flagA])) {
      this.state.flagToUse;
    } */

    return undefined;
  }
};

const mapStateToProps = (state: ReduxStateType, ownProps: ComponentStateAndProps['ExternalProps']): ComponentStateAndProps['ReduxStateProps'] => {
  return Flagger.obj.overwriteOnDeclaration({
    stateToProp1: selectTest1(state),
  }, [
    [FlagsToTest.flagB, {
      stateToProp1: ['123'],
      stateToProp2: '123',
    }],
    [FlagsToTest.flagC, () => {
      const concreteState = Flagger.rx.concrete(state, [FlagsToTest.flagC]);

      return {
        addedInC: selectAddedInC(concreteState),
      };
    }],
  ]);
};

const mapDispatchToProps = Flagger.obj.overwriteOnDeclaration({
  setProp3: actions.setProp3,
}, [
  [FlagsToTest.flagC, {
    setAddedInC: actions.setAddedInC,
  }],
]);

type _AA = Prettify<ComponentStateAndProps['ReduxStateProps']>;

const TestFlaggedComponent = Flagger.redux.connect<ComponentStateAndProps>(mapStateToProps, mapDispatchToProps)(TestComponent);

// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================

export const A = (_props: ComponentStateAndProps['ExternalProps']) => {
  const [state, setState] = useState<ComponentStateAndProps['InternalState']>();

  return <TestFlaggedComponent
    flagToUse={[FlagsToTest.flagB]}
    prop1="overridedIn2"
    prop2="overridedIn2"
    prop3="overridedIn2"
    prop_for_2="newProp"
  >

  </TestFlaggedComponent>;
};