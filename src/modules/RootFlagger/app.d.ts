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

import { DUnionKey } from '../shared/domain/constants';
import { IConfig, Metadata, MetadataKey } from '../shared/domain/interfaces';

type __ExtractByFlags<
  T,
  Flags extends [string, ...string[]] | [],
> = {
  [Key in keyof T as Key extends DUnionKey ? never : Key]: IsStrictObject<T[Key]> extends true
    ? ApplyFlagsOnType<Cast<T[Key], AnyObject>, Flags>
    : T[Key]
};

interface ReduceFlags<FlagsOnObject> extends IteratorHKT.Tuple {
  initialAcc: [];
  return: this['current'] extends FlagsOnObject ? _RT.Array.forceConcat<this['acc'], [this['current']]> : this['acc'];
}

type _ExtractByFlags<
  T extends Metadata<{ types: { [DUnionKey]?: unknown[] } }>,
  Flags extends [string, ...string[]] | [],

  FilteredFlags = TupleReduceHKT<Flags, ReduceFlags< NonUndefined<NonUndefined<T[MetadataKey]>['types'][DUnionKey]>[number] > >,

> = HasProperty<T, MetadataKey> extends false
  ? __ExtractByFlags<T, Flags>
  : Prettify<__ExtractByFlags<
  Extract< NonUndefined<T[MetadataKey]>['types'], FilteredFlags extends []
    ? { [DUnionKey]?: undefined }
    : { [DUnionKey]: FilteredFlags } >,
  Flags
  >> & Metadata<T[MetadataKey]>;

/**
 *
 *
 *
 *
 *
 *
 */
export type ApplyFlagsOnType<
  Type extends AnyObject,
  Flags extends [string, ...string[]] | [],
> = _ExtractByFlags<Type, Flags>;

/**
 *
 *
 *
 *
 *
 *
 */
export type CreateFlaggedInterface<
  TypeBeforeFlags,
  Overwrittes extends nLengthTuple<[string, AnyObject]>,
> = Prettify<TypeBeforeFlags> & Metadata<{
  types: ModifyByKeyPlusOrderedCombinations<TypeBeforeFlags, Overwrittes, DUnionKey>;
}>;

/**
 *
 *
 *
 */
export type HiddenToExplicit<T extends Metadata<{ types: unknown }>> = NonUndefined<T[MetadataKey]>['types'];
export type ExplicitToHidden<T> = Metadata<{ types: T }>;
