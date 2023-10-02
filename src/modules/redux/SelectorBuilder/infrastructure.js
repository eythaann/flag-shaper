import { MetadataKey } from 'modules/shared/domain/interfaces';

export class SelectorBuilder {
  createSelector(path) {
    const selector = (state) => [path].flat().reduce((acc, current) => acc[current], state);
    selector[MetadataKey] = path;
    return selector;
  };

  createSelectorFrom(fn, path) {
    const realPath = [...(fn[MetadataKey] || []), ...path];
    const selector = (state) => [realPath].flat().reduce((acc, current) => {
      return acc[current];
    }, state);
    selector[MetadataKey] = realPath;
    return selector;
  };
};