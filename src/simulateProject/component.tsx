import { Shapper } from './initFlagger';
import { selectAddedInC, selectTest1 } from './selectors';
import { actions } from './slice';
import { ReduxStateType } from './state';
import React, { Component, useState } from 'react';
import { FlagsToTest } from 'tests/shared/common';

import { on } from 'modules/helpers/app';

import { MagnifigThing } from 'modules/jsx/domain';

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

type ComponentStateAndProps = MagnifigThing<Shapper, testjsx>;

const TestComponent = class TestClassComponent extends Component<ComponentStateAndProps['completeProps'], ComponentStateAndProps['InternalState']> {
  constructor(props: ComponentStateAndProps['completeProps']) {
    super(props);
    this.state = Shapper.obj.builder()
      .setObjToOverwrite({
        state1: '1',
        state2: '2',
      })
      .addCase(FlagsToTest.flagA, {
        state1: 'overrided',
        state2: 'overrided',
        state_for_1: 'newProp',
      })
      .addCase(FlagsToTest.flagB, {
        state1: 'overridedIn2',
        state2: 'overridedIn2',
        state_for_2: 'newProp',
      })
      .build();
  }

  render() {
    let a = this.props;

    this.props.setProp3([1, 2, 3]);

    this.props.setProp3(['1', '2', '3']);

    if (Shapper.obj.wasObjectDeclaredWith(this.props, [FlagsToTest.flagC])) {
      this.props.setAddedInC({ test: '123' });
    }
    /*
    if (Shapper.obj.wasObjectDeclaredWith(this.props, [FlagsToTest.flagB, FlagsToTest.flagA])) {
      this.props.flagToUse;
    }

    if (Shapper.obj.wasObjectDeclaredWith(this.state, [FlagsToTest.flagA])) {
      this.state.flagToUse;
    } */

    return undefined;
  }
};

const mapStateToProps = (state: ReduxStateType, ownProps: ComponentStateAndProps['ExternalProps']): ComponentStateAndProps['ReduxStateProps'] => {
  //
  // ...some code
  //

  return Shapper.obj.builder()
    .setObjToOverwrite({
      stateToProp1: selectTest1(state),
    })
    .addCase(FlagsToTest.flagB, {
      stateToProp1: ['123'],
      stateToProp2: '123',
    })
    .addCase(FlagsToTest.flagC, () => {
      const concreteState = Shapper.concrete(state, [FlagsToTest.flagC]);

      return {
        addedInC: selectAddedInC(concreteState),
      };
    })
    .build();
};

const mapDispatchToProps = Shapper.obj.builder()
  .setObjToOverwrite({
    setProp3: actions.setProp3,
  })
  .addCase(FlagsToTest.flagC, {
    setAddedInC: actions.setAddedInC,
  })
  .build();

const TestFlaggedComponent = Shapper.redux.connect<ComponentStateAndProps>(mapStateToProps, mapDispatchToProps)(TestComponent);

// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================

export const A = (_props: ComponentStateAndProps['ExternalProps']) => {
  const [state, setState] = useState(Shapper.getValueByFlag(0, [
    on(FlagsToTest.flagA).use(5),
    on(FlagsToTest.flagB).use(20),
  ]));

  return <TestFlaggedComponent
    flagToUse={[FlagsToTest.flagB]}
    prop1="overridedIn2"
    prop2="overridedIn2"
    prop3="overridedIn2"
    prop_for_2="newProp"
  >
    <div>
      <div>
        <div>
          <span> WOWWWWWWWW </span>
        </div>
      </div>
    </div>
  </TestFlaggedComponent>;
};
