import { AnyFunction, AnyObject, HasProperty, IsUnknown, IteratorHKT, KeysOfUnion, NonUndefined, TupleReduceHKT } from 'readable-types';

import { Metadata, MetadataKey } from 'modules/shared/domain/interfaces';

interface extractTypeFormPath<state> extends IteratorHKT.Tuple {
  initialAcc: state;
  return: _RT.ForceExtract<this['acc'], this['current']>;
}

type SelectorByFlag<State extends AnyObject, Path extends unknown[]> = (
  <S extends IsUnknown<State[MetadataKey]> extends false
    ? S[MetadataKey] extends State[MetadataKey]
      ? Metadata<State[MetadataKey]>
      : Required<Metadata<State[MetadataKey]>>
    : State
  // @ts-ignore
  >(state: S) => TupleReduceHKT<Path, extractTypeFormPath<S>>
) & Metadata<Path>;

export type getAllPosibleKeys<
  State,
  Fn extends Metadata<string[]>,
  // @ts-ignore
  R = TupleReduceHKT<NonUndefined<Fn[MetadataKey]>, extractTypeFormPath<State>>
> = HasProperty<R, MetadataKey> extends false
  ? keyof R
  : Exclude<KeysOfUnion<_RT.ForceExtract<NonUndefined<_RT.ForceExtract<R, MetadataKey>>, 'types'>>, 'flagToUse'>;

export interface ISelectorBuilder<State extends AnyObject> {
  createSelector<K extends getAllPosibleKeys<State, Metadata<[]>>>(key: K): SelectorByFlag<State, [K]>;
  createSelector<Path extends string[]>(path: [...Path]): SelectorByFlag<State, Path>;

  createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    Key extends getAllPosibleKeys<State, Fn>,
  >(fn: Fn, path: Key): SelectorByFlag<State, [...NonUndefined<Fn[MetadataKey]>, Key]>;

  createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    RestPath extends string[],
  >(fn: Fn, path: [...RestPath]): SelectorByFlag<State, [...NonUndefined<Fn[MetadataKey]>, ...RestPath]>;
}