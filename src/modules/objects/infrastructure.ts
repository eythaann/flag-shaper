import { AnyObject, IsFunction, IteratorHKT, ModifyByKeyPlusOrderedCombinations, NonUndefined, TupleMapHKT } from 'readable-types';

import { BaseFlagger } from '@shared/BaseFlagger/app';
import { customExtract } from './app';

import { AllowedFlags, IConfig, Metadata } from '@shared/domain/interfaces';
import { ConfigToConnect } from '@modules/jsx/domain';
import { NoInfer } from '@modules/redux/SliceTools/domain';

interface FnToObj extends IteratorHKT.Tuple<[string, AnyObject]> {
  return: [this['current'][0], IsFunction<this['current'][1]> extends true ? ReturnType<this['current'][1]> : this['current'][1]];
}
type OverFnToOverObj<T extends unknown[]> = TupleMapHKT<T, FnToObj>;

interface ObjUnionFn extends IteratorHKT.Tuple<[string, AnyObject]> {
  return: [this['current'][0], this['current'][1] | (() => this['current'][1])];
}

type OverObjUnionFn<T extends unknown[]> = TupleMapHKT<T, ObjUnionFn>;

export class FlagShaperForObjects<Flag extends AllowedFlags, Config extends IConfig> extends BaseFlagger<Flag, Config> {
  /*  public overwriteOnDeclaration<
    objWithMeta extends Metadata<ConfigToConnect>,
    _Case extends 'state',
    Obj = NonUndefined<NonUndefined<objWithMeta['__metadata']>['stateProps']>,
    Over = NonUndefined<NonUndefined<objWithMeta['__metadata']>['statePropsOverwrites']>,
  >(
    obj: Obj,
    overrides: OverObjUnionFn<Over>
  ): ModifyByKeyPlusOrderedCombinations<Obj, Over, Config['keyForOverwrites']>;

  public overwriteOnDeclaration<
    objWithMeta extends Metadata<ConfigToConnect>,
    _Case extends 'dispatch',
    Obj = NonUndefined<NonUndefined<objWithMeta['__metadata']>['dispatchProps']>,
    Over = NonUndefined<NonUndefined<objWithMeta['__metadata']>['dispatchPropsOverwrites']>,
  >(
    obj: Obj,
    overrides: OverObjUnionFn<Over>
  ): ModifyByKeyPlusOrderedCombinations<Obj, Over, Config['keyForOverwrites']>; */

  public overwriteOnDeclaration<
    Obj extends AnyObject,
    Over extends [[Flag, AnyObject], ...[Flag, AnyObject][]]
  >(obj: Obj, overrides: Over): ModifyByKeyPlusOrderedCombinations<Obj, OverFnToOverObj<Over>, Config['keyForOverwrites']>;

  // TODO IMPLEMENTS ALL OVERLOADS
  public overwriteOnDeclaration(obj: any, overrides: any): any {
    const newObject = obj;

    overrides.forEach(([flag, override]: [Flag, AnyObject]) => {
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

  // ========================================

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

  // ========================================

  public setOverridesToObject<
    Obj extends AnyObject,
    Over extends [[Flag, AnyObject], ...[Flag, AnyObject][]]
  >(obj: Obj, over: Over) {
    Object.defineProperty(obj, 'getOverwrittenObject', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: () => this.overwriteOnDeclaration(obj, over),
    });

    return obj as Obj & { getOverwrittenObject(): ModifyByKeyPlusOrderedCombinations<Obj, Over, Config['keyForOverwrites']> & {} };
  }
}