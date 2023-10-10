import { FlagsToTest, Shapper } from './initFlagger';
import React from 'react';

import { CreateFlaggedInterface } from '../../src/modules/RootFlagger/app';

type Props = CreateFlaggedInterface<{
  prop1: string;
  prop2: string;
  prop3: string;
}, [
  [FlagsToTest.flagA, {
    prop_for_1: string;
  }],
  [FlagsToTest.flagB, {
    prop_for_2: string;
  }],
]>;

export const A = (props: Props) => {
/* const [state, setState] = useState(Shapper.getValueByFlag(0, [
    on(FlagsToTest.flagA).use(5),
    on(FlagsToTest.flagB).use(20),
  ])); */

  const { prop_for_1 } = Shapper.softConcrete(props, FlagsToTest.flagA) || {};
  const { prop_for_2 } = Shapper.softConcrete(props, FlagsToTest.flagB) || {};

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
          prop2="2"
          prop3="3"
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