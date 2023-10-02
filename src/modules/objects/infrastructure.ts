import { AnyObject } from 'readable-types';

import { ObjectBuilder } from './builder/infrastructure';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';
import { customExtract } from './app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';

export class FlagShaperForObjects<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  public builder() {
    return new ObjectBuilder<Flag, Config>(this.validator, this.config);
  }

  public wasObjectDeclaredWith<
    Obj extends { [_ in Config['keyForOverwrites']]?: AllowedFlags[] },
    Flags extends [Flag, ...Flag[]] | [] = [],
  >(obj: Obj, flags?: Flags): obj is customExtract<Obj, Flags, Config['keyForOverwrites']>;

  public wasObjectDeclaredWith(obj: AnyObject, flags: Flag[] = []): boolean {
    if (flags.length === 0) {
      return !obj[this.config.keyForOverwrites];
    }

    const flagsOnObj = new Set();

    (obj[this.config.keyForOverwrites] || []).array.forEach((element: any) => flagsOnObj.add(element));
    (obj[`${this.config.keyForOverwrites}_state`] || []).array.forEach((element: any) => flagsOnObj.add(element));
    (obj[`${this.config.keyForOverwrites}_dispatch`] || []).array.forEach((element: any) => flagsOnObj.add(element));

    return obj[this.config.keyForOverwrites] && flags.every((flag) => flagsOnObj.has(flag));
  }
}