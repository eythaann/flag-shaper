import { AnyFunction, AnyObject, IsFunction, IteratorHKT, KeyOfObject, ModifyByKeyPlusOrderedCombinations, Prettify, TupleMapHKT } from 'readable-types';

import { BaseFlagger } from 'modules/shared/BaseFlagger/app';

import { AllowedFlags, IConfig } from 'modules/shared/domain/interfaces';

interface FnToObj extends IteratorHKT.Tuple<[string, AnyObject]> {
  return: [this['current'][0], IsFunction<this['current'][1]> extends true ? ReturnType<this['current'][1]> : this['current'][1]];
}
type OverFnToOverObj<T extends unknown[]> = TupleMapHKT<T, FnToObj>;

interface ObjUnionFn extends IteratorHKT.Tuple<[string, AnyObject]> {
  return: [this['current'][0], this['current'][1] | (() => this['current'][1])];
}

type _OverObjUnionFn<T extends unknown[]> = TupleMapHKT<T, ObjUnionFn>;

type Inferable =
  | null
  | string
  | number
  | boolean
  | AnyFunction
  | Array<JSON>
  | {
    [prop: string]: Inferable;
  };

export class ObjectFlagger<
  Flag extends AllowedFlags,
  Config extends IConfig,
  Over extends [Flag, AnyObject][] = [],
  ObjToApply extends AnyObject = {}
> extends BaseFlagger<Flag, Config> {
  private _overrides: [Flag, AnyObject][] = [];
  private objToApply: ObjToApply = {} as ObjToApply;

  public addCase<F extends Flag, V extends AnyObject>(flag: F, x: V) {
    this._overrides.push([flag, x]);
    return this as unknown as ObjectFlagger<Flag, Config, [...Over, [F, V]], ObjToApply>;
  }

  public get overrides() {
    return this._overrides as Over;
  }

  public setObjToOverwrite<K extends KeyOfObject, V extends Inferable, T extends Record<K, V>>(obj: T) {
    this.objToApply = obj as AnyObject;
    return this as unknown as ObjectFlagger<Flag, Config, Over, T>;
  };

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

  // TODO IMPLEMENTS ALL OVERLOADS -- deprecated comment maybe
  public build(): Prettify<ModifyByKeyPlusOrderedCombinations<ObjToApply, OverFnToOverObj<Over>, Config['keyForOverwrites']>> {
    const newObject: any = this.objToApply;

    this._overrides.forEach(([flag, override]: [Flag, AnyObject]) => {
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