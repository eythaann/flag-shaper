import { AnyObject } from 'readable-types';

import { ISelectorBuilder } from './domain';

class SelectorBuilder <State extends AnyObject> implements ISelectorBuilder<State> {
  public createSelector(path: any) {
    const selector = (state: any) => [path].flat().reduce((acc, current) => acc[current], state);
    selector.__metadata = path;
    return selector;
  };

  public createSelectorFrom(fn: any, path: any): any {
    const realPath = [...(fn.__metadata || []), ...path];
    const selector = (state: any) => [realPath].flat().reduce((acc, current) => {
      return acc[current];
    }, state);
    selector.__metadata = realPath;
    return selector;
  };
};

export const createSelectorBuilder = <State extends AnyObject>(): ISelectorBuilder<State> => {
  return new SelectorBuilder();
};