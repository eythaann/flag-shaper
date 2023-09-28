import { AnyObject } from 'readable-types';

import { MetadataKey } from 'modules/shared/domain/interfaces';
import { ISelectorBuilder } from './domain';

class SelectorBuilder <State extends AnyObject> implements ISelectorBuilder<State> {
  public createSelector(path: any) {
    const selector: any = (state: any) => [path].flat().reduce((acc, current) => acc[current], state);
    selector[MetadataKey] = path;
    return selector;
  };

  public createSelectorFrom(fn: any, path: any): any {
    const realPath = [...(fn[MetadataKey] || []), ...path];
    const selector: any = (state: any) => [realPath].flat().reduce((acc, current) => {
      return acc[current];
    }, state);
    selector[MetadataKey] = realPath;
    return selector;
  };
};

export const createSelectorBuilder = <State extends AnyObject>(): ISelectorBuilder<State> => {
  return new SelectorBuilder();
};