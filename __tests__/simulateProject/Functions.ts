import { FlagsToTest } from './initFlagger';
import { AnyFunction, ValueOf } from 'readable-types';

import { DefaultValue } from '../../src/modules/jsx/domain';

declare function funtionByFlag<
  OriginalFn extends AnyFunction,
  Overrides extends Record<string, AnyFunction>
>(internalFn: (config: {
  calledWith: string;
  args: Parameters<ValueOf<Overrides>> | Parameters<OriginalFn>;
}) => any): OriginalFn & {
  callWith<F extends string, FnToCall extends AnyFunction = DefaultValue<Overrides[F], OriginalFn>>(flag: F, ...args: Parameters<FnToCall>): ReturnType<FnToCall>;
  executeWith<F extends string, FnToCall extends AnyFunction = DefaultValue<Overrides[F], OriginalFn>>(flag: F, ...args: Parameters<FnToCall>): ReturnType<FnToCall> | undefined;
};

//
//
//
//

//
//
//
//

//
//
//
//

type OniginalType = () => 1;
type NewTypes = {
  [FlagsToTest.flagA]: () => 2;
};
export const GiveMagicNumber = funtionByFlag<OniginalType, NewTypes>(({ calledWith, args }) => {
  const [] = args;

  return {
    prop1: calledWith === FlagsToTest.flagA ? 2 : 1,
  };
});

const test = GiveMagicNumber.callWith(FlagsToTest.flagA);
const test2 = GiveMagicNumber.executeWith(FlagsToTest.flagA);