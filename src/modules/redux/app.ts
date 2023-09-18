import { AnyObject, IsStrictObject, IsUnknown, IteratorHKT, KeyOfObject, KeysOfUnion, Modify, ModifyByKeyPlusOrderedCombinations, Prettify, TupleReduceHTK } from 'readable-types';
import { Metadata } from '../shared/domain/interfaces';

export type ModifyUsingInterface<T, V, U = 'none'> = Modify<T, Metadata<{
  unique: U;
  types: ModifyByKeyPlusOrderedCombinations<T, V> & {};
}>>;

type __ExtractByFlags<
  T,
  Flags extends [string, ...string[]] | []
> = {
  [Key in keyof T as Key extends '__key' ? never : Key]: IsStrictObject<T[Key]> extends true
    ? ExtractByFlags<T[Key], Flags>
    : T[Key]
};

interface ReduceFlags<FlagsOnObject> extends IteratorHKT.Tuple {
  initialAcc: [];
  return: this['current'] extends FlagsOnObject ? _RT.Array.forceConcat<this['acc'], [this['current']]> : this['acc'];
}

export type _ExtractByFlags<
  T extends Metadata<{ types: { __key?: unknown[] } }>,
  Flags extends [string, ...string[]] | [],

  FilteredFlags = TupleReduceHTK<Flags, ReduceFlags< NonNullable<NonNullable<T['__metadata']>['types']['__key']>[number] > >,

> = IsUnknown<T['__metadata']> extends true
  ? __ExtractByFlags<T, Flags>
  : Prettify<__ExtractByFlags<
  Extract< NonNullable<T['__metadata']>['types'], FilteredFlags extends [] ? { __key?: undefined } : { __key: FilteredFlags } >,
  Flags
  >> & Metadata<T['__metadata']>;

export type ExtractByFlags<
  Type extends AnyObject,
  Flags extends [string, ...string[]] | [],
> = Prettify<_ExtractByFlags<Type, Flags>>;

// ---

interface extractTypeFormPath<state> extends IteratorHKT.Tuple {
  initialAcc: state;
  return: _RT.ForceExtract<this['acc'], this['current']>;
}

export type SelectorByFlag<State extends AnyObject, Path extends unknown[]> = (
  <S extends IsUnknown<State['__metadata']> extends false
    ? S['__metadata'] extends State['__metadata']
      ? Metadata<State['__metadata']>
      : Required<Metadata<State['__metadata']>>
    : State
  >(state: S) => TupleReduceHTK<Path, extractTypeFormPath<S>>
) & Metadata<Path>;

export type getAllPosibleKeys<
  State,
  Fn extends Metadata,
  R = TupleReduceHTK<NonNullable<Fn['__metadata']>, extractTypeFormPath<State>>
> = IsUnknown<_RT.ForceExtract<R, '__metadata'>> extends true
  ? keyof R
  : Exclude<KeysOfUnion<_RT.ForceExtract<NonNullable<_RT.ForceExtract<R, '__metadata'>>, 'types'>>, '__key'>;