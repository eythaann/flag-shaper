import { AnyFunction, AnyObject, NonUndefined } from 'readable-types';
import { Metadata } from '../../shared/domain/interfaces';
import { getAllPosibleKeys, SelectorByFlag } from '../app';

export class SelectorBuilder <
  State extends AnyObject
> {
  public createSelector<K extends getAllPosibleKeys<State, Metadata<[]>>>(key: K): SelectorByFlag<State, [K]>;
  public createSelector<Path extends string[]>(path: [...Path]): SelectorByFlag<State, Path>;
  public createSelector(path: any) {
    const selector = (state: any) => [path].flat().reduce((acc, current) => acc[current], state);
    selector.__metadata = path;
    return selector;
  }

  public createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    Key extends getAllPosibleKeys<State, Fn>,
  >(fn: Fn, path: Key): SelectorByFlag<State, [...NonUndefined<Fn['__metadata']>, Key]>;

  public createSelectorFrom<
    Fn extends AnyFunction & Metadata<string[]>,
    RestPath extends string[],
  >(fn: Fn, path: [...RestPath]): SelectorByFlag<State, [...NonUndefined<Fn['__metadata']>, ...RestPath]>;

  public createSelectorFrom(fn: any, path: any): any {
    const realPath = [...(fn.__metadata || []), ...path];
    const selector = (state: any) => [realPath].flat().reduce((acc, current) => {
      return acc[current];
    }, state);
    selector.__metadata = realPath;
    return selector;
  }
};