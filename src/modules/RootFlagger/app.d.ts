import {
  AnyObject,
  Cast,
  HasProperty,
  IsStrictObject,
  IteratorHKT,
  ModifyByKeyPlusOrderedCombinations,
  nLengthTuple,
  NonUndefined,
  Prettify,
  TupleReduceHKT,
} from 'readable-types';

import { IConfig, Metadata, MetadataKey } from '../shared/domain/interfaces';

type __ExtractByFlags<
  T,
  Flags extends [string, ...string[]] | [],
  KeyToDiscriminate extends string,
> = {
  [Key in keyof T as Key extends KeyToDiscriminate ? never : Key]: IsStrictObject<T[Key]> extends true
    ? ExtractByFlags<{ config: { keyForOverwrites: KeyToDiscriminate } }, Cast<T[Key], AnyObject>, Flags>
    : T[Key]
};

interface ReduceFlags<FlagsOnObject> extends IteratorHKT.Tuple {
  initialAcc: [];
  return: this['current'] extends FlagsOnObject ? _RT.Array.forceConcat<this['acc'], [this['current']]> : this['acc'];
}

type _ExtractByFlags<
  T extends Metadata<{ types: { [_ in KeyToDiscriminate]?: unknown[] } }>,
  Flags extends [string, ...string[]] | [],
  KeyToDiscriminate extends string,
  FilteredFlags = TupleReduceHKT<Flags, ReduceFlags< NonUndefined<NonUndefined<T[MetadataKey]>['types'][KeyToDiscriminate]>[number] > >,

> = HasProperty<T, MetadataKey> extends false
  ? __ExtractByFlags<T, Flags, KeyToDiscriminate>
  : Prettify<__ExtractByFlags<
  Extract< NonUndefined<T[MetadataKey]>['types'], FilteredFlags extends []
    ? { [_ in KeyToDiscriminate]?: undefined }
    : { [_ in KeyToDiscriminate]: FilteredFlags } >,
  Flags,
  KeyToDiscriminate
  >> & Metadata<T[MetadataKey]>;

/**
 *
 *
 *
 *
 *
 *
 */
export type ExtractByFlags<
  Shapper extends { config: { keyForOverwrites: string } },
  Type extends AnyObject,
  Flags extends [string, ...string[]] | [],
> = _ExtractByFlags<Type, Flags, Shapper['config']['keyForOverwrites']>;

/**
 *
 *
 *
 *
 *
 *
 */
export type OverwriteByFlag<
  Shapper extends { config: IConfig },
  TypeBeforeFlags,
  Overwrittes extends nLengthTuple<[NonUndefined<Shapper['config']['flags']>, AnyObject]>,
> = Prettify<TypeBeforeFlags> & Metadata<{
  types: ModifyByKeyPlusOrderedCombinations<TypeBeforeFlags, Overwrittes, Shapper['config']['keyForOverwrites']>;
}>;
// ---

// -- -- -- -- -- --
/* export type Concrete<T extends AnyObject> = Prettify<_Concrete<T>>;

type _Concrete<
  T extends Metadata<{ types: { flagToUse?: unknown[] } }>,
> = HasProperty<T, '__metadata'> extends false
  ? __ConcreteProperties<T>
  : __ConcreteProperties<NonUndefined<T['__metadata']>['types']>;

type __ConcreteProperties<T> = {
  [Key in keyof T]: IsStrictObject<T[Key]> extends true
    ? Concrete<T[Key]>
    : T[Key]
}; */