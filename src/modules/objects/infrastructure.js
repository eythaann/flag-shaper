import { ObjectBuilder } from './builder/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';

export class FlagShaperForObjects extends BaseFlagger {
  builder() {
    return new ObjectBuilder(this.validator, this.config);
  };

  wasObjectDeclaredWith(obj, flags) {
    const objHasFlags = !!obj[this.config.keyForOverwrites]
    || !!obj[`${this.config.keyForOverwrites}_state`]
    || !!obj[`${this.config.keyForOverwrites}_dispatch`];

    if (flags.length === 0) {
      return !objHasFlags;
    }

    if (!objHasFlags) {
      return false;
    }

    const flagsOnObj = new Set();
    (obj[this.config.keyForOverwrites] || []).forEach((element) => flagsOnObj.add(element));
    (obj[`${this.config.keyForOverwrites}_state`] || []).forEach((element) => flagsOnObj.add(element));
    (obj[`${this.config.keyForOverwrites}_dispatch`] || []).forEach((element) => flagsOnObj.add(element));

    return flags.every((flag) => flagsOnObj.has(flag));
  }
}