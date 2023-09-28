
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

  build() {
    const newObject = this.#objToApply;

    this.#overrides.forEach(([flag, override]) => {
      if (!this.validator.isFlagEnabled(flag)) {
        return;
      }

      const overObject = typeof override === 'function' ? override() : override;

      Object.assign(newObject, overObject);
      newObject[this.config.keyForOverwrites] ??= [];
      newObject[this.config.keyForOverwrites].push(flag);
    });

    return newObject;
  }
}