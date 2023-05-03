import { FlagShaperChecker } from "../checker/index";
import { AnyObject, UnionToIntersection, ValueOf } from "../shared/interfaces";

export class FlagShaperForObjects<Flag extends string> extends FlagShaperChecker<Flag> {

  public overrideOnDeclaration<Obj extends AnyObject, Over extends Partial<Record<Flag, AnyObject>>>(obj: Obj, overrides: Over) {
    Object.keys(overrides).forEach((key) => {
      if (this.isFlagEnabled(key as Flag)) {
        Object.assign(obj, overrides[key as Flag]);
      }
    })
    return obj as Obj & Partial<UnionToIntersection<ValueOf<Over>>>;
  }

  public setOverridesToObject<Obj extends AnyObject, Over extends Record<Flag, AnyObject>>(obj: Obj, overrides: Over) {
    Object.defineProperty(obj, 'getOverriddenObject', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: () => {
        const objWithOverrides = { ...obj }

        Object.keys(overrides).forEach((key) => {
          if (this.isFlagEnabled(key as Flag)) {
            Object.assign(objWithOverrides, overrides[key as Flag]);
          }
        })

        return objWithOverrides
      },
    })

    return obj as Obj & { getOverriddenObject(): Obj & Partial<UnionToIntersection<ValueOf<Over>>> };
  }
}