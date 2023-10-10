import { ObjectBuilder } from './builder/infrastructure';

import { BaseFlagger } from '../shared/BaseFlagger/app';
import { customExtract } from './app';

import { DUnionKey } from '../shared/domain/constants';
import { AllowedFlags } from '../shared/domain/interfaces';

export declare class FlagShaperForObjects<Flag extends AllowedFlags> extends BaseFlagger<Flag> {
  public builder(): ObjectBuilder<Flag>;

  public wasObjectDeclaredWith<
    Obj extends { [DUnionKey]?: AllowedFlags[] },
    Flags extends [Flag, ...Flag[]] | [] = [],
  >(obj: Obj, flags?: Flags): obj is customExtract<Obj, Flags>;
}