import { cloneDeep } from '../../shared/app/utils';
import { BaseFlagger } from '../../shared/BaseFlagger/app';

import { DUnionKey, DUnionKeyConnectedDispatch, DUnionKeyConnectedState } from '../../shared/domain/constants';

export class ObjectBuilder extends BaseFlagger {
  _overrides = [];
  _objToApply = {};

  addCase(flag, override) {
    this._overrides.push([flag, override]);
    return this;
  }

  get overrides() {
    return this._overrides;
  }

  setObjToOverwrite(obj) {
    this._objToApply = obj;
    return this;
  };

  /* match() {
    return this;
  }; */

  build({ forState = false, forDispatch = false } = {}) {
    const newObject = cloneDeep(this._objToApply);

    let keyToAddFlags = DUnionKey;

    if (forState) {
      keyToAddFlags = DUnionKeyConnectedState;
    }

    if (forDispatch) {
      keyToAddFlags = DUnionKeyConnectedDispatch;
    }

    this._overrides.forEach(([flag, override]) => {
      if (!this.validator.isFlagEnabled(flag)) {
        return;
      }

      const overObject = typeof override === 'function' ? override() : override;

      Object.assign(newObject, overObject);
      newObject[keyToAddFlags] ??= [];
      newObject[keyToAddFlags].push(flag);
    });

    return newObject;
  }
}