import { AnyFunction, AnyObject, NonUndefined } from 'readable-types';

import { getAllPosibleKeys, SelectorByFlag } from '../app';

import { Metadata } from '@shared/domain/interfaces';

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