import { AnyObject } from 'readable-types';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';
import { customExtract } from './app';
import { ObjectFlagger } from './builder/app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';

export class FlagShaperForObjects<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  public builder() {
    return new ObjectFlagger<Flag, Config>(this.validator, this.config);
  }

  public wasObjectDeclaredWith<
    Obj extends { [_ in Config['keyForOverwrites']]?: AllowedFlags[] },
    Flags extends [Flag, ...Flag[]] | [] = [],
  >(obj: Obj, flags?: Flags): obj is customExtract<Obj, Flags, Config['keyForOverwrites']>;

  public wasObjectDeclaredWith(obj: AnyObject, flags: Flag[] = []): boolean {
    if (flags.length === 0) {
      return !obj[this.config.keyForOverwrites];
    }
    return obj[this.config.keyForOverwrites] && flags.every((flag) => obj[this.config.keyForOverwrites].includes(flag));
  }
}