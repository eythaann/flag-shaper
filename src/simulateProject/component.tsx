import { FlagsToTest } from '../../__tests__/shared/common';
import { Shapper } from './initFlagger';
import { selectAddedInC, selectTest1 } from './selectors';
import { actions } from './slice';
import { ReduxStateType } from './state';
import React, { Component, useState } from 'react';

import { on } from '../modules/helpers/app';

import { MagnifigThing } from '../modules/jsx/domain';

interface IProps {
  prop1: '1';
  prop2: 1;
  prop3: null;
}

interface IState {
  state1: number;
  state2: number;
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
      state1: number;
      state2: number;
      state_for_2: number;
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

type ComponentInterfaces = MagnifigThing<testjsx>;

class TestComponent extends Component<ComponentInterfaces['completeProps'], ComponentInterfaces['InternalState']> {
  constructor(props: ComponentInterfaces['completeProps']) {
    super(props);
    this.state = Shapper.obj.builder()
      .setObjToOverwrite({
        state1: 1,
        state2: 2,
      })
      .addCase(FlagsToTest.flagA, {
        state1: 'overrided',
        state2: 'overrided',
        state_for_1: 'newProp',
      })
      .addCase(FlagsToTest.flagB, {
        state1: 1,
        state2: 2,
        state_for_2: 3,
      })
      .build();
  }

  render() {
    let a = this.props;

    this.props.setProp3([1, 2, 3]);

    this.props.setProp3(['1', '2', '3']);

    const { setAddedInC } = Shapper.softConcrete(this.props, FlagsToTest.flagC) || {};
    setAddedInC?.({ test: '123' });

    if (Shapper.obj.wasObjectDeclaredWith(this.props, [FlagsToTest.flagB, FlagsToTest.flagA])) {
      this.props.stateToProp2;
    }

    if (Shapper.obj.wasObjectDeclaredWith(this.state, [FlagsToTest.flagA])) {
      this.state.flagToUse;
    }

    return undefined;
  }
};

const mapStateToProps = (state: ReduxStateType, ownProps: ComponentInterfaces['OwnProps']) => {
  //
  // ...some code
  //

  return Shapper.obj.builder()
    .setObjToOverwrite({
      stateToProp1: selectTest1(state),
    })
    .addCase(FlagsToTest.flagB, () => {
      const stateA = Shapper.concrete(state, FlagsToTest.flagB);
      return {
        stateToProp1: ['123'],
        stateToProp2: '123',
      };
    })
    .addCase(FlagsToTest.flagC, () => {
      const concreteState = Shapper.concrete(state, [FlagsToTest.flagC]);

      return {
        addedInC: selectAddedInC(concreteState),
      };
    })
    .build({ forState: true });
};

const mapDispatchToProps = Shapper.obj.builder()
  .setObjToOverwrite({
    setProp3: actions.setProp3,
  })
  .addCase(FlagsToTest.flagC, {
    setAddedInC: actions.setAddedInC,
  })
  .build({ forDispatch: true });

const TestFlaggedComponent = Shapper.redux.connect<ComponentInterfaces>(mapStateToProps, mapDispatchToProps)(TestComponent);

// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================
// ==================================================

export const A = (_props: ComponentInterfaces['OwnProps']) => {
  const [state, setState] = useState(Shapper.getValueByFlag(0, [
    on(FlagsToTest.flagA).use(5),
    on(FlagsToTest.flagB).use(20),
  ]));

  const { prop_for_1 } = Shapper.softConcrete(_props, FlagsToTest.flagA) || {};
  const { prop_for_2 } = Shapper.softConcrete(_props, FlagsToTest.flagB) || {};

  return <div>
    <div>
      <Shapper.jsx.Toggle
        flags={FlagsToTest.flagB}
        on={
          <span>{prop_for_2}</span>
        }
        off={
          <Shapper.jsx.RenderIn flags={FlagsToTest.flagA}>
            <span>{prop_for_1}</span>
          </Shapper.jsx.RenderIn>
        }
      />
    </div>
  </div>;
};

/* const B = ({ children }: { children: typeof A }) => {
  return <div>
    {children}
  </div>;
}; */

const C = () => {
  return <div>
    <div>
      <Shapper.jsx.UnRenderIn flags={FlagsToTest.flagC}>
        <Shapper.jsx.RenderIn
          flags={[FlagsToTest.flagA, FlagsToTest.flagB]}
          component={A}
          props={{
            prop1: 'overridedIn2',
            prop2: 'overridedIn2',
            prop3: 'overridedIn2',
            prop_for_1: 'newProp',
            prop_for_2: 'newProp',
          }}
        />
      </Shapper.jsx.UnRenderIn>
      <Shapper.jsx.UnRenderIn flags={[FlagsToTest.flagA, FlagsToTest.flagB]}>
        <A
          prop1="1"
          prop2={1}
          prop3={null}
        />
      </Shapper.jsx.UnRenderIn>
      <Shapper.jsx.UnRenderIn flags={FlagsToTest.flagA}>
        <div>
          old content in A;
        </div>
      </Shapper.jsx.UnRenderIn>
    </div>
  </div>;
};