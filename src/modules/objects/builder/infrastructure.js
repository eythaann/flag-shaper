import { cloneDeep } from '../../shared/app/utils';
import { BaseFlagger } from '../../shared/BaseFlagger/app';;
export class ObjectBuilder extends BaseFlagger {
  _overrides = [];
  _objToApply = {};

  addCase(flag, x) {
    this._overrides.push([flag, x]);
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
    const dispatchPostfix = forDispatch ? '_dispatch' : '';
    const keyToAddFlags = `${this.config.keyForOverwrites}${forState ? '_state' : dispatchPostfix}`;

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