import { If, IsNever, IsUndefined, Or } from "readable-types";
import { FlagShaper } from "./modules";


enum Features {
  feature1 = 'feature1',
  feature2 = 'feature2',
  feature3 = 'feature3',
}


const EnabledFeatures: Features[] = [Features.feature1];


const FlagByEnv = new FlagShaper<Features>((feature) => {
  return EnabledFeatures.includes(feature)
})


const sum = FlagByEnv.fn.callableIn(Features.feature1, (a: number, b: number) => {
  return a + b;
})
console.log(sum(1, 3))


const sum2 = FlagByEnv.fn.executableIn(Features.feature3, (a: number, b: number) => {
  return a + b;
})
console.log(sum2(1, 4))


const testObj = FlagByEnv.obj.overrideOnDeclaration({
  prop1: 'test',
  prop2: 'test',
}, {
  feature1: {
    prop3: 'new',
  },
  feature2: {
    prop4: 'new',
    prop1: 'overrided',
  }
})

interface IProps {
  prop1: "1",
  prop2: 1,
  prop3: null,
}

interface IState {
  state1: "1",
  state2: "2",
}

const TestComponent = class TestClassComponent extends FlagByEnv.jsx.Component<IProps, {
  [Features.feature1]: {
    prop1: "overrided",
    prop2: "overrided",
    prop3: "overrided",
    prop_for_1: "newProp",
  },
  [Features.feature2]: {
    prop1: "overridedIn2",
    prop2: "overridedIn2",
    prop3: "overridedIn2",
    prop_for_2: "newProp"
  },
}, IState, {
  [Features.feature1]: {
    state1: "overrided",
    state2: "overrided",
    state_for_1: "newProp",
  },
  [Features.feature2]: {
    state1: "overridedIn2",
    state2: "overridedIn2",
    state_for_2: "newProp"
  },
}> {
  render() {
    if(this.isFlagEnabled(Features.feature1, this.state) && this.isFlagEnabled(Features.feature1, this.props)) {
      this.props.flagToUse
    }

    if (this.isFlagEnabled(Features.feature1, this.props)) {
      
    }

    return null;
  }
}
type modifyByFlagExtractor<T, Flag = never> = Or<[IsNever<Flag>, IsUndefined<Flag>]> extends true 
  ? Omit<Extract<T, {__FLAG__?: undefined}>, '__FLAG__'>
  : Omit<Extract<T, {__FLAG__: Flag}>, '__FLAG__'>

const _testAPlaceholder = FlagByEnv.obj.modifyByFlagCreator<{
  prop1: '1',
  prop2: '2',
  prop3: '3',
}, {
  [Features.feature1]: {
    prop3: 'modified in 1',
    newProp: 'added in 1',
  },
  [Features.feature2]: {
    prop3: 'modified in 2',
    newProp2: 'added in 2',
  },
}>();

type testA<Flag = undefined> = modifyByFlagExtractor<typeof _testAPlaceholder, Flag>;

type testB = testA
//   ^?
type testC = testA<Features.feature1>
//   ^?
type testD = testA<Features.feature2>
//   ^?
