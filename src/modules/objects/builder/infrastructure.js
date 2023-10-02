
export class ObjectBuilder extends BaseFlagger {
  #overrides = [];
  #objToApply = {};

  addCase(flag, x) {
    this.#overrides.push([flag, x]);
    return this;
  }

  get overrides() {
    return this.#overrides;
  }

  setObjToOverwrite(obj) {
    this.#objToApply = obj;
    return this;
  };

  match() {
    return this;
  };

  build({ forState = false, forDispatch = false } = {}) {
    const newObject = this.#objToApply;
    const dispatchPostfix = forDispatch ? '_dispatch' : '';
    const keyToAddFlags = `${this.config.keyForOverwrites}${forState ? '_state' : dispatchPostfix}`;

    this.#overrides.forEach(([flag, override]) => {
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