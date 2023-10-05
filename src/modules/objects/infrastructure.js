import { ObjectBuilder } from './builder/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';

import { DUnionKey, DUnionKeyConnectedDispatch, DUnionKeyConnectedState } from '../shared/domain/constants';

export class FlagShaperForObjects extends BaseFlagger {
  builder() {
    return new ObjectBuilder(this.validator, this.config);
  };

  wasObjectDeclaredWith(obj, flags) {
    const objHasFlags = !!obj[DUnionKey]
    || !!obj[DUnionKeyConnectedState]
    || !!obj[DUnionKeyConnectedDispatch];

    if (flags.length === 0) {
      return !objHasFlags;
    }

    if (!objHasFlags) {
      return false;
    }

    const flagsOnObj = new Set();
    (obj[DUnionKey] || []).forEach((element) => flagsOnObj.add(element));
    (obj[DUnionKeyConnectedState] || []).forEach((element) => flagsOnObj.add(element));
    (obj[DUnionKeyConnectedDispatch] || []).forEach((element) => flagsOnObj.add(element));

    return flags.every((flag) => flagsOnObj.has(flag));
  }
}