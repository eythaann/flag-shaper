import { AnyObject, IsStrictObject, IsUnknown, IteratorHKT, NonUndefined, KeysOfUnion, Modify, ModifyByKeyPlusOrderedCombinations, Prettify, TupleReduceHKT, HasProperty } from 'readable-types';
import { Metadata } from '../shared/domain/interfaces';

export type ModifyUsingInterface<T, V, U = 'none'> = Modify<T, Metadata<{
  unique: U;
  types: ModifyByKeyPlusOrderedCombinations<T, V, 'flagToUse'> & {};
}>>;

type __ExtractByFlags<
  T,
  Flags extends [string, ...string[]] | []
> = {
  [Key in keyof T as Key extends 'flagToUse' ? never : Key]: IsStrictObject<T[Key]> extends true
    ? ExtractByFlags<T[Key], Flags>
    : T[Key]
};

interface ReduceFlags<FlagsOnObject> extends IteratorHKT.Tuple {
  initialAcc: [];
  return: this['current'] extends FlagsOnObject ? _RT.Array.forceConcat<this['acc'], [this['current']]> : this['acc'];
}

export type _ExtractByFlags<
  T extends Metadata<{ types: { flagToUse?: unknown[] } }>,
  Flags extends [string, ...string[]] | [],

  FilteredFlags = TupleReduceHKT<Flags, ReduceFlags< NonUndefined<NonUndefined<T['__metadata']>['types']['flagToUse']>[number] > >,

> = HasProperty<T, '__metadata'> extends false
  ? __ExtractByFlags<T, Flags>
  : Prettify<__ExtractByFlags<
  Extract< NonUndefined<T['__metadata']>['types'], FilteredFlags extends [] ? { flagToUse?: undefined } : { flagToUse: FilteredFlags } >,
  Flags
  >>;

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
  >(state: S) => TupleReduceHKT<Path, extractTypeFormPath<S>>
) & Metadata<Path>;

export type getAllPosibleKeys<
  State,
  Fn extends Metadata<string[]>,
  R = TupleReduceHKT<NonUndefined<Fn['__metadata']>, extractTypeFormPath<State>>
> = HasProperty<R, '__metadata'> extends false
  ? keyof R
  : Exclude<KeysOfUnion<_RT.ForceExtract<NonUndefined<_RT.ForceExtract<R, '__metadata'>>, 'types'>>, 'flagToUse'>;

// -- -- -- -- -- --
export type Concrete<T extends AnyObject> = Prettify<_Concrete<T>>;

type _Concrete<
  T extends Metadata<{ types: { flagToUse?: unknown[] } }>,
> = HasProperty<T, '__metadata'> extends false
  ? __ConcreteProperties<T>
  : __ConcreteProperties<NonUndefined<T['__metadata']>['types']>;

type __ConcreteProperties<T> = {
  [Key in keyof T]: IsStrictObject<T[Key]> extends true
    ? Concrete<T[Key]>
    : T[Key]
};