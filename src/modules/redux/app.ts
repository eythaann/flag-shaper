import { IsUnknown, IteratorHKT, Modify, ModifyByKeyPlusOrderedCombinations, Prettify, TupleReduceHTK } from "readable-types";
import { Metadata } from "../shared/domain/interfaces";

export type ModifyUsingInterface<T, V, U = 'none'> = Modify<T, Metadata<{
  unique: U;
  types: ModifyByKeyPlusOrderedCombinations<T, V> & {};
}>>;

type __ExtractByFlags<
  T,
  Flags extends [string, ...string[]] | []
> = { 
  [Key in keyof T as Key extends '__key' ? never : Key]: IsUnknown<_RT.ForceExtract<T[Key], '__metadata'>> extends true 
    ? T[Key] 
    : ExtractByFlags<T[Key], Flags>
}

interface ReduceFlags<FlagsOnObject> extends IteratorHKT.Tuple {
  initialAcc: [];
  return: this['current'] extends FlagsOnObject ? _RT.Array.forceConcat<this['acc'], [this['current']]> : this['acc'];
}


export type _ExtractByFlags<
  T extends Metadata<{ types: { __key?: unknown[] } }>,
  Flags extends [string, ...string[]] | [],

  FilteredFlags = TupleReduceHTK<Flags, ReduceFlags< NonNullable<NonNullable<T['__metadata']>['types']['__key']>[number] > >,

> = Prettify<__ExtractByFlags<
  Extract< NonNullable<T['__metadata']>['types'], FilteredFlags extends [] ? { __key?: undefined } : { __key: FilteredFlags } >,
  Flags
>> & Metadata<T['__metadata']>


export type ExtractByFlags<
  Type extends Metadata<{ types: { __key?: unknown[] } }>,
  Flags extends [string, ...string[]] | [],
> = Prettify<_ExtractByFlags<Type, Flags>>
