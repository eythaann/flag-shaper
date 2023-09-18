import { AnyFunction, AnyObject, KeyOfObject } from 'readable-types';
import { FlagShaperChecker } from '../checker';
import { AllowedFlags, IConfig, Metadata } from '../shared/domain/interfaces';
import { getAllPosibleKeys, SelectorByFlag } from './app';

type NonUndefined<T> = T extends undefined ? never : T;

export class ReduxFlagShaper<Flag extends AllowedFlags, Config extends IConfig> extends FlagShaperChecker<Flag, Config> {
  public readonly SelectorBuilder = class <
    State extends AnyObject
  > {
    createSelector<K extends getAllPosibleKeys<State, Metadata<[]>>>(key: K): SelectorByFlag<State, [K]>;
    createSelector<Path extends string[]>(path: [...Path]): SelectorByFlag<State, Path>;
    createSelector(path: any) {
      const selector = (state: any) => [path].flat().reduce((acc, current) => acc[current], state);
      selector.__metadata = path;
      return selector;
    }

    createSelectorFrom<
      Fn extends AnyFunction & Metadata<string[]>,
      Key extends getAllPosibleKeys<State, Fn>,
    >(fn: Fn, path: Key): SelectorByFlag<State, [...NonUndefined<Fn['__metadata']>, Key]>;

    createSelectorFrom<
      Fn extends AnyFunction & Metadata<string[]>,
      RestPath extends string[],
    >(fn: Fn, path: [...RestPath]): SelectorByFlag<State, [...NonUndefined<Fn['__metadata']>, ...RestPath]>;

    createSelectorFrom(fn: any, path: any): any {
      const realPath = [...(fn.__metadata || []), ...path];
      const selector = (state: any) => [realPath].flat().reduce((acc, current) => {
        return acc[current];
      }, state);
      selector.__metadata = realPath;
      return selector;
    }
  };
}