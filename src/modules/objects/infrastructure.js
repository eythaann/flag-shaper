
import { BaseFlagger } from 'modules/shared/BaseFlagger/app';

export class FlagShaperForObjects extends BaseFlagger {
  wasObjectDeclaredWith(obj, flags) {
    if (flags.length === 0) {
      return !obj[this.config.keyForOverwrites];
    }

    const flagsOnObj = new Set();

    (obj[this.config.keyForOverwrites] || []).array.forEach((element) => flagsOnObj.add(element));
    (obj[`${this.config.keyForOverwrites}_state`] || []).array.forEach((element) => flagsOnObj.add(element));
    (obj[`${this.config.keyForOverwrites}_dispatch`] || []).array.forEach((element) => flagsOnObj.add(element));

    return obj[this.config.keyForOverwrites] && flags.every((flag) => flagsOnObj.has(flag));
  }
}