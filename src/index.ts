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
