import { FlagsToTest, Shapper } from './initFlagger';
import { Add, IsUndefined, nLengthTuple } from 'readable-types';

type FunArgsByFlag<Original extends nLengthTuple<unknown>, Overrides extends nLengthTuple<[string, unknown]>> = {
  external: Original;
  internal: test<Original | Overrides[number][1]>;
};

type test<T, I = 0, result = [], current = T[I]> = IsUndefined<current> extends true ? result : test<T, Add<I, 1>, [...result, current]>;

type fnArgs = FunArgsByFlag<[a: string], [
  [FlagsToTest.flagA, [a: string | number, b: string]]
]>;

const funtionByFlag = <Args extends { internal: unknown[]; external: unknown[] }, Return>(fn: (...args: Args['internal']) => Return) => {
  return (...args: Args['external']): Return => {
    return fn(...args);
  };
};

export const FunctionToTest = funtionByFlag<fnArgs, string>((a, b) => {
  const param = Shapper.validator.isFlagEnabled(FlagsToTest.flagA) ? `${a}` : a;
  return param + '_XXX';
});