import { FlagsToTest, Shapper } from './initFlagger';

const obj = Shapper.obj.builder()
  .setObjToOverwrite({
    prop1: 'Test with flagger',
  })
  .addCase(FlagsToTest.flagA, {
    prop2: 'Hellow',
  })
  .addCase(FlagsToTest.flagB, {
    prop3: 'world',
  })
  .build();

console.log(obj);