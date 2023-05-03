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
}

class TestClassComponent extends FlagByEnv.jsx.Component<IProps, {
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
}, IState> {
  
  render() {
    this.props;
    //   ^?
    return null;
  }
}