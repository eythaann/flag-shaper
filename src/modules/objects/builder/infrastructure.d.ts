import { AnyFunction, AnyObject, Cast, IsFunction, IteratorHKT, ModifyByKeyPlusOrderedCombinations, Prettify, TupleMapHKT } from 'readable-types';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';

interface FnToObj extends IteratorHKT.Tuple<[string, AnyObject]> {
  return: [
    this['current'][0],
    IsFunction<this['current'][1]> extends true
      ? ReturnType<Cast<this['current'][1], AnyFunction>>
      : this['current'][1]
  ];
}
type OverFnToOverObj<T extends unknown[]> = TupleMapHKT<T, FnToObj>;

/* type Inferable =
  | null
  | string
  | number
  | boolean
  | AnyFunction
  | Array<JSON>
  | {
    [prop: string]: Inferable;
  }; */

export class ObjectBuilder<
  Flag extends AllowedFlags,
  Config extends IConfig,
  Over extends [Flag, AnyObject][] = [],
  ObjToApply extends AnyObject = {}
> extends BaseFlagger<Flag, Config> {
  addCase<F extends Flag, V extends AnyObject>(flag: F, x: V): ObjectBuilder<Flag, Config, [...Over, [F, V]], ObjToApply>;

  get overrides(): Over;

  setObjToOverwrite<T extends AnyObject>(obj: T): ObjectBuilder<Flag, Config, Over, T>;

  // IDEA is util but not SO util.
  /*match<
    T extends [If<IsUnknown<TypeInMetadata>, T, TypeInMetadata>] extends [TypeOnBuild]
      ? any
      : { Ups: 'You\'re actual config to build will not create the extected type' },
    TypeInMetadata = _RT.ForceExtract<NonUndefined<_RT.ForceExtract<T, '__metadata'>>, 'types'>,
    TypeOnBuild = ModifyByKeyPlusOrderedCombinations<ObjToApply, OverFnToOverObj<Over>, Config['keyForOverwrites']>,
  >(): this;
  */

  build(config?: { forState?: boolean; forDispatch?: boolean }): Prettify<ModifyByKeyPlusOrderedCombinations<ObjToApply, OverFnToOverObj<Over>, Config['keyForOverwrites']>>;
}