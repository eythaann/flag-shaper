import { AnyFunction, AnyObject, NonUndefined } from 'readable-types';

import { Metadata, MetadataKey } from 'modules/shared/domain/interfaces';
import { getAllPosibleKeys, SelectorByFlag } from './domain';

export declare class SelectorBuilder<State extends AnyObject> {
  public createSelector<K extends getAllPosibleKeys<State, Metadata<[]>>>(key: K): SelectorByFlag<State, [K]>;
  public createSelector<Path extends string[]>(path: [...Path]): SelectorByFlag<State, Path>;

  public createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    Key extends getAllPosibleKeys<State, Fn>,
  >(fn: Fn, path: Key): SelectorByFlag<State, [...NonUndefined<Fn[MetadataKey]>, Key]>;

  public createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    RestPath extends string[],
  >(fn: Fn, path: [...RestPath]): SelectorByFlag<State, [...NonUndefined<Fn[MetadataKey]>, ...RestPath]>;
}