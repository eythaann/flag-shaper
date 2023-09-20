import { AnyFunction, AnyObject, HasProperty, IsUnknown, IteratorHKT, KeysOfUnion, NonUndefined, TupleReduceHKT } from 'readable-types';

import { Metadata } from '@shared/domain/interfaces';

interface extractTypeFormPath<state> extends IteratorHKT.Tuple {
  initialAcc: state;
  return: _RT.ForceExtract<this['acc'], this['current']>;
}

type SelectorByFlag<State extends AnyObject, Path extends unknown[]> = (
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

export interface ISelectorBuilder<State extends AnyObject> {
  createSelector<K extends getAllPosibleKeys<State, Metadata<[]>>>(key: K): SelectorByFlag<State, [K]>;
  createSelector<Path extends string[]>(path: [...Path]): SelectorByFlag<State, Path>;

  createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    Key extends getAllPosibleKeys<State, Fn>,
  >(fn: Fn, path: Key): SelectorByFlag<State, [...NonUndefined<Fn['__metadata']>, Key]>;

  createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    RestPath extends string[],
  >(fn: Fn, path: [...RestPath]): SelectorByFlag<State, [...NonUndefined<Fn['__metadata']>, ...RestPath]>;
}